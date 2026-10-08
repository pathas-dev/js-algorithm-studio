import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true, watch: null } });
try {
  const { sequenceModel, sequencePosition, sequenceMotion, sequenceSceneSupported, display } = await server.ssrLoadModule('/sequence-scene.ts');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { initialBubblePlayback, advanceBubblePlayback, bubblePlaybackReducer } = await server.ssrLoadModule('/bubble-playback.ts');
  const { traceTransitionTime } = await server.ssrLoadModule('/bubble-motion.ts');
  const { default: SpaceLesson } = await server.ssrLoadModule('/SpaceLesson.tsx');
  const { default: LessonView } = await server.ssrLoadModule('/LessonView.tsx');
  let checked = 0;
  for (const id of ['stack', 'queue', 'naive-search', 'kmp', 'rabin-karp']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    const steps = algorithm.run(algorithm.example, undefined, undefined, undefined, algorithm.operations);
    for (const [index, step] of steps.entries()) {
      assert(sequenceSceneSupported(step), `${id}: available throughout the trace`);
      const model = sequenceModel(step);
      const before = sequenceModel(steps[Math.max(0, index - 1)]);
      assert.equal(new Set(model.tokens.map((token) => token.id)).size, model.tokens.length, 'Duplicate values retain separate identities');
      for (const token of model.tokens) {
        const prior = before.tokens.find((entry) => entry.id === token.id);
        assert.deepEqual(sequencePosition(token, prior, 1), token.position, 'Every transfer ends at its real slot');
        if (prior) assert.deepEqual(sequencePosition(token, prior, 0), prior.position, 'Retained tokens start at their previous slots');
        assert(sequencePosition(token, prior, .5).every(Number.isFinite));
      }
      if (model.linear) assert.deepEqual(model.tokens.map((token) => token.label), step.array.map((item) => String(item.value)));
      else {
        assert.deepEqual(model.tokens.filter((token) => token.row === 'text').map((token) => token.label), step.variables.text.split('').map(display));
        for (const token of model.tokens.filter((token) => token.row === 'pattern')) {
          assert.equal(token.position[0], (token.index + Number(step.variables.alignment)) * .9, 'Pattern follows exact UTF-16 alignment');
        }
      }
      if (index && sequenceMotion(step, steps[index - 1])) {
        const state = { ...initialBubblePlayback(steps.length), index, playing: true, animate: true, elapsed: 650, loop: false };
        const paused = bubblePlaybackReducer(state, { type: 'toggle', swap: true });
        assert.deepEqual(advanceBubblePlayback(paused, 10000), paused);
        assert.equal(bubblePlaybackReducer(paused, { type: 'toggle', swap: sequenceMotion(step, steps[index - 1]) }).elapsed, 650, 'Resume retains pending insertions, removals and string shifts');
        const seek = bubblePlaybackReducer(state, { type: 'seek', index });
        assert.equal(traceTransitionTime(seek, index, seek.animate), 1, 'Seek resolves directly to exact state');
        assert.equal(traceTransitionTime({ ...state, index: index + 1 }, index, true), undefined, 'An older render cannot follow a newer clock');
      }
      for (const view of ['2d', '3d']) {
        const markup = renderToStaticMarkup(React.createElement(SpaceLesson, {
          previous: steps[Math.max(0, index - 1)], clock: { current: initialBubblePlayback(steps.length) }, reduced: true, view, sky: false,
        }, React.createElement(LessonView, { algorithm, step, language: 'en' })));
        assert(!markup.includes('sequence-3d'), 'Reduced motion preserves the exact 2D record');
        if (model.linear) assert(markup.includes('Current data structure'));
        else assert(markup.includes('UTF-16 code units'));
      }
      checked += 1;
    }
  }
  const stack = algorithms.find((entry) => entry.id === 'stack');
  const stackSteps = stack.run([-3, -3, 0], undefined, undefined, undefined, 'pop, pop, pop, pop');
  const populated = stackSteps.findLast((step) => step.array.length === 3);
  const popped = stackSteps[stackSteps.indexOf(populated) + 1];
  assert.equal(sequenceModel(populated).tokens[0].position[1], 1.9, 'TOP is above the older nodes');
  const remaining = sequenceModel(popped);
  for (const token of remaining.tokens) assert.deepEqual(token.position, sequenceModel(populated).tokens.find((item) => item.id === token.id).position, 'Pop keeps the remaining stack levels');
  const removed = sequenceModel(populated).tokens[0];
  assert(sequencePosition(undefined, removed, 1)[0] > removed.position[0], 'Removed TOP departs sideways');
  const emptyPop = stackSteps.findLast((step) => step.type === 'pop');
  assert.deepEqual(sequenceModel(emptyPop).tokens, []);
  assert.equal(sequenceMotion(emptyPop, emptyPop), false);
  for (const id of ['naive-search', 'kmp', 'rabin-karp']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    for (const input of [['', ''], ['ABC', ''], ['', 'A'], [' A\t\n😀A', '😀'], ['A'.repeat(48), 'A'.repeat(16)]]) {
      for (const step of algorithm.run(input)) {
        const model = sequenceModel(step);
        assert(model.tokens.every((token) => token.position.every(Number.isFinite)));
        assert(model.center.every(Number.isFinite));
      }
    }
  }
  assert.equal(display(' '), '␠');
  assert.equal(display('\t'), '⇥');
  assert.equal(display('\n'), '↵');
  assert.equal(display('\uD83D'), 'D83D');
  const queue = algorithms.find((entry) => entry.id === 'queue');
  const queueSteps = queue.run([-3, -3, 0], undefined, undefined, undefined, 'dequeue, enqueue 9');
  const dequeue = queueSteps.find((step) => step.type === 'dequeue');
  const front = sequenceModel(queueSteps[queueSteps.indexOf(dequeue) - 1]).tokens[0];
  assert(sequencePosition(undefined, front, 1)[0] < front.position[0], 'The real FRONT leaves to the left');
  const enqueue = queueSteps.findLast((step) => step.type === 'enqueue');
  const rear = sequenceModel(enqueue).tokens.at(-1);
  assert.equal(rear.label, '9');
  assert(sequencePosition(rear, undefined, 0)[0] > rear.position[0], 'The real REAR arrives from the right');
  for (const id of ['z-search', 'hamming-distance', 'palindrome']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    assert(!sequenceSceneSupported(algorithm.run(algorithm.example)[0]), 'Other string lessons keep their established view');
  }
  console.log(`Checked ${checked} sequence traces: identities, stack levels, UTF-16 alignment, pause/resume/seek, reduced-motion records and empty/long inputs.`);
} finally { await server.close(); }
