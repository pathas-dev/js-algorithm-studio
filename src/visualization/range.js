import FenwickTree from '../data-structures/tree/fenwick-tree/FenwickTree';
import { parseOperations } from './structures';
import { MAX_VALUES } from './playback';

export function requirePosition(position, length, base = 1) {
  if (!Number.isInteger(position) || position < base || position >= length + base) {
    throw new Error('positions');
  }
}

export function traceFenwick(values, operations = '') {
  if (values.length > MAX_VALUES) throw new Error('limit');
  const commands = parseOperations(operations, { increase: 2, query: 1, range: 2 });
  const steps = [];
  const current = Array(values.length).fill(0);
  let context = {};
  let tree;
  const snapshot = (type, code, variables = {}) => {
    steps.push({
      type,
      code,
      array: current.map((value, id) => ({ value, id })),
      indices: [],
      variables: {
        ...context, structure: 'fenwick', fenwick: JSON.stringify(tree.treeArray), ...variables,
      },
    });
  };
  tree = new FenwickTree(values.length, (step) => snapshot(step.type, step.code, step.variables));
  snapshot('start', 'this.treeArray = Array(this.arraySize + 1).fill(0);');
  const run = ({ name, value: position, argument }, phase) => {
    requirePosition(position, values.length);
    context = { operation: name, position, phase };
    if (name === 'increase') {
      current[position - 1] += argument;
      tree.increase(position, argument);
      snapshot('increased', 'return this;', { position, value: argument });
    } else if (name === 'query') {
      const result = tree.query(position);
      snapshot(name, 'return sum;', { result });
    } else {
      requirePosition(argument, values.length);
      if (position > argument) throw new Error('range-order');
      context.right = argument;
      const result = tree.queryRange(position, argument);
      snapshot(name, 'queryRange(leftIndex, rightIndex) {', { result });
    }
  };
  values.forEach((value, index) => run({ name: 'increase', value: index + 1, argument: value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  const last = steps[steps.length - 1];
  snapshot('done', last.code, 'result' in last.variables ? { result: last.variables.result } : {});
  return steps;
}
