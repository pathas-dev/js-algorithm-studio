import fs from 'fs';
import path from 'path';
import LinkedList from '../../data-structures/linked-list/LinkedList';
import { algorithmCode } from '../playback';
import Stack from '../../data-structures/stack/Stack';
import {
  parseOperations, traceStack, traceQueue, traceLinkedList, traceHeap, tracePriorityQueue,
  traceBinarySearchTree, traceAvlTree, traceRedBlackTree, traceDoublyLinkedList,
} from '../structures';

describe('structure lessons', () => {
  it('records both actual doubly-linked pointers during reversal and after deletions', () => {
    const steps = traceDoublyLinkedList([3, 6, 3], 'prepend 9, reverse, delete 3, deleteTail, deleteHead, deleteHead, append 0');
    const reversed = steps.filter((step) => step.type === 'reverse-links');
    expect(reversed).toHaveLength(4);
    expect(JSON.parse(reversed[0].variables.links)).toEqual([[3, -1], [0, 1], [1, 2], [2, -1]]);
    expect(JSON.parse(reversed[0].variables.previousLinks))
      .toEqual([[3, 0], [0, 3], [1, 0], [2, 1]]);
    expect(steps.find((step) => step.type === 'reverse').array.map((item) => item.id))
      .toEqual([2, 1, 0, 3]);
    const source = algorithmCode(fs.readFileSync(path.resolve(
      __dirname,
      '../../data-structures/doubly-linked-list/DoublyLinkedList.js',
    ), 'utf8'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      if (step.type === 'reverse-links') return;
      const next = JSON.parse(step.variables.links);
      const previous = JSON.parse(step.variables.previousLinks);
      next.filter(([, to]) => to >= 0)
        .forEach(([from, to]) => expect(previous).toContainEqual([to, from]));
      previous.filter(([, to]) => to >= 0)
        .forEach(([from, to]) => expect(next).toContainEqual([to, from]));
    });
    expect(steps.at(-1).array.map((item) => item.value)).toEqual([0]);
    expect(traceDoublyLinkedList([], 'find 0, reverse, deleteTail').at(-1).array).toEqual([]);
  });

  it('records red-black colors and rotations while preserving black heights and duplicates', () => {
    const source = algorithmCode([
      'tree/red-black-tree/RedBlackTree.js', 'tree/binary-search-tree/BinarySearchTree.js',
      'tree/binary-search-tree/BinarySearchTreeNode.js',
    ].map((file) => fs.readFileSync(path.resolve(__dirname, '../../data-structures', file), 'utf8')).join('\n'));
    [[3, 2, 1], [3, 1, 2], [1, 2, 3], [1, 3, 2], [30, 20, 40, 10, 25, 35, 50]].forEach((values) => {
      const steps = traceRedBlackTree(values, 'insert 25, insert 25, find 25, find 999');
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((i) => i >= 0 && i < step.array.length)).toBe(true);
        const nodes = JSON.parse(step.variables.tree);
        if (!nodes.length || !['insert-done', 'done'].includes(step.type)) return;
        expect(nodes[0].color).toBe('black');
        const height = (id) => {
          const node = nodes.find((item) => item.id === id);
          if (!node) return 1;
          if (node.color === 'red') {
            expect([node.left, node.right].every((child) => child < 0
              || nodes.find((item) => item.id === child).color === 'black')).toBe(true);
          }
          const leftHeight = height(node.left);
          expect(height(node.right)).toBe(leftHeight);
          return leftHeight + Number(node.color === 'black');
        };
        height(nodes[0].id);
      });
      const duplicates = steps.filter((step) => step.type === 'duplicate');
      expect(duplicates.length).toBeGreaterThan(0);
      expect(duplicates.at(-1).variables.tree).toBe(duplicates[0].variables.tree);
      expect(steps.filter((step) => step.type === 'find').map((step) => step.variables.result))
        .toEqual([25, 'null']);
    });
    expect(traceRedBlackTree([]).at(-1).array).toEqual([]);
    expect(() => traceRedBlackTree([1], 'remove 1')).toThrow('operations');
  });

  it('records all AVL rotations with stable identities, actual source and balanced operation results', () => {
    const source = algorithmCode([
      'tree/avl-tree/AvlTree.js', 'tree/binary-search-tree/BinarySearchTree.js',
      'tree/binary-search-tree/BinarySearchTreeNode.js',
    ].map((file) => fs.readFileSync(path.resolve(__dirname, '../../data-structures', file), 'utf8')).join('\n'));
    [[3, 2, 1], [3, 1, 2], [1, 2, 3], [1, 3, 2]].forEach((values, index) => {
      const steps = traceAvlTree(values, 'find 8, remove 1, remove 2, remove 3, insert 0');
      const rotations = steps.filter((step) => step.type === 'rotation-start');
      expect(rotations[0].variables.rotation).toBe(['LL', 'LR', 'RR', 'RL'][index]);
      expect(steps.at(-1).array.map((item) => item.value)).toEqual([0]);
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((i) => i >= 0 && i < step.array.length)).toBe(true);
        const nodes = JSON.parse(step.variables.tree);
        expect(new Set(nodes.map((node) => node.id)).size).toBe(nodes.length);
        if (['insert-done', 'remove', 'done'].includes(step.type)) {
          expect(nodes.every((node) => Math.abs(node.balance) <= 1)).toBe(true);
        }
      });
      const before = rotations[0].array.map((item) => item.id).sort();
      const after = steps.find((step) => step.type === 'rotation').array.map((item) => item.id).sort();
      expect(after).toEqual(before);
    });
    expect(traceAvlTree([]).at(-1).array).toEqual([]);
    expect(traceAvlTree([1, 1]).at(-1).array).toHaveLength(1);
    expect(() => traceAvlTree([], 'remove 1')).toThrow('missing-value');
    expect(() => traceAvlTree(Array.from({ length: 13 }, (_, i) => i))).toThrow('tree-limit');
  });

  it('validates operation names, arguments and bounds before execution', () => {
    const commands = { push: 1, pop: 0, peek: 0 };
    expect(parseOperations('', commands)).toEqual([]);
    expect(parseOperations('push -2.5; peek\npop', commands)).toEqual([
      { name: 'push', value: -2.5 }, { name: 'peek', value: undefined }, { name: 'pop', value: undefined },
    ]);
    ['wat', 'toString', 'push', 'push 1 2', 'pop 1', 'push NaN', 'push 1000', 'pop,'].forEach((text) => {
      expect(() => parseOperations(text, commands)).toThrow('operations');
    });
    expect(() => parseOperations(Array(65).fill('pop').join(','), commands)).toThrow('operations-limit');
  });

  it('executes the real stack with immutable states and stable node identities', () => {
    const values = [3, -2.5, 3];
    const steps = traceStack(values, 'peek, pop, push 7, pop, pop, pop, peek, pop');
    const real = new Stack();
    values.forEach((value) => real.push(value));
    const expected = [real.peek(), real.pop()];
    real.push(7);
    expected.push(real.pop(), real.pop(), real.pop(), real.peek(), real.pop());
    expect(steps.filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual(expected.map((value) => (value === null ? 'null' : value)));
    expect(steps[0].array).toEqual([]);
    expect(steps[3].array.map((item) => item.value)).toEqual([3, -2.5, 3]);
    expect(steps[4].array[0].id).toBe(steps[3].array[0].id);
    expect(steps[5].array[0].id).toBe(steps[3].array[1].id);
    expect(steps[6].array[0].id).not.toBe(steps[3].array[0].id);
    expect(steps.at(-1).array).toEqual(real.toArray());
    expect(values).toEqual([3, -2.5, 3]);
    const source = fs.readFileSync(path.resolve(__dirname, '../../data-structures/stack/Stack.js'), 'utf8');
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      expect(new Set(step.array.map((item) => item.id)).size).toBe(step.array.length);
      expect(step.indices.every((index) => index >= 0 && index < step.array.length)).toBe(true);
    });
    expect(traceStack([])).toHaveLength(2);
    expect(() => traceStack(Array(33).fill(1))).toThrow('limit');
    expect(() => traceStack(Array(32).fill(1), 'push 2')).toThrow('capacity');
    expect(traceStack(Array(32).fill(1), 'pop, push 2').at(-1).array[0].value).toBe(2);
  });
  it('enqueues at the rear and dequeues at the front without changing older snapshots', () => {
    const steps = traceQueue([3, 3, -1.5], 'peek, enqueue 9, dequeue, dequeue, peek, dequeue, dequeue, dequeue, peek');
    expect(steps[3].array.map((item) => item.value)).toEqual([3, 3, -1.5]);
    expect(steps[5].array.map((item) => item.value)).toEqual([3, 3, -1.5, 9]);
    expect(steps[6].array[0].id).toBe(steps[3].array[1].id);
    expect(steps.filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual([3, 3, 3, -1.5, -1.5, 9, 'null', 'null']);
    expect(steps.at(-1).array).toEqual([]);
    const source = fs.readFileSync(path.resolve(__dirname, '../../data-structures/queue/Queue.js'), 'utf8');
    steps.forEach((step) => expect(source).toContain(step.code));
    expect(traceQueue([])).toHaveLength(2);
    expect(() => traceQueue(Array(32).fill(1), 'enqueue 2')).toThrow('capacity');
  });
  it('records actual next links during reversal, including disconnected nodes and duplicates', () => {
    const steps = traceLinkedList([3, 3, -1.5], 'find 3, find 8, prepend 9, reverse, delete 3, deleteHead, deleteTail, deleteTail, find 0, reverse');
    const reversed = steps.filter((step) => step.type === 'reverse-link');
    expect(reversed).toHaveLength(4);
    expect(JSON.parse(reversed[0].variables.links)).toEqual([[3, -1], [0, 1], [1, 2], [2, -1]]);
    expect(JSON.parse(reversed[1].variables.links)).toEqual([[3, -1], [0, 3], [1, 2], [2, -1]]);
    expect(reversed[0].array.map((item) => item.value)).toEqual([9, 3, 3, -1.5]);
    expect(steps.filter((step) => step.type === 'reverse')[0].array.map((item) => item.id)).toEqual([2, 1, 0, 3]);
    expect(steps.filter((step) => step.type === 'delete')[0].array.map((item) => item.value)).toEqual([-1.5, 9]);
    expect(steps.at(-1).array).toEqual([]);
    const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/linked-list/LinkedList.js'), 'utf8'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      expect(step.indices.every((index) => index >= 0 && index < step.array.length)).toBe(true);
    });
    expect(traceLinkedList([])).toHaveLength(2);
    expect(traceLinkedList([], 'delete 1, deleteHead, deleteTail, find 2').at(-1).array).toEqual([]);
    expect(() => traceLinkedList(Array(33).fill(1))).toThrow('limit');
    expect(() => traceLinkedList(Array(32).fill(1), 'prepend 2')).toThrow('capacity');
    const real = new LinkedList().fromArray([2, 5, 8]);
    real.reverse();
    real.delete(5);
    const trace = traceLinkedList([2, 5, 8], 'reverse, delete 5');
    expect(trace.at(-1).array.map((item) => item.value))
      .toEqual(real.toArray().map((node) => node.value));
    expect(traceLinkedList([1], 'reverse').filter((step) => step.type === 'reverse-link')).toHaveLength(1);
  });
  it('records real heap swaps and extracts minima in sorted order', () => {
    [[], [0], [-2.5, 3, -2.5, 0], [8, 3, 6, 1, 5, 2], [1, 2, 3], [3, 2, 1]].forEach((values) => {
      const steps = traceHeap(values, Array(values.length + 1).fill('poll').concat('peek').join(','));
      expect(steps.filter((step) => step.type === 'poll').map((step) => step.variables.result))
        .toEqual([...values].sort((a, b) => a - b).concat('null'));
      expect(steps[0].array).toEqual([]);
      expect(steps.at(-1).array).toEqual([]);
      const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/heap/Heap.js'), 'utf8'));
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((index) => index >= 0 && index < step.array.length)).toBe(true);
        if (!step.variables.adjusting) {
          step.array.slice(1).forEach((item, index) => {
            expect(step.array[Math.floor(index / 2)].value).toBeLessThanOrEqual(item.value);
          });
        }
      });
    });
    const steps = traceHeap([6, 3, 9], 'add 1, peek, poll, peek');
    expect(steps.filter((step) => step.type === 'peek').map((step) => step.variables.result)).toEqual([1, 3]);
    expect(steps.find((step) => step.type === 'settled').array.map((item) => item.value)).toEqual([6]);
    expect(steps.some((step) => step.type === 'compare-down')).toBe(true);
    expect(steps.some((step) => step.type === 'swap')).toBe(true);
    expect(traceHeap([])).toHaveLength(2);
    expect(() => traceHeap(Array(33).fill(1))).toThrow('limit');
    expect(() => traceHeap(Array(32).fill(1), 'add 2')).toThrow('capacity');
  });
  it('orders by priority independently of values and records reprioritization', () => {
    const steps = tracePriorityQueue([8, 3, 6], 'add 42 -1, peek, changePriority 8 -2, poll, remove 6, peek');
    expect(steps.filter((step) => step.type === 'peek' || step.type === 'poll').map((step) => step.variables.result))
      .toEqual([42, 8, 42]);
    expect(steps.at(-1).array.map((item) => item.value)).toEqual([42, 3]);
    const old = steps.find((step) => step.type === 'settled' && step.variables.value === 8);
    expect(JSON.parse(old.variables.priorities)).toEqual({ 8: 8 });
    const changed = steps.find((step) => step.type === 'changePriority');
    expect(JSON.parse(changed.variables.priorities)[8]).toBe(-2);
    expect(changed.array.find((item) => item.value === 8).id).toBe(old.array[0].id);
    const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/heap/Heap.js'), 'utf8')
      + fs.readFileSync(path.resolve(__dirname, '../../data-structures/priority-queue/PriorityQueue.js'), 'utf8'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      expect(step.indices.every((index) => index >= 0 && index < step.array.length)).toBe(true);
      if (!step.variables.adjusting) {
        const priorities = JSON.parse(step.variables.priorities);
        step.array.slice(1).forEach((item, index) => {
          expect(priorities[step.array[Math.floor(index / 2)].value])
            .toBeLessThanOrEqual(priorities[item.value]);
        });
      }
    });
    expect(tracePriorityQueue([])).toHaveLength(2);
    expect(tracePriorityQueue([], 'poll, peek, add 0 0, poll').filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual(['null', 'null', 0]);
    expect(() => tracePriorityQueue([1, 1])).toThrow('duplicate-values');
    expect(() => tracePriorityQueue([1], 'add 1 2')).toThrow('duplicate-values');
    expect(() => tracePriorityQueue([1], 'remove 2')).toThrow('missing-value');
    expect(() => tracePriorityQueue([1], 'changePriority 2 0')).toThrow('missing-value');
    expect(() => tracePriorityQueue(Array.from({ length: 33 }, (_, index) => index))).toThrow('limit');
    expect(() => tracePriorityQueue(Array.from({ length: 32 }, (_, index) => index), 'add 40 1')).toThrow('capacity');
    expect(() => tracePriorityQueue([], 'add 1 nope')).toThrow('operations');
    expect(tracePriorityQueue([], 'add 1 0, add 2 0, add 3 -1, poll, poll, poll').at(-1).array).toEqual([]);
    expect(tracePriorityQueue([1], 'poll, add 1 2').at(-1).array[0].id).toBe(1);
  });
  it('traces BST comparison paths and preserves order through repeated removals', () => {
    const steps = traceBinarySearchTree([8, 4, 12, 2, 6, 10, 14], 'find 6, find 9, insert 5, insert 5, remove 4, remove 5, remove 12, remove 14');
    expect(steps.filter((step) => step.type === 'find').map((step) => step.variables.result)).toEqual([6, 'null']);
    expect(steps.at(-1).variables.inorder).toBe('2, 6, 8, 10');
    const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/tree/binary-search-tree/BinarySearchTree.js'), 'utf8')
      + fs.readFileSync(path.resolve(__dirname, '../../data-structures/tree/binary-search-tree/BinarySearchTreeNode.js'), 'utf8'));
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      const nodes = JSON.parse(step.variables.tree);
      nodes.forEach((node) => {
        const left = nodes.find((item) => item.id === node.left);
        const right = nodes.find((item) => item.id === node.right);
        if (left) expect(left.value).toBeLessThan(node.value);
        if (right) expect(right.value).toBeGreaterThan(node.value);
      });
      expect(step.indices.every((index) => index >= 0 && index < step.array.length)).toBe(true);
    });
    expect(steps[0].array).toEqual([]);
    expect(traceBinarySearchTree([])).toHaveLength(2);
    expect(traceBinarySearchTree([], 'find 1, insert 0, remove 0, insert 2').at(-1).variables.inorder).toBe('2');
    expect(traceBinarySearchTree([2, 1], 'remove 2, remove 1, insert -2.5').at(-1).variables.inorder).toBe('-2.5');
    expect(() => traceBinarySearchTree([], 'remove 2')).toThrow('missing-value');
    expect(() => traceBinarySearchTree(Array(33).fill(1))).toThrow('limit');
    expect(() => traceBinarySearchTree(Array.from({ length: 13 }, (_, index) => index))).toThrow('tree-limit');
    expect(() => traceBinarySearchTree(Array.from({ length: 12 }, (_, index) => index), 'insert 12')).toThrow('tree-limit');
    expect(traceBinarySearchTree(Array.from({ length: 12 }, (_, index) => index), 'insert 11').at(-1).array).toHaveLength(12);
  });
});
