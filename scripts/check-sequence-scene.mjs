import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true, watch: null } });
try {
  const { sequenceModel, sequencePorts, sequenceScanner, sequencePosition, sequenceMotion, sequenceSceneSupported, display } = await server.ssrLoadModule('/sequence-scene.ts');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { initialBubblePlayback, advanceBubblePlayback, bubblePlaybackReducer } = await server.ssrLoadModule('/bubble-playback.ts');
  const { traceTransitionTime } = await server.ssrLoadModule('/bubble-motion.ts');
  const { default: SpaceLesson } = await server.ssrLoadModule('/SpaceLesson.tsx');
  const { default: LessonView } = await server.ssrLoadModule('/LessonView.tsx');
  let checked = 0;
  for (const id of ['stack', 'queue', 'naive-search', 'kmp', 'rabin-karp']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    const steps = algorithm.run(algorithm.example, undefined, undefined, undefined, algorithm.operations);
    const capacity = Math.max(1, ...steps.map((step) => step.array.length));
    for (const [index, step] of steps.entries()) {
      assert(sequenceSceneSupported(step), `${id}: available throughout the trace`);
      const model = sequenceModel(step);
      const before = sequenceModel(steps[Math.max(0, index - 1)]);
      assert.equal(new Set(model.tokens.map((token) => token.id)).size, model.tokens.length, 'Duplicate values retain separate identities');
      for (const token of model.tokens) {
        const prior = before.tokens.find((entry) => entry.id === token.id);
        assert.deepEqual(sequencePosition(token, prior, 1), token.position, 'Every transfer ends at its real slot');
        if (prior) assert.deepEqual(sequencePosition(token, prior, 0), prior.position, 'Retained tokens start at their previous slots');
        assert(sequencePosition(token, prior, .5, capacity).every(Number.isFinite));
      }
      if (model.linear) assert.deepEqual(model.tokens.map((token) => token.label), step.array.map((item) => String(item.value)));
      else {
        const scanner = sequenceScanner(step, steps[Math.max(0, index - 1)], 1);
        assert.equal(scanner.visible, step.variables.pattern.length > 0);
        assert.equal(scanner.x, Number(step.variables.alignment) * .9 + (step.variables.pattern.length - 1) * .45);
        if (step.variables.phase === 'prefix') assert.equal(scanner.reading, false, 'Prefix construction does not scan the text');
        if (scanner.beam !== undefined) {
          assert.equal(step.type, 'compare', 'A character beam represents a real character comparison');
          assert.equal(scanner.beam, step.variables.textIndex * .9);
        }
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
  const hatch = sequencePorts(3, true);
  assert.deepEqual(hatch.entry, hatch.exit, 'Stack has exactly one shared entrance and exit');
  assert.deepEqual(sequencePosition(undefined, removed, 1, 3), hatch.exit);
  assert.deepEqual(sequencePosition(removed, undefined, 0, 3), hatch.entry);
  assert.equal(sequencePosition(undefined, removed, .5, 3)[0], 0, 'TOP moves vertically through its hatch');
  assert(hatch.entry[1] > removed.position[1]);
  const emptyPop = stackSteps.findLast((step) => step.type === 'pop');
  assert.deepEqual(sequenceModel(emptyPop).tokens, []);
  assert.equal(sequenceMotion(emptyPop, emptyPop), false);
  const peekSteps = stack.run([1], undefined, undefined, undefined, 'peek');
  const peek = peekSteps.find((step) => step.type === 'peek');
  assert(sequenceMotion(peek, peekSteps[peekSteps.indexOf(peek) - 1]), 'TOP scanning shares the pausable trace clock');
  const emptyPeek = stack.run([], undefined, undefined, undefined, 'peek').find((step) => step.type === 'peek');
  assert.equal(sequenceMotion(emptyPeek, emptyPeek), false, 'An empty bay has no phantom scan');
  for (const id of ['naive-search', 'kmp', 'rabin-karp']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    for (const input of [['', ''], ['ABC', ''], ['', 'A'], [' A\t\n😀A', '😀'], ['A'.repeat(48), 'A'.repeat(16)]]) {
      for (const step of algorithm.run(input)) {
        const model = sequenceModel(step);
        assert(model.tokens.every((token) => token.position.every(Number.isFinite)));
        assert(model.center.every(Number.isFinite));
        const scanner = sequenceScanner(step, step, .5);
        if (!input[1].length) { assert.equal(scanner.visible, false); assert.equal(scanner.beam, undefined); }
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
  const ports = sequencePorts(3, false);
  assert.deepEqual(sequencePosition(undefined, front, 1, 3), ports.exit);
  assert.deepEqual(sequencePosition(rear, undefined, 0, 3), ports.entry);
  const beforeQueue = sequenceModel(queueSteps[queueSteps.indexOf(dequeue) - 1]);
  const afterQueue = sequenceModel(dequeue);
  for (const t of [0, .25, .5, .75, 1]) {
    const positions = beforeQueue.tokens.map((token) => sequencePosition(afterQueue.tokens.find((entry) => entry.id === token.id), token, t, 3));
    assert(positions.every((point) => point[1] === 0), 'Cargo stays on the transfer rail');
    assert(positions.slice(1).every((point, index) => point[0] - positions[index][0] >= 1.09), 'FIFO cargo cannot overtake or collide');
  }
  const shifted = { variables: { pattern: 'ABC', alignment: 4 }, type: 'shift' };
  const priorShift = { variables: { pattern: 'ABC', alignment: 2 }, type: 'compare' };
  assert.equal(sequenceScanner(shifted, priorShift, .5).x, 3 * .9 + .9, 'Scan head follows the same interpolated alignment as the pattern');
  for (const id of ['z-search', 'hamming-distance', 'palindrome']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    assert(!sequenceSceneSupported(algorithm.run(algorithm.example)[0]), 'Other string lessons keep their established view');
  }
  console.log(`Checked ${checked} sequence traces: identities, stack levels, UTF-16 alignment, pause/resume/seek, reduced-motion records and empty/long inputs.`);
} finally { await server.close(); }
