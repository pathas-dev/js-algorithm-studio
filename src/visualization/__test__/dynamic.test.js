import fs from 'fs';
import path from 'path';
import { traceLcs, traceEditDistance, traceKnapsack } from '../dynamic';
import { algorithmCode } from '../playback';

describe('dynamic programming lessons', () => {
  it('matches exhaustive 0/1 subsets and recovers actual items for empty, single and tied inputs', () => {
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../algorithms/sets/knapsack-problem/Knapsack.js',
    ), 'utf8'));
    ['', '2:3', '2:3, 2:3', '1:0, 3:4', '1:1, 3:4, 4:5, 5:7', '1:7, 1:5, 1:4, 1:4']
      .forEach((text) => {
        const items = text ? text.split(',').map((part) => part.trim().split(':').map(Number)) : [];
        for (let limit = 0; limit <= 8; limit += 1) {
          const subsets = Array.from({ length: 2 ** items.length }, (_, bits) => items
            .filter((item, i) => bits & (2 ** i)))
            .filter((subset) => subset.reduce((sum, [weight]) => sum + weight, 0) <= limit);
          const best = Math.max(...subsets.map((subset) => subset
            .reduce((sum, [, value]) => sum + value, 0)));
          const steps = traceKnapsack(text, String(limit));
          const last = steps.at(-1).variables;
          const selected = JSON.parse(last.selectedItems).map((id) => items[id - 1]);
          expect(last.result).toBe(best);
          expect(last.totalWeight).toBeLessThanOrEqual(limit);
          expect(selected.reduce((sum, [, value]) => sum + value, 0)).toBe(best);
          expect(new Set(JSON.parse(last.selectedItems)).size).toBe(selected.length);
          expect(JSON.parse(last.dpMatrix).at(-1)[limit]).toBe(best);
          steps.forEach((s) => expect(source).toContain(s.code));
          expect(JSON.parse(steps[0].variables.dpMatrix).every((r) => r.every((v) => v === null)))
            .toBe(true);
        }
      });
    ['0:1', '-1:2', '1.5:2', '1:-2', '25:1', '1:1000', '1:2,', Array(9).fill('1:2').join(',')]
      .forEach((input) => expect(() => traceKnapsack(input, '5')).toThrow('knapsack-input'));
    ['-1', '1.5', '', '25'].forEach((limit) => {
      expect(() => traceKnapsack('1:2', limit)).toThrow('knapsack-input');
    });
    expect(() => traceKnapsack(null, '5')).toThrow('knapsack-input');
  });
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
