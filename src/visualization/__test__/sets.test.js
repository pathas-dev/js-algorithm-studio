import fs from 'fs';
import path from 'path';
import traceDisjointSet from '../sets';
import { algorithmCode } from '../playback';

describe('disjoint set lesson', () => {
  it('records actual parent paths, size-based unions and immutable groups', () => {
    const steps = traceDisjointSet(
      [1, 2, 3, 4, 5, 6],
      'union 1 2, union 3 4, union 1 3, find 4, union 5 1, inSameSet 2 5, inSameSet 1 6, union 2 4, find 99, makeSet 1',
    );
    const finds = steps.filter((step) => step.type === 'find');
    expect(finds.map((step) => step.variables.result)).toEqual([1, 'null']);
    expect(steps.filter((step) => step.type === 'inSameSet').map((step) => step.variables.result))
      .toEqual([true, false]);
    const unionSteps = steps.filter((step) => step.type === 'union-link');
    expect(unionSteps.map((step) => step.variables.current)).toEqual([1, 3, 1, 1]);
    expect(JSON.parse(unionSteps[0].variables.groups)).toContainEqual([4, 4]);
    const lastNodes = JSON.parse(steps.at(-1).variables.setNodes);
    expect(lastNodes.find((node) => node.value === 4).parent).toBe(3);
    expect(lastNodes.find((node) => node.value === 4).root).toBe(1);
    expect(lastNodes.find((node) => node.value === 1).size).toBe(5);
    const source = algorithmCode(['DisjointSet.js', 'DisjointSetItem.js']
      .map((file) => fs.readFileSync(path.resolve(
        __dirname,
        '../../data-structures/disjoint-set',
        file,
      ), 'utf8')).join('\n'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      expect(step.indices.every((i) => i >= 0 && i < step.array.length)).toBe(true);
      const nodes = JSON.parse(step.variables.setNodes);
      expect(step.edges).toEqual(nodes.filter((node) => node.parent !== null)
        .map((node) => [node.value, node.parent]));
    });
    expect(steps[0].array).toEqual([]);
    expect(traceDisjointSet([], 'makeSet -2.5, makeSet -2.5, find -2.5').at(-1).array)
      .toEqual([{ value: -2.5, id: -2.5 }]);
  });

  it('guards absent union operands and the live-set capacity', () => {
    expect(() => traceDisjointSet([1], 'union 1 2')).toThrow('missing-value');
    expect(() => traceDisjointSet([1], 'inSameSet 2 1')).toThrow('missing-value');
    expect(() => traceDisjointSet(Array(33).fill(1))).toThrow('limit');
    expect(() => traceDisjointSet(Array.from({ length: 13 }, (_, i) => i))).toThrow('set-limit');
    const values = Array.from({ length: 12 }, (_, i) => i);
    expect(() => traceDisjointSet(values, 'makeSet 12')).toThrow('set-limit');
    expect(traceDisjointSet(values, 'makeSet 11').at(-1).array).toHaveLength(12);
  });
});
