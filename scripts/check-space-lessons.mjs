import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true, watch: null } });
try {
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { default: LessonView } = await server.ssrLoadModule('/LessonView.tsx');
  const { default: SpaceLesson } = await server.ssrLoadModule('/SpaceLesson.tsx');
  const { default: HanoiScene, hanoiPositions, hanoiPosition } = await server.ssrLoadModule('/HanoiScene.tsx');
  const { initialBubblePlayback, bubblePlaybackReducer: reduce, advanceBubblePlayback: advance } = await server.ssrLoadModule('/bubble-playback.ts');
  const { planetTransfer, planetSpacing, planetRadius } = await server.ssrLoadModule('/bubble-motion.ts');
  const spacing = planetSpacing([8, 8, 8, 8], 8);
  for (const slots of [2, 7, 31]) for (let sample = 0; sample <= 100; sample += 1) {
    const a = planetTransfer(0, slots * spacing, sample / 100, spacing);
    const b = planetTransfer(slots * spacing, 0, sample / 100, spacing);
    assert(Math.hypot(a[0] - b[0], a[1] - b[1]) > planetRadius(8, 8) * 3.4, 'Distant transfers keep ring envelopes apart');
    for (let slot = 1; slot < slots; slot += 1) assert(Math.hypot(a[0] - slot * spacing, a[1]) > planetRadius(8, 8) * 3.4, 'Transfer clears every intervening planet');
    assert(Math.abs(a[1]) <= spacing * 1.05, 'Distant swaps stay within the observation window');
  }
  const moving = advance(reduce({ ...initialBubblePlayback(9), loop: false }, { type: 'toggle' }), 700);
  const paused = reduce(moving, { type: 'toggle', swap: true });
  assert.deepEqual(advance(paused, 10000), paused, 'Pause freezes a ring transfer');
  assert.equal(reduce(paused, { type: 'toggle', swap: true }).elapsed, moving.elapsed, 'Resume continues the in-flight ring');
  let inspected = 0;
  for (const algorithm of algorithms) {
    const steps = ['text', 'words'].includes(algorithm.inputMode)
      ? algorithm.run(algorithm.example, undefined, undefined, undefined, algorithm.operations)
      : algorithm.run(algorithm.example, algorithm.target, algorithm.graphEdges, algorithm.graphDirected, algorithm.operations);
    const samples = new Set([0, Math.floor(steps.length / 2), steps.length - 1]);
    for (const type of new Set(steps.map((step) => step.type))) samples.add(steps.findIndex((step) => step.type === type));
    for (const index of samples) for (const language of ['ko', 'en']) {
      const markup = renderToStaticMarkup(React.createElement(SpaceLesson, {
        previous: steps[Math.max(0, index - 1)], clock: { current: initialBubblePlayback(steps.length) }, reduced: true, view: '3d', sky: true,
      }, React.createElement(LessonView, { algorithm, step: steps[index], language })));
      assert(!/(?:cx|cy|x|y|width|height|r|d|points)="[^"]*(?:NaN|Infinity|undefined)/.test(markup), `${algorithm.id}/${steps[index].type}/${language}: invalid geometry`);
      assert(markup.includes('space-lesson-content'), `${algorithm.id}: missing observation scene`);
      inspected += 1;
    }
    const state = reduce({ ...initialBubblePlayback(steps.length), loop: false }, { type: 'toggle' });
    assert.equal(state.index, Math.min(1, steps.length - 1), `${algorithm.id}: play starts immediately`);
    const end = advance(state, steps.length * 2800);
    assert.equal(end.index, steps.length - 1);
    assert.equal(end.playing, false, `${algorithm.id}: finite lesson stops at its real result`);
  }
  const hanoi = algorithms.find((algorithm) => algorithm.id === 'hanoi-tower');
  for (const n of [1, 3, 6]) {
    const steps = hanoi.run([n]);
    for (let index = 0; index < steps.length; index += 1) {
      const step = steps[index];
      const rings = hanoiPositions(JSON.parse(step.variables.poles));
      const previous = hanoiPositions(JSON.parse(steps[Math.max(0, index - 1)].variables.poles));
      assert.equal(rings.length, n, 'No lost or duplicated Hanoi ring');
      assert.equal(new Set(rings.map((ring) => ring.disc)).size, n);
      for (const ring of rings) {
        const from = previous.find((entry) => entry.disc === ring.disc);
        for (const [actual, expected] of [[hanoiPosition(ring, from, 0), hanoiPosition(from, from, 1)], [hanoiPosition(ring, from, 1), hanoiPosition(ring, ring, 1)]]) assert(actual.every((value, axis) => Math.abs(value - expected[axis]) < 1e-9));
        assert(hanoiPosition(ring, from, .5).every(Number.isFinite));
        if (from.pole !== ring.pole) assert(hanoiPosition(ring, from, .5)[1] > Math.max(hanoiPosition(from, from, 1)[1], hanoiPosition(ring, ring, 1)[1]));
      }
    }
    const end = steps.at(-1);
    const markup = renderToStaticMarkup(React.createElement(HanoiScene, { step: end, language: 'ko' }));
    assert(markup.includes(`[${Array.from({ length: n }, (_, i) => i + 1).join(', ')}]`), 'Fallback preserves actual top-to-bottom stack');
  }
  console.log(`Checked ${algorithms.length} lessons, ${inspected} bilingual trace renders, immediate finite playback, and Hanoi ring endpoints for n=1,3,6.`);
} finally { await server.close(); }
