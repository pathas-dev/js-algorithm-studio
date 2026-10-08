import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true, watch: null } });
try {
  const { linkedSceneSupported, linkedModel, linkedPosition, linkedMotion, cableProgress, linkedCablePoints, cableKey } = await server.ssrLoadModule('/linked-scene.ts');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { initialBubblePlayback, bubblePlaybackReducer, advanceBubblePlayback } = await server.ssrLoadModule('/bubble-playback.ts');
  const { traceTransitionTime } = await server.ssrLoadModule('/bubble-motion.ts');
  const { default: SpaceLesson } = await server.ssrLoadModule('/SpaceLesson.tsx');
  const { default: LessonView } = await server.ssrLoadModule('/LessonView.tsx');
  const { default: LinkedScene } = await server.ssrLoadModule('/LinkedScene.tsx');
  let checked = 0;
  for (const id of ['linked-list', 'doubly-linked-list']) {
    const algorithm = algorithms.find((entry) => entry.id === id);
    const inputs = [[algorithm.example, algorithm.operations], [[], 'reverse, deleteHead, deleteTail, find 1'],
      [[-3, -3, 0], 'prepend -3, find -3, reverse, delete -3, deleteHead, deleteTail'],
      [Array.from({ length: 32 }, (_, index) => index - 16), 'reverse, deleteHead, deleteTail']];
    for (const [values, operations] of inputs) {
      const steps = algorithm.run(values, undefined, undefined, undefined, operations);
      for (const [index, step] of steps.entries()) {
        const prior = steps[Math.max(0, index - 1)];
        const model = linkedModel(step);
        const before = linkedModel(prior);
        assert(linkedSceneSupported(step));
        assert.deepEqual(model.nodes.map(({ id, value }) => ({ id, value })), step.array, 'IDs remain separate from duplicate values');
        assert.equal(new Set(model.nodes.map((node) => node.id)).size, model.nodes.length);
        assert.deepEqual(model.cables.filter((edge) => edge.channel === 'next').map(({ from, to }) => [from, to]), JSON.parse(step.variables.links), 'Partial reverse uses actual pointers, not array adjacency');
        if (id === 'doubly-linked-list') assert.deepEqual(model.cables.filter((edge) => edge.channel === 'previous').map(({ from, to }) => [from, to]), JSON.parse(step.variables.previousLinks));
        assert.equal(model.nodes.find((node) => node.tag.includes('HEAD'))?.id ?? -1, step.variables.head);
        assert.equal(model.nodes.find((node) => node.tag.includes('TAIL'))?.id ?? -1, step.variables.tail);
        for (const node of model.nodes) {
          const previous = before.nodes.find((entry) => entry.id === node.id);
          assert.deepEqual(linkedPosition(node, previous, 1), node.position);
          if (previous) assert.deepEqual(linkedPosition(node, previous, 0), previous.position);
          assert(linkedPosition(node, previous, .5).every(Number.isFinite));
        }
        for (const edge of model.cables) {
          const source = model.nodes.find((node) => node.id === edge.from);
          const destination = model.nodes.find((node) => node.id === edge.to);
          assert(source && (edge.to === -1 || destination), 'Every cable ends at a recorded node or null');
          assert(linkedCablePoints(edge, source.position, destination?.position).flat().every(Number.isFinite));
        }
        if (step.type.startsWith('reverse-link') && model.nodes.length > 1) assert(linkedMotion(step, prior), 'Pointer-only changes animate without moving node IDs');
        if (linkedMotion(step, prior)) {
          const state = { ...initialBubblePlayback(steps.length), index, animate: true, playing: true, elapsed: 650 };
          const paused = bubblePlaybackReducer(state, { type: 'toggle', swap: true });
          assert.deepEqual(advanceBubblePlayback(paused, 10000), paused);
          assert.equal(bubblePlaybackReducer(paused, { type: 'toggle', swap: linkedMotion(step, prior) }).elapsed, 650);
          const seek = bubblePlaybackReducer(state, { type: 'seek', index });
          assert.equal(traceTransitionTime(seek, index, seek.animate), 1);
          assert.equal(traceTransitionTime({ ...state, index: index + 1 }, index, true), undefined);
        }
        for (const language of ['ko', 'en']) {
          const props = { previous: prior, clock: { current: initialBubblePlayback(steps.length) }, reduced: true, view: '3d', sky: false };
          const fallback = React.createElement(LessonView, { algorithm, step, language });
          const markup = renderToStaticMarkup(React.createElement(SpaceLesson, props, fallback));
          assert(!markup.includes('linked-3d'), 'Reduced motion preserves the original 2D topology');
          assert(markup.includes('<svg'));
          const scene = renderToStaticMarkup(React.createElement(SpaceLesson, { ...props, reduced: false }, React.createElement(LinkedScene, { step, language, fallback })));
          for (const edge of model.cables) assert(scene.includes(`N${edge.from} ${edge.channel} → ${edge.to === -1 ? '∅' : `N${edge.to}`}`), 'Accessible record retains every exact pointer');
        }
        checked++;
      }
    }
  }
  const edge = { from: 0, to: 1, channel: 'next' };
  const next = linkedCablePoints(edge, [0, 0, 0], [2.35, 0, 0]);
  const previous = linkedCablePoints({ ...edge, channel: 'previous' }, [0, 0, 0], [2.35, 0, 0]);
  assert(next[1][1] > previous[1][1] && next[0][2] > previous[0][2], 'Reciprocal channels occupy separate heights and depths');
  assert.notEqual(cableKey(edge), cableKey({ ...edge, channel: 'previous' }));
  const terminal = linkedCablePoints({ ...edge, to: -1 }, [0, 0, 0]);
  assert(terminal.every((point) => point[1] >= terminal[3][1] && point[1] <= terminal[0][1]), 'Null stubs stop at their terminal without looping past it');
  for (const t of [0, .25, .45, .5, .75, 1]) {
    assert(!(cableProgress(false, false, t) > 0 && cableProgress(true, false, t) > 0), 'Detach old pointer before extending its replacement');
    assert.equal(cableProgress(true, true, t), 1, 'Unchanged pointers stay connected');
  }
  assert.equal(cableProgress(false, false, 1), 0);
  assert.equal(cableProgress(true, false, 1), 1);
  const algorithm = algorithms.find((entry) => entry.id === 'deque');
  assert(!linkedSceneSupported(algorithm.run(algorithm.example, undefined, undefined, undefined, algorithm.operations)[0]));
  assert(!linkedSceneSupported({ variables: { mode: 'list-forward', links: '[]' } }));
  for (const id of ['linked-list-traversal', 'linked-list-reverse-traversal']) {
    const lesson = algorithms.find((entry) => entry.id === id);
    assert(lesson.run(lesson.example).every((step) => !linkedSceneSupported(step)), 'Traversal lessons retain their established views');
  }
  console.log(`Checked ${checked} linked-list snapshots: exact IDs/pointers, partial reverse, two cable lanes, detach/attach, null, duplicate/empty/32-node inputs, pause/resume/seek and bilingual fallback.`);
} finally { await server.close(); }
