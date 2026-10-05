import fs from 'fs';
import path from 'path';
import naiveSearch from '../../algorithms/string/naive-search/naiveSearch';
import { traceStringSearch, requireStrings } from '../strings';
import { algorithmCode } from '../playback';

describe('string search lessons', () => {
  it('matches String.indexOf including empty patterns, spaces and UTF-16 indices', () => {
    const inputs = ['', 'a', 'ab', 'aaa', 'abab', 'a b', '가나다가나', '😀집😀'];
    const patterns = ['', 'a', 'b', 'aa', 'ab', '가나', '😀', '집', 'nope', ' '];
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../algorithms/string/naive-search/naiveSearch.js',
    ), 'utf8'));
    inputs.forEach((text) => patterns.forEach((pattern) => {
      const steps = traceStringSearch(text, pattern);
      expect(naiveSearch(text, pattern)).toBe(text.indexOf(pattern));
      expect(steps.at(-1).variables.result).toBe(text.indexOf(pattern));
      expect(steps[0].variables.text).toBe(text);
      expect(steps[0].variables.pattern).toBe(pattern);
      expect(steps[0].array).toHaveLength(text.length);
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((i) => i >= 0 && i < text.length)).toBe(true);
        expect(step.array).toEqual(steps[0].array);
      });
    }));
    const steps = traceStringSearch('ABABABC', 'ABABC');
    expect(steps.at(-1).variables.result).toBe(2);
    expect(steps.filter((step) => step.type === 'shift').map((step) => step.variables.alignment))
      .toEqual([1, 2]);
    expect(() => requireStrings('a'.repeat(49), 'a')).toThrow('strings');
    expect(() => requireStrings('a', 'b'.repeat(17))).toThrow('strings');
    expect(() => requireStrings(2, 'a')).toThrow('strings');
    expect(() => requireStrings('a', null)).toThrow('strings');
  });
});
