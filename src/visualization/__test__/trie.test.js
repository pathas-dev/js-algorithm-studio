import fs from 'fs';
import path from 'path';
import { algorithmCode } from '../playback';
import { parseWord, parseWords, traceTrie } from '../trie';

describe('trie lessons', () => {
  it('validates bounded Unicode words and command arguments', () => {
    expect(parseWords('')).toEqual([]);
    expect(parseWords('car, cat 가방 😀집')).toEqual(['car', 'cat', '가방', '😀집']);
    ['a,,b', ',a', 'a,', 'a'.repeat(17), 'a;b'].forEach((text) => {
      expect(() => parseWords(text)).toThrow('words');
    });
    expect(() => parseWord('')).toThrow('words');
    expect(() => parseWord('two words')).toThrow('words');
    expect(() => parseWords(Array(13).fill('a').join(','))).toThrow('word-limit');
    expect(() => traceTrie(Array(13).fill('a'))).toThrow('word-limit');
    expect(() => traceTrie([], 'add')).toThrow('operations');
  });

  it('preserves shared prefixes and freezes prior terminal markers during deletion', () => {
    const steps = traceTrie(['car', 'cat', 'cart', '가방', '가게', '😀집'], 'find ca, suggest ca, add carpet, delete car, find car, find cart, delete 😀집, find 😀집, suggest missing, suggest cat, delete absent');
    expect(steps.filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual([false, 'r, t', false, true, false, 'null', '∅']);
    expect(steps.at(-1).variables.words).toBe('cart, carpet, cat, 가방, 가게');
    const before = steps.find((step) => step.type === 'add' && step.variables.word === 'car');
    expect(JSON.parse(before.variables.trie).find((node) => node.prefix === 'car').complete).toBe(true);
    const after = steps.find((step) => step.type === 'delete' && step.variables.word === 'car');
    expect(JSON.parse(after.variables.trie).find((node) => node.prefix === 'car').complete).toBe(false);
    const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/trie/Trie.js'), 'utf8')
      + fs.readFileSync(path.resolve(__dirname, '../../data-structures/trie/TrieNode.js'), 'utf8'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      const nodes = JSON.parse(step.variables.trie);
      expect(nodes.length).toBeLessThanOrEqual(80);
      nodes.forEach((node) => node.children.forEach((id) => {
        expect(nodes.some((child) => child.id === id)).toBe(true);
      }));
    });
    expect(traceTrie([])).toHaveLength(2);
    expect(traceTrie(['a'], 'add a, delete a').at(-1).variables.words).toBe('');
    const words = Array.from({ length: 12 }, (_, index) => `a${index}`);
    expect(() => traceTrie(words, 'add b')).toThrow('word-limit');
    expect(traceTrie(words, 'add a0').at(-1).variables.words.split(', ')).toHaveLength(12);
    expect(() => traceTrie(['abcdefghijklmnop', 'qrstuvwxyzabcdef', '1234567890abcdef', 'ABCDEFGHIJKLMNOP', 'QRSTUVWX12345678']))
      .toThrow('trie-limit');
    expect(traceTrie([], 'suggest unknown, delete unknown, find unknown').at(-1).variables.words).toBe('');
  });
});
