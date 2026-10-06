import traceTreeDfs, { traceTreeBfs, traceListForward } from '../traversals';

it('traverses the level-order binary tree in preorder and empties the call stack', () => {
  const steps = traceTreeDfs([1, 2, 3, 4, 5, 6, 7]);
  expect(steps.at(-1).variables.result).toBe('1, 2, 4, 5, 3, 6, 7');
  expect(steps.at(-1).variables.stack).toBe('');
  expect(JSON.parse(steps.at(-1).variables.processedIds)).toHaveLength(7);
  expect(traceTreeDfs([1, 1, 1]).at(-1).variables.result).toBe('1, 1, 1');
  expect(traceTreeDfs([]).at(-1).variables.result).toBe('∅');
  expect(JSON.parse(steps[0].variables.tree)[0].left).toBe(1);
});

it('visits breadth-first with snapshots of the actual FIFO queue', () => {
  const steps = traceTreeBfs([1, 2, 3, 4, 5, 6, 7]);
  expect(steps.at(-1).variables.result).toBe('1, 2, 3, 4, 5, 6, 7');
  expect(JSON.parse(steps.at(-1).variables.queue)).toEqual([]);
  expect(steps.find((step) => step.type === 'enqueue').variables.queue).toBe('[1]');
  expect(steps.filter((step) => step.type === 'dequeue').map((step) => step.variables.current))
    .toEqual([1, 2, 3, 4, 5, 6, 7]);
  expect(traceTreeBfs([1, 1, 1]).at(-1).variables.result).toBe('1, 1, 1');
  expect(traceTreeBfs([]).at(-1).variables.result).toBe('∅');
});

it('visits linked nodes forward without changing next links', () => {
  const steps = traceListForward([10, 20, 20]);
  expect(steps.at(-1).variables.result).toBe('10, 20, 20');
  expect(JSON.parse(steps.at(-1).variables.seenIds)).toEqual([0, 1, 2]);
  expect(steps[0].variables.links).toBe(steps.at(-1).variables.links);
  expect(traceListForward([]).at(-1).variables.result).toBe('∅');
  expect(traceListForward([5]).at(-1).variables.result).toBe('5');
});
