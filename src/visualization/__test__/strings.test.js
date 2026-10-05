import fs from 'fs';
import path from 'path';
import naiveSearch from '../../algorithms/string/naive-search/naiveSearch';
import { traceStringSearch, traceKmpSearch, requireStrings } from '../strings';
import { algorithmCode } from '../playback';

describe('string search lessons', () => {
  it('records KMP prefix fallback without revisiting text and preserves tables when rewinding', () => {
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../algorithms/string/knuth-morris-pratt/knuthMorrisPratt.js',
    ), 'utf8'));
    ['', 'a', 'aaaaa', 'ABABABC', 'a b', '가나가나', '😀집😀'].forEach((text) => {
      ['', 'a', 'aaa', 'ABABC', ' ', '가나', '집', '😀', 'missing'].forEach((pattern) => {
        const steps = traceKmpSearch(text, pattern);
        expect(steps.at(-1).variables.result).toBe(text.indexOf(pattern));
        steps.forEach((step) => {
          expect(source).toContain(step.code);
          expect(step.indices.every((i) => i >= 0 && i < text.length)).toBe(true);
        });
      });
    });
    const steps = traceKmpSearch('ABABABC', 'ABABC');
    expect(JSON.parse(steps.find((s) => s.type === 'prefix-start').variables.table)).toEqual([0]);
    expect(JSON.parse(steps.find((s) => s.type === 'prefix-done').variables.table))
      .toEqual([0, 0, 1, 2, 0]);
    const fallback = steps.findIndex((s) => s.type === 'fallback');
    expect(steps[fallback].variables.textIndex).toBe(steps[fallback - 1].variables.textIndex);
    expect(steps[fallback].variables.wordIndex).toBe(2);
    expect(steps[fallback].variables.alignment).toBe(2);
    expect(steps.at(-1).variables.result).toBe(2);
  });
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
