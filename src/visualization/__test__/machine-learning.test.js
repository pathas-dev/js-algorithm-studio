import traceKnn, { traceKmeans } from '../machine-learning';

it('classifies from actual sorted neighbors and handles ties deterministically', () => {
  const steps = traceKnn(['[[0,0,0],[1,1,1],[0,2,1]]', '[0,1,3]']);
  expect(steps.at(-1).variables.result).toBe(1);
  expect(JSON.parse(steps.at(-1).variables.nearest).map((point) => point.index)).toEqual([0, 1, 2]);
  expect(steps.filter((step) => step.type === 'vote')).toHaveLength(3);
  expect(traceKnn(['[[0,0,0],[1,1,1]]', '[0,0,1]']).at(-1).variables.result).toBe(0);
  expect(() => traceKnn(['[[0,0,0]]', '[0,0,2]'])).toThrow('knn-input');
  expect(() => traceKnn(['[[0,0,"x"]]', '[0,0,1]'])).toThrow('knn-input');
});

it('moves k-means centers and preserves empty centers without NaN', () => {
  const steps = traceKmeans(['[[0,0],[0,1],[10,10]]', '2']);
  expect(steps.at(-1).variables.result).toBe('0, 0, 1');
  expect(JSON.parse(steps.at(-1).variables.centers)).toEqual([[0, 0.5], [10, 10]]);
  expect(steps.some((step) => step.type === 'centroid')).toBe(true);
  const duplicates = traceKmeans(['[[1,1],[1,1],[2,2]]', '2']);
  expect(duplicates.some((step) => step.type === 'empty-cluster')).toBe(true);
  expect(JSON.parse(duplicates.at(-1).variables.centers).flat().every(Number.isFinite)).toBe(true);
  expect(() => traceKmeans(['[[0,0]]', '2'])).toThrow('kmeans-input');
});
