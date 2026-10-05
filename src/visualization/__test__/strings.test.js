import fs from 'fs';
import path from 'path';
import naiveSearch from '../../algorithms/string/naive-search/naiveSearch';
import zAlgorithm from '../../algorithms/string/z-algorithm/zAlgorithm';
import rabinKarp from '../../algorithms/string/rabin-karp/rabinKarp';
import PolynomialHash from '../../algorithms/cryptography/polynomial-hash/PolynomialHash';
import {
  traceStringSearch, traceKmpSearch, traceZSearch, traceRabinSearch, requireStrings,
} from '../strings';
import { algorithmCode } from '../playback';

describe('string search lessons', () => {
  it('records real rolling hashes, rejects collisions and rehashes surrogate windows', () => {
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../algorithms/string/rabin-karp/rabinKarp.js',
    ), 'utf8'));
    const hasher = new PolynomialHash();
    ['', 'aaa', 'ABABABC', 'a b', '가나가나', 'a😀집😀', '😀집😀', '\u0000e'].forEach((text) => {
      ['', 'a', 'ABABC', ' ', '가나', '😀', '집😀', '\ud83d', '\ude00', 'missing'].forEach((pattern) => {
        expect(rabinKarp(text, pattern)).toBe(text.indexOf(pattern));
        const steps = traceRabinSearch(text, pattern);
        expect(steps.at(-1).variables.result).toBe(text.indexOf(pattern));
        steps.forEach((s) => {
          expect(source).toContain(s.code);
          if (s.type.startsWith('frame-')) {
            expect(s.variables.currentFrameHash).toBe(hasher.hash(s.variables.currentFrame));
          }
        });
      });
    });
    const collision = traceRabinSearch('e\u0000', '\u0000');
    expect(collision.find((s) => s.type === 'verify').variables.equal).toBe(false);
    expect(collision.at(-1).variables.result).toBe(1);
    expect(traceRabinSearch('a😀', '😀').some((s) => s.type === 'frame-rehash')).toBe(true);
    const roll = traceRabinSearch('ab', 'b');
    expect(roll.find((s) => s.type === 'frame-hash').variables.currentFrameHash).toBe(97);
    expect(roll.find((s) => s.type === 'frame-roll').variables.currentFrameHash).toBe(98);
  });
  it('finds all Z matches including overlaps, separator characters and empty-pattern boundaries', () => {
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../algorithms/string/z-algorithm/zAlgorithm.js',
    ), 'utf8'));
    ['', 'aaaaaa', 'abababa', '$a$$a$', '가나가나', 'a😀집😀'].forEach((text) => {
      ['', 'a', 'aa', 'aba', '$', '$a$', '가나', '😀', '집', 'not here'].forEach((pattern) => {
        const expected = Array.from({ length: text.length + 1 }, (_, i) => i)
          .filter((i) => text.startsWith(pattern, i));
        expect(zAlgorithm(text, pattern)).toEqual(expected);
        const steps = traceZSearch(text, pattern);
        expect(JSON.parse(steps.at(-1).variables.matches)).toEqual(expected);
        steps.forEach((s) => expect(source).toContain(s.code));
        if (pattern.length) {
          const tokens = [...pattern.split(''), null, ...text.split('')];
          const expectedZ = tokens.map((_, i) => {
            let length = 0;
            if (i) {
              while (i + length < tokens.length && tokens[length] === tokens[i + length]) {
                length += 1;
              }
            }
            return length;
          });
          expect(JSON.parse(steps.at(-1).variables.table)).toEqual(expectedZ);
          expect(JSON.parse(steps.find((s) => s.type === 'z-init').variables.table))
            .toEqual(Array(tokens.length).fill(0));
        }
      });
    });
    expect(traceZSearch('abababa', 'aba').some((s) => s.type === 'z-copy')).toBe(true);
  });
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
