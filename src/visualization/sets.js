import DisjointSet from '../data-structures/disjoint-set/DisjointSet';
import { parseOperations } from './structures';
import { MAX_VALUES } from './playback';

export default function traceDisjointSet(values, operations = '') {
  if (values.length > MAX_VALUES) throw new Error('limit');
  if (new Set(values).size > 12) throw new Error('set-limit');
  const commands = parseOperations(operations, {
    makeSet: 1, find: 1, union: 2, inSameSet: 2,
  });
  const sets = new DisjointSet();
  const steps = [];
  let context = {};
  const snapshot = (type, code, variables = {}, active = []) => {
    const nodes = Object.values(sets.items);
    steps.push({
      type,
      code,
      array: nodes.map((node) => ({ value: node.value, id: node.value })),
      indices: nodes.map((node, index) => (active.includes(node) ? index : -1))
        .filter((index) => index >= 0),
      edges: nodes.filter((node) => node.parent).map((node) => [node.value, node.parent.value]),
      variables: {
        ...context,
        structure: 'disjoint-set',
        directed: true,
        seen: nodes.map((node) => node.value).join(','),
        processed: nodes.filter((node) => node.isRoot()).map((node) => node.value).join(','),
        groups: JSON.stringify(nodes.map((node) => [node.value, node.getRoot().value])),
        setNodes: JSON.stringify(nodes.map((node) => ({
          value: node.value,
          parent: node.parent ? node.parent.value : null,
          root: node.getRoot().value,
          size: node.getRank() + 1,
        }))),
        ...variables,
      },
    });
  };
  sets.stepCallback = (step) => snapshot(step.type, step.code, {
    ...step.variables, current: step.array[0].value,
  }, step.array);
  snapshot('start', 'this.items = {};');
  const run = ({ name, value, argument }, phase) => {
    context = { operation: name, value, phase };
    if (argument !== undefined) context.other = argument;
    if (name === 'makeSet') {
      if (Object.keys(sets.items).length >= 12 && sets.find(value) === null) {
        throw new Error('set-limit');
      }
      sets.makeSet(value);
      snapshot(name, 'makeSet(itemValue) {');
    } else if (name === 'find') {
      const result = sets.find(value);
      snapshot(name, 'find(itemValue) {', { result: result === null ? 'null' : result });
    } else {
      if (sets.find(value) === null || sets.find(argument) === null) throw new Error('missing-value');
      const result = sets[name](value, argument);
      const code = name === 'union' ? 'union(valueA, valueB) {' : 'return rootKeyA === rootKeyB;';
      snapshot(name, code, name === 'inSameSet' ? { result } : {});
    }
  };
  values.forEach((value) => run({ name: 'makeSet', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  context = {};
  snapshot('done', steps.at(-1).code);
  return steps;
}
