import HashTable from '../data-structures/hash-table/HashTable';
import { parseWord } from './trie';
import { parseOperations } from './structures';

export default function traceHashTable(keys, operations = '') {
  if (keys.length > 12) throw new Error('word-limit');
  keys.forEach(parseWord);
  const commands = parseOperations(operations, {
    set: 2, get: 1, delete: 1, has: 1,
  }, parseWord);
  const steps = [];
  let context = {};
  let table;
  const snapshot = (type, code, variables = {}) => {
    steps.push({
      type,
      code,
      array: [],
      indices: [],
      variables: {
        ...context,
        structure: 'hash-table',
        hashTable: JSON.stringify(table.buckets.map(
          (bucket) => bucket.toArray().map((node) => node.value),
        )),
        keys: table.getKeys().join(', '),
        ...variables,
      },
    });
  };
  table = new HashTable(8, (step) => {
    if (step.type === 'hash') context.keyHash = step.variables.keyHash;
    snapshot(step.type, step.code, step.variables);
  });
  snapshot('start', 'this.buckets = Array(hashTableSize).fill(null).map(() => new LinkedList());');
  const run = ({ name, value: key, argument: value }, phase) => {
    context = {
      operation: name, key, phase, keyHash: -1,
    };
    if (name === 'set') {
      if (table.getKeys().length >= 12 && !table.has(key)) throw new Error('word-limit');
      table.set(key, value);
    } else if (name === 'get') {
      const result = table.get(key);
      snapshot(name, 'return node ? node.value.value : undefined;', { result: result === undefined ? 'undefined' : result });
    } else if (name === 'has') {
      const result = table.has(key);
      snapshot(name, 'return Object.hasOwnProperty.call(this.keys, key);', { result });
    } else {
      const result = table.delete(key);
      snapshot(name, 'delete(key) {', { result: result ? result.value.value : 'null' });
    }
  };
  keys.forEach((key, index) => run({ name: 'set', value: key, argument: String(index) }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  table.getKeys();
  snapshot('done', 'return Object.keys(this.keys);');
  return steps;
}
