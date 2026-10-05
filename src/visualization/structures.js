import Stack from '../data-structures/stack/Stack';
import { MAX_VALUES, parseTarget } from './playback';

export function parseOperations(text, commands) {
  if (!text.trim()) return [];
  // ponytail: 64 operations keep complete snapshots small; use deltas for longer programs.
  const entries = text.split(/[,;\n]/);
  if (entries.length > 64) throw new Error('operations-limit');
  return entries.map((entry) => {
    const [name, ...args] = entry.trim().split(/\s+/);
    if (!Object.prototype.hasOwnProperty.call(commands, name) || args.length !== commands[name]) {
      throw new Error('operations');
    }
    let value;
    if (args.length) {
      try { value = parseTarget(args[0]); } catch (cause) { throw new Error('operations'); }
    }
    return { name, value };
  });
}

export function traceStack(values, operations = '') {
  const commands = parseOperations(operations, { push: 1, pop: 0, peek: 0 });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const stack = new Stack();
  const steps = [];
  const ids = new WeakMap();
  let nextId = 0;
  const snapshot = (type, code, variables = {}, indices = []) => {
    const array = stack.linkedList.toArray().map((node) => {
      if (!ids.has(node)) {
        ids.set(node, nextId);
        nextId += 1;
      }
      return { value: node.value, id: ids.get(node) };
    });
    steps.push({
      type, code, array, indices, variables: { structure: 'stack', ...variables },
    });
  };
  snapshot('start', 'this.linkedList = new LinkedList();');
  const run = ({ name, value }, phase) => {
    const variables = { operation: name, phase };
    if (name === 'push') {
      if (stack.linkedList.toArray().length >= MAX_VALUES) throw new Error('capacity');
      stack.push(value);
      snapshot(name, 'this.linkedList.prepend(value);', { ...variables, value }, [0]);
    } else {
      const result = stack[name]();
      let code = result === null ? 'return null;' : 'return this.linkedList.head.value;';
      if (name === 'pop') code = 'return removedHead ? removedHead.value : null;';
      snapshot(name, code, { ...variables, result: result === null ? 'null' : result }, name === 'peek' && result !== null ? [0] : []);
    }
  };
  values.forEach((value) => run({ name: 'push', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  stack.toArray();
  snapshot('done', 'toArray() {');
  return steps;
}
