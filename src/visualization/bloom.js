import BloomFilter from '../data-structures/bloom-filter/BloomFilter';
import { parseOperations } from './structures';
import { parseWord } from './trie';

export default function traceBloomFilter(words, operations = '') {
  if (words.length > 12) throw new Error('word-limit');
  words.forEach(parseWord);
  const commands = parseOperations(operations, { insert: 1, mayContain: 1 }, parseWord);
  // ponytail: 16 bits make collisions visible; expose larger sizes for probability comparisons.
  const filter = new BloomFilter(16);
  const stored = new Set();
  const steps = [];
  let context = {};
  const snapshot = (type, code, variables = {}) => {
    steps.push({
      type,
      code,
      array: Array.from({ length: filter.size }, (_, id) => ({
        id, value: Number(filter.storage.getValue(id)),
      })),
      indices: variables.position === undefined ? [] : [variables.position],
      variables: {
        ...context, structure: 'bloom-filter', words: [...stored].join(', '), ...variables,
      },
    });
  };
  filter.stepCallback = (step) => snapshot(step.type, step.code, step.variables);
  snapshot('start', 'this.storage = this.createStore(size);');
  const run = ({ name, value }, phase) => {
    context = { operation: name, word: value, phase };
    if (name === 'insert') {
      if (stored.size >= 12 && !stored.has(value)) throw new Error('word-limit');
      filter.insert(value);
      stored.add(value);
      snapshot(name, 'this.storage.setValue(val);');
    } else {
      const result = filter.mayContain(value);
      const actual = stored.has(value);
      snapshot(name, result ? 'return true;' : 'return false;', {
        result, actual, falsePositive: result && !actual,
      });
    }
  };
  words.forEach((value) => run({ name: 'insert', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  const last = steps.at(-1);
  context = {};
  snapshot('done', last.code, last.type === 'mayContain' ? {
    word: last.variables.word,
    result: last.variables.result,
    actual: last.variables.actual,
    falsePositive: last.variables.falsePositive,
  } : {});
  return steps;
}
