import PriorityQueue from '../data-structures/priority-queue/PriorityQueue';
import MinHeap from '../data-structures/heap/MinHeap';
import LinkedList from '../data-structures/linked-list/LinkedList';
import Queue from '../data-structures/queue/Queue';
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
    let parsed = [];
    try { parsed = args.map((arg) => parseTarget(arg)); } catch (cause) { throw new Error('operations'); }
    return { name, value: parsed[0], ...(parsed.length > 1 ? { priority: parsed[1] } : {}) };
  });
}

function traceLinear(values, operations, queue) {
  const insert = queue ? 'enqueue' : 'push';
  const remove = queue ? 'dequeue' : 'pop';
  const commands = parseOperations(operations, { [insert]: 1, [remove]: 0, peek: 0 });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const stack = queue ? new Queue() : new Stack();
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
      type, code, array, indices, variables: { structure: queue ? 'queue' : 'stack', ...variables },
    });
  };
  snapshot('start', 'this.linkedList = new LinkedList();');
  const run = ({ name, value }, phase) => {
    const variables = { operation: name, phase };
    if (name === insert) {
      if (stack.linkedList.toArray().length >= MAX_VALUES) throw new Error('capacity');
      stack[insert](value);
      snapshot(name, queue ? 'this.linkedList.append(value);' : 'this.linkedList.prepend(value);', { ...variables, value }, [queue ? stack.linkedList.toArray().length - 1 : 0]);
    } else {
      const result = stack[name]();
      let code = result === null ? 'return null;' : 'return this.linkedList.head.value;';
      if (name === remove) code = 'return removedHead ? removedHead.value : null;';
      snapshot(name, code, { ...variables, result: result === null ? 'null' : result }, name === 'peek' && result !== null ? [0] : []);
    }
  };
  values.forEach((value) => run({ name: insert, value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  if (queue) stack.toString();
  else stack.toArray();
  snapshot('done', queue ? 'return this.linkedList.toString(callback);' : 'toArray() {');
  return steps;
}

export function traceStack(values, operations = '') {
  return traceLinear(values, operations, false);
}

export function traceQueue(values, operations = '') {
  return traceLinear(values, operations, true);
}

export function traceLinkedList(values, operations = '') {
  const commands = parseOperations(operations, {
    append: 1, prepend: 1, delete: 1, find: 1, reverse: 0, deleteHead: 0, deleteTail: 0,
  });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const list = new LinkedList();
  const steps = [];
  const ids = new WeakMap();
  let nextId = 0;
  const identify = (node) => {
    if (!node) return -1;
    if (!ids.has(node)) {
      ids.set(node, nextId);
      nextId += 1;
    }
    return ids.get(node);
  };
  const snapshot = (type, code, variables = {}, active = [], nodes = list.toArray()) => {
    const array = nodes.map((node) => ({ value: node.value, id: identify(node) }));
    steps.push({
      type,
      code,
      array,
      indices: nodes.map((node, index) => (active.includes(node) ? index : -1))
        .filter((index) => index >= 0),
      variables: {
        structure: 'linked-list',
        head: identify(list.head),
        tail: identify(list.tail),
        links: JSON.stringify(nodes.map((node) => [identify(node), identify(node.next)])),
        ...variables,
      },
    });
  };
  snapshot('start', 'this.head = null;');
  const run = ({ name, value }, phase) => {
    const variables = { operation: name, phase };
    if (name === 'append' || name === 'prepend') {
      if (list.toArray().length >= MAX_VALUES) throw new Error('capacity');
      list[name](value);
      snapshot(name, `${name}(value) {`, { ...variables, value }, [name === 'append' ? list.tail : list.head]);
    } else if (name === 'find') {
      let index = 0;
      const nodes = list.toArray();
      const result = list.find({
        callback: (candidate) => {
          snapshot('inspect', 'if (callback && callback(currentNode.value)) {', { ...variables, value, index }, [nodes[index]]);
          index += 1;
          return candidate === value;
        },
      });
      snapshot(name, result ? 'return currentNode;' : 'find({ value = undefined, callback = undefined }) {', { ...variables, value, result: result ? result.value : 'null' }, [result]);
    } else if (name === 'reverse') {
      const nodes = list.toArray();
      list.reverse((step) => {
        const [current, previous, next] = step.array;
        snapshot(step.type, step.code, {
          ...variables,
          current: identify(current),
          previous: identify(previous),
          next: identify(next),
        }, [current], nodes);
      });
      snapshot(name, 'this.head = prevNode;', variables);
    } else {
      const result = list[name](value);
      snapshot(name, `${name}(${name === 'delete' ? 'value' : ''}) {`, { ...variables, result: result ? result.value : 'null' });
    }
  };
  values.forEach((value) => run({ name: 'append', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  list.toArray();
  snapshot('done', 'toArray() {');
  return steps;
}

export function traceHeap(values, operations = '') {
  const commands = parseOperations(operations, { add: 1, poll: 0, peek: 0 });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const steps = [];
  let context = {};
  let nextId = 0;
  const heap = new MinHeap((a, b) => a.value - b.value, (step) => {
    steps.push({
      ...step,
      variables: {
        ...context, structure: 'heap', sortedCount: 0, heapSize: step.array.length, adjusting: true,
      },
    });
  });
  const snapshot = (type, code, variables = {}, indices = []) => {
    steps.push({
      type,
      code,
      array: [...heap.heapContainer],
      indices,
      variables: {
        ...context,
        structure: 'heap',
        sortedCount: 0,
        heapSize: heap.heapContainer.length,
        adjusting: false,
        ...variables,
      },
    });
  };
  snapshot('start', 'this.heapContainer = [];');
  const run = ({ name, value }, phase) => {
    context = { operation: name, phase };
    if (name === 'add') {
      if (heap.heapContainer.length >= MAX_VALUES) throw new Error('capacity');
      context.value = value;
      heap.add({ value, id: nextId });
      nextId += 1;
      snapshot('settled', 'return this;');
    } else {
      const result = heap[name]();
      snapshot(name, `${name}() {`, { result: result ? result.value : 'null' }, name === 'peek' && result ? [0] : []);
    }
  };
  values.forEach((value) => run({ name: 'add', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  context = {};
  heap.toString();
  snapshot('done', 'return this.heapContainer.toString();');
  return steps;
}

export function tracePriorityQueue(values, operations = '') {
  const commands = parseOperations(operations, {
    add: 2, changePriority: 2, remove: 1, poll: 0, peek: 0,
  });
  if (values.length > MAX_VALUES) throw new Error('limit');
  if (new Set(values).size !== values.length) throw new Error('duplicate-values');
  const queue = new PriorityQueue();
  const steps = [];
  const ids = new Map();
  let nextId = 0;
  let context = {};
  const snapshot = (type, code, indices = [], variables = {}, array = queue.heapContainer) => {
    steps.push({
      type,
      code,
      indices: [...indices],
      array: array.map((value) => ({ value, id: ids.get(value) })),
      variables: {
        ...context,
        structure: 'priority-queue',
        sortedCount: 0,
        heapSize: array.length,
        priorities: JSON.stringify(Object.fromEntries(
          array.map((value) => [value, queue.priorities.get(value)]),
        )),
        ...variables,
      },
    });
  };
  queue.stepCallback = (step) => {
    snapshot(step.type, step.code, step.indices, { adjusting: true }, step.array);
  };
  snapshot('start', 'this.priorities = new Map();');
  const run = ({ name, value, priority }, phase) => {
    context = { operation: name, phase };
    if (name === 'add') {
      if (queue.hasValue(value)) throw new Error('duplicate-values');
      if (queue.heapContainer.length >= MAX_VALUES) throw new Error('capacity');
      ids.set(value, nextId);
      nextId += 1;
      context = { ...context, value, priority };
      queue.add(value, priority);
      snapshot('settled', 'this.priorities.set(item, priority);');
    } else if (name === 'changePriority' || name === 'remove') {
      if (!queue.hasValue(value)) throw new Error('missing-value');
      context = { ...context, value };
      if (name === 'changePriority') {
        context.priority = priority;
        queue.changePriority(value, priority);
        snapshot(name, 'this.add(item, priority);');
      } else {
        queue.remove(value);
        snapshot(name, 'this.priorities.delete(item);');
        ids.delete(value);
      }
    } else {
      const result = queue[name]();
      snapshot(name, `${name}() {`, name === 'peek' && result !== null ? [0] : [], { result: result === null ? 'null' : result });
      if (name === 'poll' && result !== null) ids.delete(result);
    }
  };
  values.forEach((value) => run({ name: 'add', value, priority: value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  context = {};
  queue.toString();
  snapshot('done', 'return this.heapContainer.toString();');
  return steps;
}
