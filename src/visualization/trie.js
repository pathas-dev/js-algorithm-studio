import Trie from '../data-structures/trie/Trie';
import { parseOperations } from './structures';

export function parseWord(word) {
  if (!word || /[,;\s]/u.test(word) || Array.from(word).length > 16) throw new Error('words');
  return word;
}

export function parseWords(text) {
  if (!text.trim()) return [];
  if (/(?:^|,)\s*(?:,|$)/.test(text.trim())) throw new Error('words');
  const words = text.trim().split(/[,\s]+/).map(parseWord);
  if (words.length > 12) throw new Error('word-limit');
  return words;
}

export function traceTrie(words, operations = '') {
  if (words.length > 12) throw new Error('word-limit');
  words.forEach(parseWord);
  const commands = parseOperations(operations, {
    add: 1, delete: 1, find: 1, suggest: 1,
  }, parseWord);
  const trie = new Trie();
  const steps = [];
  const ids = new WeakMap();
  let nextId = 0;
  let context = {};
  const identify = (node) => {
    if (!ids.has(node)) {
      ids.set(node, nextId);
      nextId += 1;
    }
    return ids.get(node);
  };
  const snapshot = (type, code, variables = {}, active = null) => {
    const nodes = [];
    const completed = [];
    const visit = (node, prefix, depth) => {
      const children = node.suggestChildren().map((character) => node.getChild(character));
      nodes.push({
        id: identify(node),
        character: node.character,
        complete: node.isCompleteWord,
        children: children.map(identify),
        prefix,
        depth,
      });
      if (node.isCompleteWord) completed.push(prefix);
      children.forEach((child) => visit(child, prefix + child.character, depth + 1));
    };
    visit(trie.head, '', 0);
    // ponytail: 80 snapshot nodes; use a virtualized tree for larger dictionaries.
    if (nodes.length > 80) throw new Error('trie-limit');
    steps.push({
      type,
      code,
      array: [],
      indices: [],
      variables: {
        ...context,
        structure: 'trie',
        trie: JSON.stringify(nodes),
        words: completed.join(', '),
        activeNode: active ? identify(active) : -1,
        ...variables,
      },
    });
  };
  const observe = (step) => snapshot(step.type, step.code, step.variables, step.array[0]);
  snapshot('start', 'this.head = new TrieNode(HEAD_CHARACTER);');
  const run = ({ name, value }, phase) => {
    context = { operation: name, word: value, phase };
    if (name === 'add') {
      const countWords = (node) => Number(node.isCompleteWord) + node.suggestChildren()
        .reduce((count, character) => count + countWords(node.getChild(character)), 0);
      if (countWords(trie.head) >= 12 && !trie.doesWordExist(value)) throw new Error('word-limit');
      trie.addWord(value, observe);
      snapshot(name, 'addWord(word, stepCallback) {');
    } else if (name === 'delete') {
      trie.deleteWord(value, observe);
      snapshot(name, 'deleteWord(word, stepCallback) {');
    } else if (name === 'find') {
      const result = trie.doesWordExist(value, observe);
      snapshot(name, 'return !!lastCharacter && lastCharacter.isCompleteWord;', { result });
    } else {
      const result = trie.suggestNextCharacters(value, observe);
      snapshot(name, 'suggestNextCharacters(word, stepCallback) {', { result: result === null ? 'null' : result.join(', ') || '∅' });
    }
  };
  words.forEach((value) => run({ name: 'add', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  context = {};
  trie.head.suggestChildren();
  snapshot('done', 'return [...this.children.getKeys()];');
  return steps;
}
