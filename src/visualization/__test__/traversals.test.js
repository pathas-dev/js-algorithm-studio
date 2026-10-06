import traceTreeDfs from '../traversals';

it('traverses the level-order binary tree in preorder and empties the call stack', () => {
  const steps = traceTreeDfs([1, 2, 3, 4, 5, 6, 7]);
  expect(steps.at(-1).variables.result).toBe('1, 2, 4, 5, 3, 6, 7');
  expect(steps.at(-1).variables.stack).toBe('');
  expect(JSON.parse(steps.at(-1).variables.processedIds)).toHaveLength(7);
  expect(traceTreeDfs([1, 1, 1]).at(-1).variables.result).toBe('1, 1, 1');
  expect(traceTreeDfs([]).at(-1).variables.result).toBe('∅');
  expect(JSON.parse(steps[0].variables.tree)[0].left).toBe(1);
});
