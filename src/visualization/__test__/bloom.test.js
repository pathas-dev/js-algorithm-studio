import fs from 'fs';
import path from 'path';
import BloomFilter from '../../data-structures/bloom-filter/BloomFilter';
import traceBloomFilter from '../bloom';
import { algorithmCode } from '../playback';

describe('bloom filter lesson', () => {
  it('records actual hashes and bit changes, distinguishing false positives from presence', () => {
    const steps = traceBloomFilter(['a'], 'mayContain a, mayContain q, mayContain z, insert 가방, mayContain 가방, mayContain q');
    const queries = steps.filter((step) => step.type === 'mayContain');
    expect(queries.map((step) => step.variables.result)).toEqual([true, true, false, true, true]);
    expect(queries.map((step) => step.variables.falsePositive))
      .toEqual([false, true, false, false, true]);
    const real = new BloomFilter(16);
    real.insert('a');
    expect(queries[0].array.map((item) => item.value))
      .toEqual(Array.from({ length: 16 }, (_, i) => Number(real.storage.getValue(i))));
    real.insert('가방');
    expect(steps.at(-1).array.map((item) => item.value))
      .toEqual(Array.from({ length: 16 }, (_, i) => Number(real.storage.getValue(i))));
    expect(steps.at(-1).variables.falsePositive).toBe(true);
    expect(steps.find((step) => step.type === 'hashes').variables.hashes)
      .toBe(real.getHashValues('a').join(', '));
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../data-structures/bloom-filter/BloomFilter.js',
    ), 'utf8'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      expect(step.indices.every((i) => i >= 0 && i < 16)).toBe(true);
      expect(step.array).toHaveLength(16);
    });
    expect(steps[0].array.every((item) => item.value === 0)).toBe(true);
    expect(queries[0].array.filter((item) => item.value === 1)).toHaveLength(2);
    expect(traceBloomFilter([], 'mayContain x').at(-1).variables.result).toBe(false);
    expect(traceBloomFilter(['😀집'], 'mayContain 😀집').at(-1).variables.result).toBe(true);
    expect(traceBloomFilter(['a', 'a']).at(-1).variables.words).toBe('a');
  });

  it('validates word boundaries, operation names and inserted-word limits', () => {
    expect(() => traceBloomFilter(Array(13).fill('a'))).toThrow('word-limit');
    expect(() => traceBloomFilter(['a'.repeat(17)])).toThrow('words');
    expect(() => traceBloomFilter([], 'delete a')).toThrow('operations');
    const words = Array.from({ length: 12 }, (_, i) => `word${i}`);
    expect(() => traceBloomFilter(words, 'insert new')).toThrow('word-limit');
    expect(traceBloomFilter(words, 'insert word0').at(-1).variables.words.split(', '))
      .toHaveLength(12);
  });
});
