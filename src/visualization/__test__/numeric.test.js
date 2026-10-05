import fs from 'fs';
import path from 'path';
import { traceCounting, requireIntegers } from '../numeric';
import { algorithmCode } from '../playback';

describe('numeric sorting lessons', () => {
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
