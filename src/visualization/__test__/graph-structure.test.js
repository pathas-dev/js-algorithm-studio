import fs from 'fs';
import path from 'path';
import traceGraphStructure from '../graph-structure';
import { algorithmCode } from '../playback';

describe('graph structure lesson', () => {
  it('updates both endpoint lists and preserves isolated vertices and older snapshots', () => {
    const steps = traceGraphStructure(
      [1, 2, 3, 4],
      'addEdge 1 2, addEdge 2 3, neighbors 2, degree 2, deleteEdge 2 1, addVertex 5, addEdge 3 5, neighbors 1',
    );
    const queries = steps.filter((step) => ['neighbors', 'degree'].includes(step.type));
    expect(queries.map((step) => step.variables.result)).toEqual(['[1, 3]', 2, '[]']);
    expect(steps.at(-1).edges).toEqual([[2, 3], [3, 5]]);
    expect(steps.at(-1).array.map((item) => item.value)).toEqual([1, 2, 3, 4, 5]);
    expect(steps.find((step) => step.type === 'addEdge').edges).toEqual([[1, 2]]);
    const source = algorithmCode(['Graph.js', 'GraphVertex.js'].map((file) => fs.readFileSync(path.resolve(__dirname, '../../data-structures/graph', file), 'utf8')).join('\n'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      expect(step.indices.every((i) => i >= 0 && i < step.array.length)).toBe(true);
      const adjacency = JSON.parse(step.variables.adjacency);
      adjacency.forEach((node) => {
        expect(node.degree).toBe(node.neighbors.length);
        node.neighbors.forEach((neighbor) => {
          expect(adjacency.find((other) => other.value === neighbor).neighbors)
            .toContain(node.value);
        });
      });
    });
    expect(steps[0].array).toEqual([]);
    expect(traceGraphStructure([]).at(-1).array).toEqual([]);
    expect(traceGraphStructure([], 'addVertex 1, neighbors 1').at(-1).array)
      .toEqual([{ value: 1, id: 1 }]);
  });

  it('rejects invalid vertices, self-loops, duplicate edges and absent endpoints', () => {
    expect(() => traceGraphStructure([1, 1])).toThrow('nodes');
    expect(() => traceGraphStructure([], 'addVertex 13')).toThrow('nodes');
    expect(() => traceGraphStructure([1], 'degree 2')).toThrow('missing-value');
    expect(() => traceGraphStructure([1], 'addEdge 1 2')).toThrow('missing-value');
    expect(() => traceGraphStructure([1], 'addEdge 1 1')).toThrow('graph-self-loop');
    expect(() => traceGraphStructure([1, 2], 'deleteEdge 1 2')).toThrow('missing-edge');
    expect(() => traceGraphStructure([1, 2], 'addEdge 1 2, addEdge 2 1')).toThrow('duplicate-edge');
    const commands = [];
    for (let a = 1; a <= 8; a += 1) {
      for (let b = a + 1; b <= 8; b += 1) commands.push(`addEdge ${a} ${b}`);
    }
    expect(() => traceGraphStructure([1, 2, 3, 4, 5, 6, 7, 8], commands.join(',')))
      .toThrow('edge-limit');
  });
});
