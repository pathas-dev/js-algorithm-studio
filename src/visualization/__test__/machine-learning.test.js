import traceKnn from '../machine-learning';

it('classifies from actual sorted neighbors and handles ties deterministically', () => {
  const steps = traceKnn(['[[0,0,0],[1,1,1],[0,2,1]]', '[0,1,3]']);
  expect(steps.at(-1).variables.result).toBe(1);
  expect(JSON.parse(steps.at(-1).variables.nearest).map((point) => point.index)).toEqual([0, 1, 2]);
  expect(steps.filter((step) => step.type === 'vote')).toHaveLength(3);
  expect(traceKnn(['[[0,0,0],[1,1,1]]', '[0,0,1]']).at(-1).variables.result).toBe(0);
  expect(() => traceKnn(['[[0,0,0]]', '[0,0,2]'])).toThrow('knn-input');
  expect(() => traceKnn(['[[0,0,"x"]]', '[0,0,1]'])).toThrow('knn-input');
});
