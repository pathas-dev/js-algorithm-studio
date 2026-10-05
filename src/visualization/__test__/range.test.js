import fs from 'fs';
import path from 'path';
import FenwickTree from '../../data-structures/tree/fenwick-tree/FenwickTree';
import { algorithmCode } from '../playback';
import { requirePosition, traceFenwick, traceSegment } from '../range';

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
  it('builds actual range sums and records all three overlap cases', () => {
    const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/tree/segment-tree/SegmentTree.js'), 'utf8'));
    [[3], [3, 2, -1, 6, 5, 4], [0, 1, 2, 3], [-1.5, 2.5, 0]].forEach((values) => {
      const queries = [];
      const expected = [];
      values.forEach((value, left) => {
        values.slice(left).forEach((item, offset) => {
          const right = left + offset;
          queries.push(`range ${left} ${right}`);
          expected.push(values.slice(left, right + 1).reduce((sum, entry) => sum + entry, 0));
        });
      });
      const steps = traceSegment(values, queries.join(','));
      expect(steps.filter((step) => step.type === 'range').map((step) => step.variables.result)).toEqual(expected);
      expect(JSON.parse(steps[0].variables.segments)).toEqual([]);
      const built = steps.find((step) => step.type === 'build-combine')
        || steps.find((step) => step.type === 'leaf');
      expect(JSON.parse(built.variables.segments).length).toBeGreaterThan(0);
      const final = JSON.parse(steps.at(-1).variables.segments);
      final.forEach((node) => {
        expect(node.value).toBe(
          values.slice(node.left, node.right + 1).reduce((sum, value) => sum + value, 0),
        );
      });
      steps.forEach((step) => expect(source).toContain(step.code));
    });
    const steps = traceSegment([1, 2, 3, 4], 'range 1 2');
    ['partial', 'total', 'none', 'query-combine'].forEach((type) => {
      expect(steps.some((step) => step.type === type)).toBe(true);
    });
    expect(traceSegment([1]).at(-1).type).toBe('done');
    expect(() => traceSegment([])).toThrow('empty-array');
    expect(() => traceSegment(Array(33).fill(1))).toThrow('limit');
    expect(() => traceSegment([1, 2], 'range 1 0')).toThrow('range-order');
    expect(() => traceSegment([1], 'range -1 0')).toThrow('positions');
    expect(() => traceSegment([1], 'range 0 1')).toThrow('positions');
  });
});
