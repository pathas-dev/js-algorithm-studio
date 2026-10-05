import fs from 'fs';
import path from 'path';
import FenwickTree from '../../data-structures/tree/fenwick-tree/FenwickTree';
import { algorithmCode } from '../playback';
import { requirePosition, traceFenwick } from '../range';

describe('range structure lessons', () => {
  it('validates integer positions including an optional zero-based index', () => {
    requirePosition(1, 1);
    requirePosition(0, 1, 0);
    [0, 2, 1.5, NaN, Infinity].forEach((position) => {
      expect(() => requirePosition(position, 1)).toThrow('positions');
      const tree = new FenwickTree(1);
      expect(() => tree.increase(position, 1)).toThrow();
      expect(() => tree.query(position)).toThrow();
    });
  });

  it('records lowbit paths, prefix accumulation and difference of prefix sums', () => {
    const input = [3, 2, -1, 6, 5, 4, -3, 3];
    const steps = traceFenwick(input, 'query 7, increase 3 2, range 2 6, range 1 8');
    expect(steps.filter((step) => 'result' in step.variables && step.type !== 'done').map((step) => step.variables.result))
      .toEqual([16, 18, 21]);
    expect(steps.at(-1).array.map((item) => item.value)).toEqual([3, 2, 1, 6, 5, 4, -3, 3]);
    expect(steps[0].array.map((item) => item.value)).toEqual(Array(8).fill(0));
    expect(JSON.parse(steps[0].variables.fenwick)).toEqual(Array(9).fill(0));
    const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/tree/fenwick-tree/FenwickTree.js'), 'utf8'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      if (step.type === 'increase-node') {
        expect(step.variables.next).toBe(step.variables.i + step.variables.lowbit);
      }
      if (step.type === 'query-node') {
        expect(step.variables.next).toBe(step.variables.i - step.variables.lowbit);
      }
    });
    expect(traceFenwick([])).toHaveLength(2);
    expect(traceFenwick([1.5, -2], 'range 1 2').at(-1).variables.result).toBe(-0.5);
    expect(() => traceFenwick(Array(33).fill(1))).toThrow('limit');
    expect(() => traceFenwick([1], 'query 0')).toThrow('positions');
    expect(() => traceFenwick([1, 2], 'range 2 1')).toThrow('range-order');
    expect(() => traceFenwick([1, 2], 'increase 1.5 2')).toThrow('positions');
    expect(() => traceFenwick([], 'query 1')).toThrow('positions');
  });
});
