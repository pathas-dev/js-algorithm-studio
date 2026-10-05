import fs from 'fs';
import path from 'path';
import {
  traceTopological,
  traceKruskal,
  tracePrim,
  parseWeightedEdges,
  traceDijkstra,
  traceBellmanFord,
  traceFloydWarshall,
} from '../graph';
import { algorithmCode } from '../playback';

describe('weighted graph lessons', () => {
  it('traces reverse finish order, isolated vertices and rejects directed cycles', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/graph/topological-sorting/topologicalSort.js',
    ), 'utf8'));
    const edges = [[1, 3], [2, 3], [2, 4], [3, 5], [4, 6], [5, 6]];
    const steps = traceTopological([1, 2, 3, 4, 5, 6, 7], edges);
    const order = steps.at(-1).variables.order.split(',').map(Number);
    expect(new Set(order).size).toBe(7);
    edges.forEach(([a, b]) => expect(order.indexOf(a)).toBeLessThan(order.indexOf(b)));
    steps.forEach((step) => expect(source).toContain(step.code));
    expect(steps[0].variables.order).toBe('');
    expect(steps.at(-1).variables.stack).toBe('');
    expect(() => traceTopological([1, 2], [[1, 2], [2, 1]])).toThrow('cycle');
    expect(traceTopological([1], []).at(-1).variables.order).toBe('1');
  });
  it('traces Kruskal unions, skipped cycles and disconnected forests', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/graph/kruskal/kruskal.js',
    ), 'utf8'));
    const steps = traceKruskal(
      [1, 2, 3, 4, 5, 6],
      [[1, 2, 7], [1, 3, 2], [3, 2, 1], [2, 4, 3], [3, 5, 8], [4, 5, 1]],
    );
    expect(steps.at(-1).variables.weight).toBe(7);
    expect(JSON.parse(steps.at(-1).variables.chosen)).toHaveLength(4);
    const groups = JSON.parse(steps.at(-1).variables.groups);
    expect(new Set(groups.slice(0, 5).map(([, root]) => root)).size).toBe(1);
    expect(groups.at(-1)).toEqual([6, 6]);
    expect(steps.some((step) => step.type === 'skip')).toBe(true);
    steps.forEach((step) => expect(source).toContain(step.code));
    expect(JSON.parse(steps[0].variables.groups)).toEqual([
      [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6],
    ]);
    expect(traceKruskal([1], []).at(-1).variables.weight).toBe(0);
    expect(traceKruskal([1, 2, 3, 4], [[1, 2, -1], [3, 4, 2]])
      .at(-1).variables.weight).toBe(1);
  });
  it('traces Prim choices and cycle rejection within the starting component', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/graph/prim/prim.js',
    ), 'utf8'));
    const edges = [[1, 2, 7], [1, 3, 2], [3, 2, 1], [2, 4, 3], [3, 5, 8], [4, 5, 1]];
    const steps = tracePrim([1, 2, 3, 4, 5, 6], edges);
    expect(steps.at(-1).variables.weight).toBe(7);
    expect(JSON.parse(steps.at(-1).variables.chosen)).toHaveLength(4);
    expect(steps.some((step) => step.type === 'skip')).toBe(true);
    expect(steps.at(-1).variables.seen.split(',')).not.toContain('6');
    steps.forEach((step) => expect(source).toContain(step.code));
    expect(JSON.parse(steps[0].variables.chosen)).toEqual([]);
    expect(tracePrim([1], []).at(-1).variables.weight).toBe(0);
    expect(tracePrim([1, 2], [[1, 2, -1]]).at(-1).variables.weight).toBe(-1);
  });
  it('traces every pair and detects negative diagonals without mutating earlier matrices', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/graph/floyd-warshall/floydWarshall.js',
    ), 'utf8'));
    const steps = traceFloydWarshall([1, 2, 3, 4], [[1, 2, 3], [2, 3, -1], [3, 4, 2]]);
    expect(JSON.parse(steps.at(-1).variables.matrix)).toEqual([
      [0, 3, 2, 4], [null, 0, -1, 1], [null, null, 0, 2], [null, null, null, 0],
    ]);
    expect(JSON.parse(steps[0].variables.matrix)[0][3]).toBeNull();
    steps.forEach((step) => expect(source).toContain(step.code));
    expect(traceFloydWarshall([1, 2], [[1, 2, -1]], false).at(-1).type)
      .toBe('negative-cycle');
    expect(JSON.parse(traceFloydWarshall([1], []).at(-1).variables.matrix)).toEqual([[0]]);
    const reordered = traceFloydWarshall([3, 1, 2], [[1, 2, 5], [2, 3, 2]]).at(-1);
    expect(reordered.array.map((item) => item.value)).toEqual([1, 2, 3]);
    expect(JSON.parse(reordered.variables.matrix)[0][2]).toBe(7);
  });
  it('traces negative edges and distinguishes reachable from disconnected negative cycles', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/graph/bellman-ford/bellmanFord.js',
    ), 'utf8'));
    const steps = traceBellmanFord([1, 2, 3, 4], 1, [[1, 2, 2], [2, 3, -3]]);
    expect(JSON.parse(steps.at(-1).variables.distances))
      .toEqual({
        1: 0, 2: 2, 3: -1, 4: null,
      });
    expect(steps.at(-1).variables.negativeCycle).toBe(false);
    steps.forEach((step) => expect(source).toContain(step.code));
    const cycle = traceBellmanFord([1, 2, 3], 1, [[1, 2, 1], [2, 3, -2], [3, 2, 1]]);
    expect(cycle.at(-1).type).toBe('negative-cycle');
    expect(cycle.at(-1).variables.negativeCycle).toBe(true);
    expect(traceBellmanFord([1, 2, 3], 1, [[2, 3, -2], [3, 2, 1]])
      .at(-1).variables.negativeCycle).toBe(false);
    expect(traceBellmanFord([1], 1, []).at(-1).type).toBe('done');
    expect(traceBellmanFord([1, 2], 1, [[1, 2, -1]], false).at(-1).type)
      .toBe('negative-cycle');
  });
  it('validates weights, direction, duplicates and endpoints before tracing', () => {
    expect(parseWeightedEdges('', [1], false)).toEqual([]);
    expect(parseWeightedEdges('1-2:0, 2-3:-2.5', [1, 2, 3], true))
      .toEqual([[1, 2, 0], [2, 3, -2.5]]);
    expect(parseWeightedEdges('1-2:1, 2-1:2', [1, 2], true)).toHaveLength(2);
    expect(() => parseWeightedEdges('1-2:1, 2-1:2', [1, 2], false)).toThrow('edges');
    ['1-2', '1-2:NaN', '1-2:1000', '1-2:1,,2-3:1', '1-2:1,'].forEach((text) => {
      expect(() => parseWeightedEdges(text, [1, 2, 3], false)).toThrow('weights');
    });
    expect(() => parseWeightedEdges('1-4:1', [1, 2], true)).toThrow('edges');
    expect(() => traceDijkstra([1, 2], 1, [[1, 2, -1]], true)).toThrow('negative-weight');
    expect(() => traceDijkstra([1, 2], 3, [[1, 2, 1]], true)).toThrow('start');
    expect(() => traceDijkstra([1, 2], 1, [[1, 2]], true)).toThrow('weights');
  });

  it('records relaxation, priority changes, unreachable nodes and immutable snapshots', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/graph/dijkstra/dijkstra.js',
    ), 'utf8'));
    const edges = [[1, 2, 7], [1, 3, 2], [3, 2, 1], [2, 4, 3], [3, 5, 8], [4, 5, 1]];
    [false, true].forEach((directed) => {
      const steps = traceDijkstra([1, 2, 3, 4, 5, 6], 1, edges, directed);
      const last = steps.at(-1);
      expect(last.type).toBe('done');
      expect(JSON.parse(last.variables.distances))
        .toEqual({
          1: 0, 2: 3, 3: 2, 4: 6, 5: 7, 6: null,
        });
      expect(JSON.parse(last.variables.previous))
        .toEqual({
          1: null, 2: 3, 3: 1, 4: 2, 5: 4, 6: null,
        });
      steps.forEach((step) => expect(source).toContain(step.code));
      expect(JSON.parse(steps[0].variables.distances)[2]).toBeNull();
      last.edges[0][2] = 100;
      expect(steps[0].edges[0][2]).toBe(7);
      expect(edges[0][2]).toBe(7);
    });
    expect(JSON.parse(traceDijkstra([1], 1, []).at(-1).variables.distances)).toEqual({ 1: 0 });
    expect(JSON.parse(traceDijkstra([1, 2], 1, [[1, 2, 0]]).at(-1).variables.distances))
      .toEqual({ 1: 0, 2: 0 });
  });
});
