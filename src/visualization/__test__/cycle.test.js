import {
  traceCycle, traceArticulation, traceBridges, traceEulerian,
} from '../graph';

it('distinguishes directed cycles, parent edges and disconnected components', () => {
  const nodes = [1, 2, 3, 4, 5];
  const run = (edges, directed) => traceCycle(nodes, edges, directed).at(-1).variables.result;
  expect(run([[1, 2], [2, 3]], false)).toBe('acyclic');
  expect(run([[1, 2], [3, 4], [4, 5], [5, 3]], false)).toBe('cycle');
  expect(run([[1, 2], [1, 3], [2, 3]], true)).toBe('acyclic');
  expect(run([[1, 2], [2, 3], [3, 1]], true)).toBe('cycle');
  expect(run([], false)).toBe('acyclic');
});

it('finds cut vertices in every component and treats DFS roots correctly', () => {
  const nodes = [1, 2, 3, 4, 5, 6];
  const edges = [[1, 2], [3, 4], [4, 5], [5, 6], [6, 4]];
  const steps = traceArticulation(nodes, edges);
  expect(steps.at(-1).variables.result).toBe('4');
  expect(steps[0].variables.discovery).toBe('{}');
  expect(traceArticulation([1, 2, 3], [[1, 2], [1, 3]]).at(-1).variables.result).toBe('1');
});

it('finds bridges in disconnected graphs and excludes cycle edges', () => {
  const steps = traceBridges([1, 2, 3, 4, 5], [[1, 2], [3, 4], [4, 5], [5, 3]]);
  expect(steps.at(-1).variables.result).toBe('1–2');
  expect(JSON.parse(steps.at(-1).variables.chosen)).toEqual([[1, 2]]);
  expect(traceBridges([1, 2, 3], [[1, 2], [2, 3]]).at(-1).variables.result).toContain('2–3');
});

it('uses every Eulerian edge once and rejects disconnected edge components', () => {
  const steps = traceEulerian([1, 2, 3, 4], [[2, 3], [3, 4], [4, 2]]);
  const chosen = JSON.parse(steps.at(-1).variables.chosen);
  expect(chosen).toHaveLength(3);
  expect(new Set(chosen.map((edge) => edge.sort().join('-'))).size).toBe(3);
  expect(steps.at(-1).variables.order.split(',')).toHaveLength(4);
  expect(traceEulerian([1], []).at(-1).variables.result).toBe('1');
  expect(() => traceEulerian([1, 2, 3, 4], [[1, 2], [3, 4]])).toThrow('eulerian');
});
