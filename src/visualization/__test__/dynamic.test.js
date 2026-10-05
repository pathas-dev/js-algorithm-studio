import fs from 'fs';
import path from 'path';
import { traceLcs } from '../dynamic';
import { algorithmCode } from '../playback';

describe('dynamic programming lessons', () => {
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
