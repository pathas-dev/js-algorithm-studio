import fs from 'fs';
import path from 'path';
import { traceCounting, traceRadix, requireIntegers } from '../numeric';
import { algorithmCode } from '../playback';

describe('numeric sorting lessons', () => {
  it('records stable radix buckets, including missing digits and all-zero input', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/sorting/radix-sort/RadixSort.js',
    ), 'utf8'));
    [[], [0], [0, 0], [999], [170, 45, 75, 90, 802, 24, 2, 66],
      [2, 2, 0, 12, 1, 10]].forEach((input) => {
      const original = [...input];
      const steps = traceRadix(input);
      expect(input).toEqual(original);
      expect(steps[0].array).toEqual(original);
      expect(steps.at(-1).array).toEqual([...input].sort((a, b) => a - b));
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((index) => index >= 0 && index < input.length)).toBe(true);
        if (step.type === 'gather') {
          const buckets = JSON.parse(step.variables.buckets);
          const divisor = 10 ** (step.variables.digit - 1);
          buckets.forEach((bucket, index) => {
            const expected = step.array.filter(
              (value) => Math.floor(value / divisor) % 10 === index,
            );
            expect(bucket).toEqual(expected);
          });
        }
      });
    });
    expect(() => traceRadix([-1])).toThrow('nonnegative');
    expect(() => traceRadix([1.5])).toThrow('integers');
  });
  it('records counts, cumulative positions and sparse output without changing past steps', () => {
    const source = algorithmCode(fs.readFileSync(path.join(
      __dirname,
      '../../algorithms/sorting/counting-sort/CountingSort.js',
    ), 'utf8'));
    [[], [0], [999], [-999], [4, -2, 4, 0, -2], [1, 2, 3], [3, 2, 1]].forEach((input) => {
      const original = [...input];
      const steps = traceCounting(input);
      expect(input).toEqual(original);
      expect(steps[0].array).toEqual(original);
      expect(steps[steps.length - 1].array).toEqual([...input].sort((a, b) => a - b));
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((index) => index >= 0 && index < input.length)).toBe(true);
        if (step.variables.output) {
          const output = JSON.parse(step.variables.output);
          output.filter((value) => value !== null).forEach((value) => {
            expect(input).toContain(value);
          });
        }
      });
      const initialBuckets = steps.find((step) => step.type === 'buckets');
      expect(JSON.parse(initialBuckets.variables.buckets).every((count) => count === 0)).toBe(true);
    });
    expect(() => traceCounting([0, 64])).toThrow('buckets');
    expect(() => traceCounting([0.5])).toThrow('integers');
    expect(() => requireIntegers([Infinity])).toThrow('integers');
    expect(traceCounting([0, 63]).at(-1).array).toEqual([0, 63]);
  });
});
