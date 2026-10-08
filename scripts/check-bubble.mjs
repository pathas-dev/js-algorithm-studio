import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true }, appType: 'custom' });
try {
  const { initialBubblePlayback, bubblePlaybackReducer: reduce, advanceBubblePlayback: advance } = await server.ssrLoadModule('/bubble-playback.ts');
  const { bubble } = await server.ssrLoadModule('/algorithms.ts');
  const { default: ArrayView } = await server.ssrLoadModule('/ArrayView.tsx');
  const { default: SpaceLesson } = await server.ssrLoadModule('/SpaceLesson.tsx');
  for (const language of ['ko', 'en']) {
    const initial = bubble.run([8, 3])[0];
    const markup = renderToString(React.createElement(SpaceLesson, { previous: initial, clock: { current: initialBubblePlayback(3) }, reduced: false, view: '3d', sky: false }, React.createElement(ArrayView, { step: initial, language })));
    assert(markup.includes('bubble-loading'), 'A cold scene reserves the canvas while its Three.js chunk loads');
    assert(!markup.includes('array-chart') && !markup.includes('class="bar"'), 'The old bar chart never flashes during planetary scene loading');
  }
  const { springProgress, workStar, planetRadius, planetSpacing, orbitalSwap, axialAngle, traceTransitionTime } = await server.ssrLoadModule('/bubble-motion.ts');
  const swapClock = { ...initialBubblePlayback(10), index: 3, playing: true, animate: true, elapsed: 1400 };
  const nextClock = advance(swapClock, 1400);
  assert.equal(traceTransitionTime(nextClock, 3, true), undefined, 'A clock that advances before React commits must not rewind the completed swap');
  assert.equal(traceTransitionTime(nextClock, 4, true), 0, 'The next committed swap starts from its previous slot');
  const midSwap = advance(nextClock, 700);
  assert.equal(traceTransitionTime(midSwap, 4, true), .5);
  assert.equal(traceTransitionTime(reduce(midSwap, { type: 'toggle', swap: true }), 4, true), .5, 'Pause preserves the rendered transfer');
  assert.equal(traceTransitionTime(reduce(midSwap, { type: 'seek', index: 7 }), 7, false), 1, 'Seeking resolves directly to exact positions');
  for (const id of [0, 1, 6]) {
    assert.equal(axialAngle(0, id), id * 0.8);
    assert.equal(axialAngle(-100, id), axialAngle(0, id));
    const first = axialAngle(1000, id) - axialAngle(0, id);
    assert(Math.abs(axialAngle(2000, id) - axialAngle(1000, id) - first) < 1e-12, 'axial spin has constant speed');
    for (const [radius, period] of [[0.13, 8], [0.33, 10], [0.53, 12]]) {
      assert(Math.abs(axialAngle(period * 1000, id, radius) - id * 0.8 - Math.PI * 2) < 1e-12, 'larger bodies have a longer rotation period');
    }
  }
  assert(axialAngle(1000, 0, 0.13) > axialAngle(1000, 0, 0.33));
  assert(axialAngle(1000, 0, 0.33) > axialAngle(1000, 0, 0.53));
  assert.equal(planetRadius(0, 8), 0.13);
  assert.equal(planetRadius(-3, 8), planetRadius(3, 8));
  assert.equal(planetRadius(8, 8), 0.53);
  assert(planetRadius(3, 8) > planetRadius(1, 8));
  assert(Number.isFinite(planetRadius(0, 1)));
  for (const values of [[8, 8, 8], [-3, 0, 2.5, -3, 8], [0, 0], Array(32).fill(9)]) {
    const maximum = Math.max(1, ...values.map(Math.abs));
    const spacing = planetSpacing(values, maximum);
    const envelope = Math.max(...values.map((value) => planetRadius(value, maximum) * 1.7));
    let previousPoint = orbitalSwap(0, spacing, 0);
    let distance;
    for (let i = 1; i <= 100; i += 1) {
      const a = orbitalSwap(0, spacing, i / 100);
      const b = orbitalSwap(spacing, 0, i / 100);
      assert(Math.hypot(a[0] - b[0], a[1] - b[1]) > envelope * 2, 'ring envelopes never intersect during a swap');
      const traveled = Math.hypot(a[0] - previousPoint[0], a[1] - previousPoint[1]);
      if (distance !== undefined) assert(Math.abs(traveled - distance) < 1e-12, 'equal time slices travel equal distances');
      distance = traveled;
      previousPoint = a;
    }
    assert.deepEqual(orbitalSwap(0, spacing, 0), [0, 0]);
    assert.equal(orbitalSwap(0, spacing, 1)[0], spacing);
  }
  assert.equal(springProgress(0), 0);
  assert.equal(springProgress(1), 1);
  assert(springProgress(0.4) > 1, 'damped swaps have a small settling overshoot');
  for (const count of [1, 7, 128, 8128]) {
    const cells = Array.from({ length: count }, (_, index) => workStar(index));
    assert.equal(new Set(cells.map((cell) => cell.join(','))).size, count, 'one distinct star per operation');
    assert(cells.every((cell) => cell.every(Number.isFinite) && Math.hypot(...cell) < 3.2));
    assert.deepEqual(cells[0], [0, 0, 0]);
  }
  let state = reduce(initialBubblePlayback(4), { type: 'toggle' });
  assert.equal(state.index, 1, 'play immediately starts the first pending action');
  assert.equal(state.elapsed, 0);
  assert.equal(state.animate, true);
  state = advance(state, 2799);
  assert.equal(state.index, 1);
  assert.equal(state.time, 5599);
  state = advance(state, 1);
  assert.equal(state.index, 2);
  const halfway = reduce(advance(state, 700), { type: 'toggle' });
  assert.deepEqual(advance(halfway, 20000), halfway);
  assert.deepEqual(reduce(halfway, { type: 'toggle', swap: true }), { ...halfway, playing: true }, 'an unfinished swap resumes without skipping or resetting its progress');
  assert.equal(reduce(halfway, { type: 'toggle' }).index, 3, 'a comparison has no spatial animation to finish, so resume starts its pending action immediately');
  const dwell = reduce(advance(state, 1800), { type: 'toggle' });
  const continued = reduce(dwell, { type: 'toggle' });
  assert.equal(continued.index, 3, 'resume bypasses a completed action’s idle tail');
  assert.equal(continued.elapsed, 0);
  state = reduce(state, { type: 'speed', speed: 2 });
  state = advance(state, 1400);
  assert.equal(state.index, 3);
  assert.equal(state.phase, 'hold');
  assert.equal(state.time, 8400, 'background time continues across steps and follows speed');
  state = reduce(state, { type: 'speed', speed: 1 });
  for (const phase of ['hold', 'erode', 'form']) {
    assert.equal(state.phase, phase);
    state = advance(state, 500);
    const paused = reduce(state, { type: 'toggle' });
    assert.deepEqual(advance(paused, 20000), paused, `${phase}: pause must freeze the whole scene`);
    state = reduce(paused, { type: 'toggle' });
    state = advance(state, phase === 'form' ? 2500 : 5500);
  }
  assert.equal(state.phase, 'sort');
  assert.equal(state.index, 0);
  assert.equal(state.playing, true);
  const sought = reduce({ ...state, phase: 'erode', elapsed: 2000 }, { type: 'seek', index: 1 });
  assert.equal(sought.phase, 'sort');
  assert.equal(sought.elapsed, 0);
  assert.equal(sought.time, 2800, 'seeking restores a deterministic background snapshot');
  assert.equal(sought.animate, false);
  assert.equal(sought.playing, false);
  const afterSeek = reduce(sought, { type: 'toggle' });
  assert.equal(afterSeek.index, 2, 'play after seeking starts the next action immediately');
  assert.equal(afterSeek.elapsed, 0);
  const stopped = advance(reduce(initialBubblePlayback(2), { type: 'loop', loop: false }), 10000);
  assert.equal(stopped.index, 0); // Paused states never advance.
  const oneRun = advance(reduce(stopped, { type: 'toggle' }), 2800);
  assert.equal(oneRun.index, 1);
  assert.equal(oneRun.playing, false);
  assert.equal(oneRun.time, 2800);
  const overshot = advance(reduce(stopped, { type: 'toggle' }), 10000);
  assert.equal(overshot.time, 2800, 'finite playback stops its background at the final step');
  const loopOff = reduce({ ...state, phase: 'erode' }, { type: 'loop', loop: false });
  assert.equal(loopOff.index, 3);
  assert.equal(loopOff.phase, 'sort');
  assert.equal(loopOff.playing, false);
  const reduced = advance({ ...initialBubblePlayback(2), playing: true, reduced: true }, 8800);
  assert.equal(reduced.phase, 'sort');
  assert.equal(reduced.index, 0);
  for (const values of [[], [0], [-3, 2, -3, 0, 1.5], Array.from({ length: 32 }, (_, i) => 31 - i)]) {
    const source = [...values];
    const trace = bubble.run(values);
    assert.deepEqual(values, source);
    assert.equal(trace.at(-1).type, 'done');
    assert.deepEqual(trace.at(-1).array.map((item) => item.value), [...values].sort((a, b) => a - b));
    assert.equal(new Set(trace.at(-1).array.map((item) => item.id)).size, values.length);
    const total = (trace.length - 1) * 2800 + 15000;
    const cycled = advance({ ...initialBubblePlayback(trace.length), playing: true }, total);
    assert.equal(cycled.index, 0);
    assert.equal(cycled.phase, 'sort');
    assert.equal(cycled.playing, true);
    assert.equal(cycled.time, total, 'background time stays continuous through erosion and reformation');
  }
  console.log('Checked slow timing, all loop phases, pause/resume, speed, seeking, loop off, reduced motion, and four input shapes.');
} finally { await server.close(); }
