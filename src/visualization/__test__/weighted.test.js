import fs from 'fs';
import path from 'path';
import { parseWeightedEdges, traceDijkstra } from '../graph';
import { algorithmCode } from '../playback';

describe('weighted graph lessons', () => {
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
