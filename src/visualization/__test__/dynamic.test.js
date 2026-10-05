import fs from 'fs';
import path from 'path';
import { traceLcs, traceEditDistance } from '../dynamic';
import { algorithmCode } from '../playback';

describe('dynamic programming lessons', () => {
  it('uses deletion, insertion and substitution costs and restores uncomputed cells on rewind', () => {
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../algorithms/string/levenshtein-distance/levenshteinDistance.js',
    ), 'utf8'));
    const distance = (a, b) => {
      if (!a.length) return b.length;
      if (!b.length) return a.length;
      return Math.min(
        distance(a.slice(1), b) + 1,
        distance(a, b.slice(1)) + 1,
        distance(a.slice(1), b.slice(1)) + (a[0] === b[0] ? 0 : 1),
      );
    };
    ['', 'a', 'ba', 'abc', '가나', '😀'].forEach((first) => {
      ['', 'b', 'ab', '가', '😀'].forEach((second) => {
        const steps = traceEditDistance(first, second);
        expect(steps.at(-1).variables.result).toBe(distance(first, second));
        steps.forEach((s) => {
          expect(source).toContain(s.code);
          if (s.type === 'cell-min') {
            const v = s.variables;
            expect(JSON.parse(v.dpMatrix)[v.row][v.column])
              .toBe(Math.min(v.deletion, v.insertion, v.substitution));
            expect(JSON.parse(v.dependencies)).toHaveLength(3);
          }
        });
        expect(JSON.parse(steps[0].variables.dpMatrix).every((r) => r.every((v) => v === null)))
          .toBe(true);
      });
    });
    expect(traceEditDistance('kitten', 'sitting').at(-1).variables.result).toBe(3);
  });
  it('recovers an optimal LCS and records immutable prefix tables and valid references', () => {
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../algorithms/sets/longest-common-subsequence/longestCommonSubsequence.js',
    ), 'utf8'));
    const isSubsequence = (sequence, text) => {
      let i = 0;
      text.split('').forEach((c) => { if (c === sequence[i]) i += 1; });
      return i === sequence.length;
    };
    ['', 'a', 'ab', 'ba', 'aab', 'abc', '가나', '😀'].forEach((first) => {
      ['', 'a', 'ba', 'bc', '가', '😀'].forEach((second) => {
        const steps = traceLcs(first, second);
        const last = steps.at(-1).variables;
        const candidates = Array.from({ length: 2 ** first.length }, (_, bits) => first.split('')
          .filter((character, i) => bits & (2 ** i)).join(''));
        const length = Math.max(...candidates.filter((s) => isSubsequence(s, second))
          .map((s) => s.length));
        expect(last.length).toBe(length);
        expect(last.result.length).toBe(length);
        expect(isSubsequence(last.result, first) && isSubsequence(last.result, second)).toBe(true);
        steps.forEach((s) => {
          expect(source).toContain(s.code);
          const matrix = JSON.parse(s.variables.dpMatrix);
          expect(matrix).toHaveLength(second.length + 1);
          JSON.parse(s.variables.dependencies).forEach(([r, c]) => {
            expect(matrix[r][c]).not.toBeNull();
          });
        });
        expect(JSON.parse(steps[0].variables.dpMatrix).every((row) => row.every((v) => v === null)))
          .toBe(true);
      });
    });
    expect(traceLcs('ABCDAF', 'ACBCF').at(-1).variables.result).toBe('ABCF');
    expect(() => traceLcs('a'.repeat(13), 'a')).toThrow('dp-strings');
    expect(() => traceLcs('a', 'a'.repeat(13))).toThrow('dp-strings');
  });
});
