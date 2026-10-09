import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true, watch: null } });
try {
  const { treeModel, treeMotion, treePosition, treeArmProgress, treeLabel, treeTransferText, treeSceneSupported } = await server.ssrLoadModule('/tree-scene.ts');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { default: SpaceLesson } = await server.ssrLoadModule('/SpaceLesson.tsx');
  const { default: LessonView } = await server.ssrLoadModule('/LessonView.tsx');
  const { default: TreeScene } = await server.ssrLoadModule('/TreeScene.tsx');
  const { initialBubblePlayback, bubblePlaybackReducer, advanceBubblePlayback } = await server.ssrLoadModule('/bubble-playback.ts');
  const { traceTransitionTime } = await server.ssrLoadModule('/bubble-motion.ts');
  let checked = 0;
  let rotations = 0;
  let middleTransfers = 0;
  let valueReplacements = 0;
  const cases = new Set();
  for (const id of ['binary-search-tree', 'avl-tree']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    const inputs = [[algorithm.example, algorithm.operations], [[], 'find 0'], [[2], 'remove 2, insert -1.5, remove -1.5'],
      [[-3, -3, 0, 1.5], 'find -3, remove 0'], [[8,4,12,2,6,10,14,5,7], 'remove 4, remove 8'],
      [Array.from({ length: 12 }, (_, index) => index), 'find 11, remove 0, remove 6']];
    if (id === 'avl-tree') inputs.push(...[[30,20,10], [10,20,30], [30,10,20], [10,30,20], [30,20,40,10,25,5], [20,10,30,25,40,50]].map((values) => [values, '']), [[8,4,12,2,6,10,14,1,3,5,7], 'remove 14, remove 12, remove 10']);
    for (const [values, operations] of inputs) {
      const steps = algorithm.run(values, undefined, undefined, undefined, operations);
      const capacity = Math.max(1, ...steps.map((step) => step.array.length));
      for (const [index, step] of steps.entries()) {
        const prior = steps[Math.max(0, index - 1)];
        const model = treeModel(step, capacity);
        const before = treeModel(prior, capacity);
        const raw = JSON.parse(step.variables.tree);
        assert(treeSceneSupported(step));
        assert.equal(new Set(model.units.map((unit) => unit.id)).size, model.units.length);
        assert.deepEqual(model.units.map(({ position, active, ...node }) => node), raw);
        assert.deepEqual(model.units.filter((unit) => unit.active).map((unit) => unit.id), step.indices.map((active) => raw[active].id));
        assert.equal(model.arms.length, Math.max(0, model.units.length - 1));
        assert.equal(model.units.filter((unit) => treeLabel(unit).startsWith('ROOT')).length, model.units.length ? 1 : 0);
        const oldRoot = before.units.find((unit) => unit.depth === 0);
        for (const language of ['ko','en']) {
          if (oldRoot) assert(treeLabel(oldRoot, true, language).startsWith(language === 'ko' ? '이전 ROOT' : 'PREVIOUS ROOT'));
          assert(treeTransferText(true, id === 'avl-tree', language).includes(language === 'ko' ? '이전 스냅샷' : 'prior snapshot'));
          assert(treeTransferText(false, id === 'avl-tree', language).includes(language === 'ko' ? '현재 스냅샷' : 'Current snapshot'));
        }
        model.arms.forEach((arm) => {
          const parent = model.units.find((unit) => unit.id === arm.parent);
          const child = model.units.find((unit) => unit.id === arm.child);
          assert.equal(parent[arm.side], child.id);
          assert.equal(child.depth, parent.depth + 1);
          assert(arm.side === 'left' ? child.position[0] < parent.position[0] : child.position[0] > parent.position[0]);
          assert(child.position[1] < parent.position[1]);
        });
        const units = [...model.units, ...before.units.filter((entry) => !model.units.some((unit) => unit.id === entry.id))];
        units.forEach((item) => {
          const unit = model.units.find((entry) => entry.id === item.id);
          const previous = before.units.find((entry) => entry.id === item.id);
          if (unit) assert.deepEqual(treePosition(unit, previous, 1), unit.position);
          if (previous) assert.deepEqual(treePosition(unit, previous, 0), previous.position);
          if (previous && unit && previous.value !== unit.value) { assert(treeMotion(step, prior)); valueReplacements++; }
        });
        if (step.type === 'rotation-start') cases.add(step.variables.rotation);
        if (step.type === 'rotation') {
          assert(treeMotion(step, prior));
          assert.deepEqual(model.units.map((unit) => unit.value).sort((a,b) => a-b), before.units.map((unit) => unit.value).sort((a,b) => a-b));
          assert.deepEqual(model.units.map((unit) => unit.id).sort((a,b) => a-b), before.units.map((unit) => unit.id).sort((a,b) => a-b));
          rotations++;
          model.arms.forEach((arm) => { if (!before.arms.some((entry) => entry.id === arm.id) && before.arms.some((entry) => entry.child === arm.child && entry.parent !== arm.parent)) middleTransfers++; });
        }
        const state = { ...initialBubblePlayback(steps.length), index, animate: true, playing: true, elapsed: 650 };
        const paused = bubblePlaybackReducer(state, { type: 'toggle', swap: true });
        assert.deepEqual(advanceBubblePlayback(paused, 10000), paused);
        if (treeMotion(step, prior)) assert.equal(bubblePlaybackReducer(paused, { type: 'toggle', swap: treeMotion(step, prior) }).elapsed, 650);
        assert.equal(traceTransitionTime(bubblePlaybackReducer(state, { type: 'seek', index }), index, false), 1);
        assert.equal(traceTransitionTime({ ...state, index: index + 1 }, index, true), undefined);
        for (const language of ['ko', 'en']) {
          const fallback = React.createElement(LessonView, { algorithm, step, language });
          const props = { previous: prior, clock: { current: state }, reduced: true, view: '3d', sky: false, capacity };
          const markup = renderToStaticMarkup(React.createElement(SpaceLesson, props, fallback));
          assert(!markup.includes('tree-3d') && markup.includes('<svg'));
          if ('result' in step.variables) {
            const nativeMarkup = renderToStaticMarkup(React.createElement(SpaceLesson, { ...props, reduced: false }, fallback));
            assert(nativeMarkup.includes('data-testid="operation-result"'), 'Returned values remain available in the native view');
          }
          const scene = renderToStaticMarkup(React.createElement(SpaceLesson, { ...props, reduced: false }, React.createElement(TreeScene, { step, language, fallback })));
          assert(scene.includes('Inspect exact tree state') || scene.includes('정확한 트리 상태 보기'));
        }
        checked++;
      }
    }
  }
  assert.deepEqual([...cases].sort(), ['LL','LR','RL','RR']);
  assert(rotations > 0 && middleTransfers > 0 && valueReplacements > 0);
  for (const t of [0,.22,.5,.78,1]) {
    assert.equal(treeArmProgress(true,true,t), 1);
    assert(!(treeArmProgress(true,false,t) > 0 && treeArmProgress(false,true,t) > 0));
  }
  assert.equal(treeArmProgress(false,true,0), 1);
  assert.equal(treeArmProgress(false,true,1), 0);
  assert.equal(treeArmProgress(true,false,0), 0);
  assert.equal(treeArmProgress(true,false,1), 1);
  for (const id of ['red-black-tree','tree-bfs','tree-dfs','min-heap','trie']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    if (algorithm) assert(algorithm.run(algorithm.example, algorithm.target, algorithm.edges, algorithm.directed).every((step) => !treeSceneSupported(step)));
  }
  console.log(`Checked ${checked} tree snapshots: stable IDs, exact L/R arms, all four AVL cases (${rotations} single rotations), middle-branch transfers, deletion value copies, 12-node/empty/duplicate/signed inputs, pause/resume/seek and bilingual fallback.`);
} finally { await server.close(); }
