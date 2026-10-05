import fs from 'fs';
import path from 'path';
import { parseEdges, requireNodes, traceBfs } from '../graph';
import { algorithmCode } from '../playback';

describe('graph lesson', () => {
  it('validates graph input before building edges', () => {
    expect(parseEdges('1-2, 2-3', [1, 2, 3])).toEqual([[1, 2], [2, 3]]);
    expect(parseEdges('', [1])).toEqual([]);
    [[], [1, 1], [0], [1.5], [13], Array(13).fill(1)].forEach((nodes) => {
      expect(() => requireNodes(nodes)).toThrow('nodes');
    });
    ['1-1', '1-4', '1-2,2-1', 'a-b', '1-2,,2-3', ',1-2', '1-2,'].forEach((text) => {
      expect(() => parseEdges(text, [1, 2, 3])).toThrow('edges');
    });
    expect(() => traceBfs([1], 2, [])).toThrow('start');
    expect(() => traceBfs([1, 2], 1, Array(25).fill([1, 2]))).toThrow('edges');
  });

  it('records real queue order, skips cycles, preserves disconnected vertices and snapshots', () => {
    const source = algorithmCode(fs.readFileSync(path.join(__dirname, '../../algorithms/graph/breadth-first-search/breadthFirstSearch.js'), 'utf8'));
    const edges = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [4, 5]];
    const nodes = [1, 2, 3, 4, 5, 6, 7];
    const steps = traceBfs(nodes, 1, edges);
    expect(steps[0].variables.queue).toBe('1');
    const firstEnqueue = steps.find((step) => step.type === 'enqueue');
    expect(firstEnqueue.variables.queue).toBe('2');
    const enters = steps.filter((step) => step.type === 'enter');
    expect(enters.map((step) => step.variables.current)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(enters[1].variables.queue).toBe('3');
    expect(steps[steps.length - 1].variables.order).toBe('1,2,3,4,5,6');
    steps.forEach((step) => expect(source).toContain(step.code));
    const isolated = traceBfs(nodes, 7, edges);
    expect(isolated[isolated.length - 1].variables.order).toBe('7');
    expect(traceBfs([1], 1, []).map((step) => step.type)).toEqual(['start', 'enter', 'leave', 'done']);
    steps[steps.length - 1].array.push({ value: 8, id: 7 });
    steps[steps.length - 1].edges[0][0] = 99;
    expect(steps[0].array).toHaveLength(7);
    expect(steps[0].edges[0]).toEqual([1, 2]);
    expect(edges[0]).toEqual([1, 2]);
  });
});
