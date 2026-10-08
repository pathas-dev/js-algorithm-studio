import LRUCacheOnMap from '../data-structures/lru-cache/LRUCacheOnMap';
import Deque from '../data-structures/deque/Deque';
import BinarySearchTree from '../data-structures/tree/binary-search-tree/BinarySearchTree';
import AvlTree from '../data-structures/tree/avl-tree/AvlTree';
import RedBlackTree from '../data-structures/tree/red-black-tree/RedBlackTree';
import PriorityQueue from '../data-structures/priority-queue/PriorityQueue';
import MinHeap from '../data-structures/heap/MinHeap';
import MaxHeap from '../data-structures/heap/MaxHeap';
import LinkedList from '../data-structures/linked-list/LinkedList';
import DoublyLinkedList from '../data-structures/doubly-linked-list/DoublyLinkedList';
import Queue from '../data-structures/queue/Queue';
import Stack from '../data-structures/stack/Stack';
import { MAX_VALUES, parseTarget } from './playback';

export function parseOperations(text, commands, parseArgument = parseTarget) {
  if (!text.trim()) return [];
  // ponytail: 64 operations keep complete snapshots small; use deltas for longer programs.
  const entries = text.split(/[,;\n]/);
  if (entries.length > 64) throw new Error('operations-limit');
  return entries.map((entry) => {
    const [name, ...args] = entry.trim().split(/\s+/);
    if (!Object.hasOwn(commands, name) || args.length !== commands[name]) {
      throw new Error('operations');
    }
    let parsed = [];
    try { parsed = args.map((arg) => parseArgument(arg)); } catch { throw new Error('operations'); }
    return { name, value: parsed[0], ...(parsed.length > 1 ? { argument: parsed[1] } : {}) };
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

export function traceLinkedList(values, operations = '', List = LinkedList) {
  const commands = parseOperations(operations, {
    append: 1, prepend: 1, delete: 1, find: 1, reverse: 0, deleteHead: 0, deleteTail: 0,
  });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const list = new List();
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
        structure: List === DoublyLinkedList ? 'doubly-linked-list' : 'linked-list',
        head: identify(list.head),
        tail: identify(list.tail),
        links: JSON.stringify(nodes.map((node) => [identify(node), identify(node.next)])),
        ...(List === DoublyLinkedList ? {
          previousLinks: JSON.stringify(nodes.map((node) => [
            identify(node), identify(node.previous),
          ])),
        } : {}),
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

export function traceDoublyLinkedList(values, operations = '') {
  return traceLinkedList(values, operations, DoublyLinkedList);
}

export function traceHeap(values, operations = '', Heap = MinHeap) {
  const commands = parseOperations(operations, { add: 1, poll: 0, peek: 0 });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const steps = [];
  let context = {};
  let nextId = 0;
  const structure = Heap === MaxHeap ? 'max-heap' : 'heap';
  const heap = new Heap((a, b) => a.value - b.value, (step) => {
    steps.push({
      ...step,
      variables: {
        ...context, structure, sortedCount: 0, heapSize: step.array.length, adjusting: true,
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
        structure,
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

export function traceMaxHeap(values, operations = '') {
  return traceHeap(values, operations, MaxHeap);
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
  const run = ({ name, value, argument: priority }, phase) => {
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
  values.forEach((value) => run({ name: 'add', value, argument: value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  context = {};
  queue.toString();
  snapshot('done', 'return this.heapContainer.toString();');
  return steps;
}

export function traceBinarySearchTree(values, operations = '', Tree = BinarySearchTree, structure = 'binary-search-tree') {
  const commands = parseOperations(operations, structure === 'red-black-tree'
    ? { insert: 1, find: 1 } : { insert: 1, find: 1, remove: 1 });
  // ponytail: 12 nodes keep an unbalanced tree readable; expand with a zoomable canvas if needed.
  if (values.length > MAX_VALUES) throw new Error('limit');
  if (new Set(values).size > 12) throw new Error('tree-limit');
  const tree = new Tree();
  const steps = [];
  const ids = new WeakMap();
  let nextId = 0;
  let context = {};
  const identify = (node) => {
    if (!node) return -1;
    if (!ids.has(node)) {
      ids.set(node, nextId);
      nextId += 1;
    }
    return ids.get(node);
  };
  const snapshot = (type, code, variables = {}, active = null) => {
    const nodes = [];
    const visit = (node, depth) => {
      if (!node || node.value === null) return;
      nodes.push({ node, depth });
      visit(node.left, depth + 1);
      visit(node.right, depth + 1);
    };
    visit(tree.root, 0);
    steps.push({
      type,
      code,
      array: nodes.map(({ node }) => ({ value: node.value, id: identify(node) })),
      indices: nodes.map(({ node }, index) => (node === active ? index : -1))
        .filter((index) => index >= 0),
      variables: {
        ...context,
        structure,
        tree: JSON.stringify(nodes.map(({ node, depth }) => ({
          id: identify(node),
          value: node.value,
          depth,
          left: identify(node.left),
          right: identify(node.right),
          ...(structure === 'avl-tree' ? { balance: node.balanceFactor, height: node.height } : {}),
          ...(structure === 'red-black-tree' ? { color: node.meta.get('color') || 'uncolored' } : {}),
        }))),
        inorder: tree.root.value === null ? '' : tree.root.traverseInOrder().join(', '),
        ...variables,
      },
    });
  };
  const observe = (step) => {
    const node = step.array[0];
    snapshot(step.type, step.code, { ...step.variables, current: node.value === null ? '∅' : node.value }, node);
  };
  snapshot('start', 'this.root = new BinarySearchTreeNode(null, nodeValueCompareFunction);');
  const run = ({ name, value }, phase) => {
    context = { operation: name, value, phase };
    if (name === 'insert') {
      if (tree.root.traverseInOrder().length >= 12 && !tree.contains(value)) throw new Error('tree-limit');
      tree.insert(value, observe);
      const result = tree.root.find(value);
      let code = 'return this.root.insert(value, stepCallback);';
      if (structure === 'red-black-tree') code = 'return insertedNode;';
      if (structure === 'avl-tree') code = 'currentNode = currentNode.parent;';
      snapshot('insert-done', code, {}, result);
    } else {
      const result = tree.root.find(value, observe);
      if (name === 'find') {
        snapshot(name, 'find(value, stepCallback) {', { result: result ? result.value : 'null' }, result);
      } else {
        if (!result) throw new Error('missing-value');
        const children = Number(!!result.left) + Number(!!result.right);
        let code = 'const nextBiggerNode = nodeToRemove.right.findMin();';
        if (children === 0) {
          code = result.parent ? 'parent.removeChild(nodeToRemove);' : 'nodeToRemove.setValue(null);';
        } else if (children === 1) {
          code = result.parent ? 'parent.replaceChild(nodeToRemove, childNode);'
            : 'BinaryTreeNode.copyNode(childNode, nodeToRemove);';
        }
        tree.remove(value, observe);
        snapshot(name, code, { children });
      }
    }
  };
  values.forEach((value) => run({ name: 'insert', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  context = {};
  tree.toString();
  snapshot('done', 'return this.root.toString();');
  return steps;
}

export function traceAvlTree(values, operations = '') {
  return traceBinarySearchTree(values, operations, AvlTree, 'avl-tree');
}

export function traceRedBlackTree(values, operations = '') {
  return traceBinarySearchTree(values, operations, RedBlackTree, 'red-black-tree');
}

export function traceDeque(values, operations = '') {
  const commands = parseOperations(operations, {
    addFront: 1,
    addBack: 1,
    removeFront: 0,
    removeBack: 0,
    peekFront: 0,
    peekBack: 0,
    size: 0,
  });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const deque = new Deque();
  const steps = [];
  const ids = new WeakMap();
  let nextId = 0;
  const identify = (node) => {
    if (!node) return -1;
    if (!ids.has(node)) { ids.set(node, nextId); nextId += 1; }
    return ids.get(node);
  };
  const snapshot = (type, code, variables = {}, active = null) => {
    const nodes = deque.linkedList.toArray();
    steps.push({
      type,
      code,
      array: nodes.map((node) => ({ value: node.value, id: identify(node) })),
      indices: nodes.flatMap((node, index) => (node === active ? [index] : [])),
      variables: {
        structure: 'deque',
        head: identify(deque.linkedList.head),
        tail: identify(deque.linkedList.tail),
        size: deque.size,
        links: JSON.stringify(nodes.map((node) => [identify(node), identify(node.next)])),
        previousLinks: JSON.stringify(nodes.map(
          (node) => [identify(node), identify(node.previous)],
        )),
        ...variables,
      },
    });
  };
  snapshot('start', 'this.linkedList = new DoublyLinkedList();');
  const run = ({ name, value }, phase) => {
    if (name === 'addFront' || name === 'addBack') {
      if (deque.size >= MAX_VALUES) throw new Error('capacity');
      deque[name](value);
      snapshot(
        name,
        `${name}(value) {`,
        { value, phase },
        name === 'addFront' ? deque.linkedList.head : deque.linkedList.tail,
      );
    } else {
      const result = name === 'size' ? deque.size : deque[name]();
      snapshot(
        name,
        name === 'size' ? 'return this.length;' : `${name}() {`,
        { result: result === null ? 'null' : result, phase },
      );
    }
  };
  values.forEach((value) => run({ name: 'addBack', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  snapshot('done', 'toArray() {');
  return steps;
}

export function traceLru(values, capacity = 3, operations = '') {
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 12) throw new Error('cache-capacity');
  const commands = parseOperations(operations, { set: 2, get: 1 });
  if (values.length > MAX_VALUES) throw new Error('limit');
  const cache = new LRUCacheOnMap(capacity);
  const ids = new Map();
  const steps = [];
  const snapshot = (type, code, variables = {}) => {
    const entries = [...cache.items];
    entries.forEach(([key]) => { if (!ids.has(key)) ids.set(key, ids.size); });
    steps.push({
      type,
      code,
      array: entries.map(([key, value]) => ({ value, id: ids.get(key) })),
      indices: variables.key === undefined ? [] : entries.flatMap(
        ([key], index) => (key === variables.key ? [index] : []),
      ),
      variables: {
        structure: 'lru-cache', entries: JSON.stringify(entries), capacity, ...variables,
      },
    });
  };
  snapshot('start', 'this.items = new Map();');
  const run = ({ name, value, argument }, phase) => {
    const key = String(value);
    if (name === 'set') {
      const before = [...cache.items.keys()];
      cache.set(key, argument);
      const evicted = before.find((old) => !cache.items.has(old));
      snapshot('set', 'set(key, val) {', {
        key, value: argument, phase, ...(evicted === undefined ? {} : { evicted }),
      });
    } else {
      const result = cache.get(key);
      snapshot('get', 'get(key) {', { key, phase, result: result === undefined ? 'undefined' : result });
    }
  };
  values.forEach((value) => run({ name: 'set', value, argument: value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  snapshot('done', 'class LRUCacheOnMap {');
  return steps;
}
