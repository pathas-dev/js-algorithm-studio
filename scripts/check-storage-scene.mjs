import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true, watch: null } });
try {
  const { storageModel, storageMotion, storagePosition, storageSceneSupported, storageSlotPosition } = await server.ssrLoadModule('/storage-scene.ts');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { default: SpaceLesson } = await server.ssrLoadModule('/SpaceLesson.tsx');
  const { default: LessonView } = await server.ssrLoadModule('/LessonView.tsx');
  const { default: StorageScene } = await server.ssrLoadModule('/StorageScene.tsx');
  const { initialBubblePlayback, bubblePlaybackReducer, advanceBubblePlayback } = await server.ssrLoadModule('/bubble-playback.ts');
  const { traceTransitionTime } = await server.ssrLoadModule('/bubble-motion.ts');
  let checked = 0;
  let valueUpdates = 0;
  let swaps = 0;
  for (const id of ['min-heap', 'max-heap', 'priority-queue', 'hash-table']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    const hash = id === 'hash-table';
    const inputs = [[algorithm.example, algorithm.operations], [[], hash ? 'get missing, delete missing' : 'poll, peek'],
      hash ? [['ab', 'ba', '汉字', '😀', '__proto__'], 'set ab updated, delete ba, set ba again, get ab']
        : id === 'priority-queue' ? [[-3, 0, 1.5], 'changePriority 0 -9, remove -3, add -3 7, poll']
          : [[-3, -3, 0, 1.5], 'add -3, poll, poll'],
      hash ? [['aa','ai','aq','ay','ia','ii','iq','iy','qa','qi','qq','qy'], 'get qy, delete aa']
        : [Array.from({ length: 32 }, (_, index) => index - 16), 'poll, poll']];
    for (const [values, operations] of inputs) {
      const steps = algorithm.run(values, undefined, undefined, undefined, operations);
      const capacity = Math.max(...steps.map((step) => step.array.length));
      for (const [index, step] of steps.entries()) {
        const prior = steps[Math.max(0, index - 1)];
        const model = storageModel(step, capacity);
        const before = storageModel(prior, capacity);
        assert(storageSceneSupported(step));
        assert.equal(new Set(model.units.map((unit) => unit.id)).size, model.units.length);
        if (hash) {
          const buckets = JSON.parse(step.variables.hashTable);
          assert.equal(model.slots.length, 8);
          buckets.forEach((bucket, address) => assert.deepEqual(model.units.filter((unit) => unit.slot === address).map((unit) => ({ key: unit.id, value: unit.value })), bucket));
        } else {
          assert.deepEqual(model.units.map((unit) => [unit.id, unit.value]), step.array.map((item) => [String(item.id), String(item.value)]));
          assert.deepEqual(model.links, model.units.slice(1).map((_, child) => [Math.floor(child / 2), child + 1]));
          model.units.forEach((unit) => assert.equal(unit.priority, id === 'priority-queue' ? JSON.parse(step.variables.priorities)[unit.value] : undefined));
        }
        if (!hash && step.type === 'swap') {
          model.slots.forEach((_, slot) => assert.deepEqual(storageSlotPosition(model, slot), storageSlotPosition(before, slot), 'Index and ROOT tags remain at fixed slots while values exchange'));
          const moving = model.units.find((unit) => before.units.find((entry) => entry.id === unit.id)?.slot !== unit.slot);
          assert(moving, 'A real swap moves a stable item ID between fixed slots');
          const previous = before.units.find((entry) => entry.id === moving.id);
          assert.notDeepEqual(storagePosition(moving, previous, .5), moving.position);
          swaps++;
        }
        for (const unit of model.units) {
          const previous = before.units.find((entry) => entry.id === unit.id);
          assert.deepEqual(storagePosition(unit, previous, 1), unit.position);
          if (previous) assert.deepEqual(storagePosition(unit, previous, 0), previous.position);
          assert(storagePosition(unit, previous, .5).every(Number.isFinite));
          if (previous && (unit.value !== previous.value || unit.priority !== previous.priority)) { assert(storageMotion(step, prior)); valueUpdates++; }
        }
        const state = { ...initialBubblePlayback(steps.length), index, animate: true, playing: true, elapsed: 650 };
        const paused = bubblePlaybackReducer(state, { type: 'toggle', swap: true });
        assert.deepEqual(advanceBubblePlayback(paused, 10000), paused);
        if (storageMotion(step, prior)) assert.equal(bubblePlaybackReducer(paused, { type: 'toggle', swap: storageMotion(step, prior) }).elapsed, 650);
        assert.equal(traceTransitionTime(bubblePlaybackReducer(state, { type: 'seek', index }), index, false), 1);
        assert.equal(traceTransitionTime({ ...state, index: index + 1 }, index, true), undefined);
        for (const language of ['ko', 'en']) {
          const fallback = React.createElement(LessonView, { algorithm, step, language });
          const props = { previous: prior, clock: { current: state }, reduced: true, view: '3d', sky: false, capacity };
          const markup = renderToStaticMarkup(React.createElement(SpaceLesson, props, fallback));
          assert(!markup.includes('storage-3d'));
          assert(markup.includes(hash ? 'hash-buckets' : '<svg'));
          const scene = renderToStaticMarkup(React.createElement(SpaceLesson, { ...props, reduced: false }, React.createElement(StorageScene, { step, language, fallback })));
          assert(scene.includes('Inspect exact storage state') || scene.includes('정확한 저장 상태 보기'));
        }
        checked++;
      }
    }
  }
  assert(swaps > 0, 'Exercise fixed-slot labels against actual heap swap traces');
  assert(valueUpdates > 0, 'Same-key updates and priority changes remain animation events');
  for (const id of ['heap', 'dijkstra', 'prim', 'stack']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    if (algorithm) assert(algorithm.run(algorithm.example, algorithm.target, algorithm.edges, algorithm.directed).every((step) => !storageSceneSupported(step)), 'Unrelated algorithm heap views retain their existing renderer');
  }
  console.log(`Checked ${checked} storage snapshots: heap identities/parents/priorities, exact collision chains, overwrites/deletion, empty/duplicate/32-item/12-key inputs, pause/resume/seek and bilingual fallback.`);
} finally { await server.close(); }
