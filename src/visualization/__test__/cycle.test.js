import { traceCycle } from '../graph';

it('distinguishes directed cycles, parent edges and disconnected components', () => {
  const nodes = [1, 2, 3, 4, 5];
  const run = (edges, directed) => traceCycle(nodes, edges, directed).at(-1).variables.result;
  expect(run([[1, 2], [2, 3]], false)).toBe('acyclic');
  expect(run([[1, 2], [3, 4], [4, 5], [5, 3]], false)).toBe('cycle');
  expect(run([[1, 2], [1, 3], [2, 3]], true)).toBe('acyclic');
  expect(run([[1, 2], [2, 3], [3, 1]], true)).toBe('cycle');
  expect(run([], false)).toBe('acyclic');
});
