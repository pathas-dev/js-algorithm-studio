import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true, watch: null } });
try {
  const { graphModel, graphTravel } = await server.ssrLoadModule('/graph-scene.ts');
  const { graphCurve, wormholeFrame } = await server.ssrLoadModule('/graph-geometry.ts');
  const { initialBubblePlayback, advanceBubblePlayback, bubblePlaybackReducer } = await server.ssrLoadModule('/bubble-playback.ts');
  const { traceTransitionTime } = await server.ssrLoadModule('/bubble-motion.ts');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const sample = { array: [{ id: 0, value: 0 }, { id: 1, value: 1 }], edges: [[0, 1, 0], [1, 0, -2], [0, 0, 3]], indices: [], type: 'visit', variables: { directed: true, current: 0, next: 1 } };
  const directed = graphModel(sample, ['0'], [], [[1, 0]], false);
  assert.equal(directed.edges.length, 3, 'Keep reciprocal connections and self-loops');
  assert.equal(directed.edges[0].weight, 0, 'Zero is a real weight');
  assert.equal(directed.edges[1].weight, -2, 'Negative is a real weight');
  assert(directed.edges[0].active && !directed.edges[1].active, 'Directed activity follows the actual direction');
  assert(!directed.edges[0].selected && directed.edges[1].selected, 'Directed selection must not select its reverse');
  const first = graphCurve(directed.edges[0]), reverse = graphCurve(directed.edges[1]);
  assert(first.getPoint(.5).distanceTo(reverse.getPoint(.5)) > .2, 'Reciprocal arrows and weights have separate lanes');
  const loop = graphCurve(directed.edges[2]);
  assert(loop.getPoint(.5).distanceTo(loop.getPoint(0)) > .3, 'A self-loop is visible');
  const undirected = graphModel({ ...sample, variables: { directed: false, current: 1, next: 0 } }, ['0', '1'], ['0'], [[1, 0]], false);
  assert(undirected.edges[0].active && undirected.edges[0].reverse && undirected.edges[0].selected, 'Undirected reverse traversal retains the edge');
  assert.equal(undirected.nodes[0].color, '#8faf9d', 'Processed vertices keep their semantic color');
  const singleton = graphModel({ ...sample, array: [sample.array[0]], edges: [] }, [], [], [], false);
  assert.deepEqual(singleton.nodes[0].position, [0, .35, 0], 'A single vertex is centered');
  assert.deepEqual(graphModel({ ...sample, array: [], edges: [] }, [], [], [], false), { nodes: [], edges: [] });
  const floyd = graphModel({ ...sample, variables: { directed: true, current: 0, via: 1, next: 0 } }, ['0', '1'], [], [], true);
  assert(floyd.edges[0].active && floyd.edges[1].active, 'Floyd highlights both segments through its intermediate vertex');
  assert.equal(wormholeFrame(0, false).position, 0);
  assert.equal(wormholeFrame(1, false).position, 1);
  assert.equal(wormholeFrame(0, true).position, 1);
  assert.equal(wormholeFrame(1, true).position, 0);
  assert(wormholeFrame(.2, false).departure > .9 && wormholeFrame(.2, false).arrival === 0, 'The entry opens before arrival');
  assert(wormholeFrame(.8, false).arrival > .9 && wormholeFrame(.8, false).departure < 1e-10, 'Arrival opens at the far end');
  for (const t of [-1, 0, .12, .5, .84, 1, 2]) {
    const frame = wormholeFrame(t, false);
    assert(Object.values(frame).every((value) => Number.isFinite(value) && value >= 0 && value <= 1));
  }
  const moving = advanceBubblePlayback({ ...initialBubblePlayback(5), playing: true, animate: true }, 700);
  const paused = bubblePlaybackReducer(moving, { type: 'toggle', swap: true });
  assert.deepEqual(advanceBubblePlayback(paused, 5000), paused, 'Pause freezes wormhole travel and portal spin');
  assert.equal(bubblePlaybackReducer(paused, { type: 'toggle', swap: true }).elapsed, moving.elapsed, 'Resume retains the same transfer');
  const seek = bubblePlaybackReducer(moving, { type: 'seek', index: 2 });
  assert(wormholeFrame(traceTransitionTime(seek, 2, seek.animate), false).energy < 1e-10, 'Seeking shows exact state without an invented transfer');
  assert.equal(traceTransitionTime(moving, 1, true), undefined, 'A newer clock cannot rewind an old wormhole');
  assert.deepEqual(graphTravel({ ...sample, type: 'enter', variables: { current: 1, stack: '0,1' } }), [0, 1], 'Path and SCC traces use their actual parent');
  assert.equal(graphTravel({ ...sample, type: 'enter', variables: { current: 1, stack: '1' } }), undefined, 'A new DFS root cannot invent a connection');
  const entering = graphModel({ ...sample, type: 'enter', variables: { current: 1, stack: '0,1', directed: true } }, [], [], [], false);
  assert(entering.edges[0].active && !entering.edges[1].active, 'Path-entry portals follow the actual directed edge');
  const taking = graphModel({ ...sample, type: 'take-edge', variables: { current: 0, directed: false } }, [], [], [[0, 1]], false, { ...sample, variables: { current: 1 } });
  assert(taking.edges[0].active && taking.edges[0].reverse, 'Euler portals use the vertex before deleting the edge');
  let checked = 0;
  for (const algorithm of algorithms.filter((entry) => entry.category === 'graph' || ['graph-structure', 'disjoint-set'].includes(entry.id))) {
    const steps = algorithm.run(algorithm.example, algorithm.target, algorithm.graphEdges, algorithm.graphDirected, algorithm.operations);
    let activeSteps = 0;
    for (const [index, step] of steps.entries()) {
      const nodes = step.array.map((item) => String(item.value));
      const model = graphModel(step, nodes, [], JSON.parse(String(step.variables.chosen ?? '[]')), 'matrix' in step.variables, steps[Math.max(0, index - 1)]);
      if (model.edges.some((edge) => edge.active)) activeSteps += 1;
      assert.equal(model.nodes.length, step.array.length, `${algorithm.id}: exact vertex count`);
      assert.equal(model.edges.length, step.edges?.length ?? 0, `${algorithm.id}: exact connection count`);
      for (const node of model.nodes) assert(node.position.every(Number.isFinite));
      for (const edge of model.edges) {
        const curve = graphCurve(edge);
        for (const t of [0, .25, .5, .75, 1]) {
          assert(curve.getPoint(t).toArray().every(Number.isFinite), `${algorithm.id}: finite curve`);
          assert(curve.getTangent(t).length() > .9, `${algorithm.id}: valid arrow direction`);
        }
        const midpoint = curve.getPoint(.5).toArray();
        const recolored = graphModel({ ...step, variables: { ...step.variables, current: edge.to.value } }, nodes, nodes, [], 'matrix' in step.variables);
        const sameEdge = recolored.edges.find((other) => other.from.id === edge.from.id && other.to.id === edge.to.id);
        assert.deepEqual(graphCurve(sameEdge).getPoint(.5).toArray(), midpoint, 'Playback state cannot move the graph topology');
      }
      checked += 1;
    }
    if (algorithm.category === 'graph') assert(activeSteps > 0, `${algorithm.id}: real connections must participate in wormhole transitions`);
  }
  console.log(`Checked ${checked} graph traces: topology, curves, directed / reciprocal edges, self-loops, weights and semantic states.`);
} finally { await server.close(); }
