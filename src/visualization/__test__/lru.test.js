import { traceLru } from '../structures';

it('promotes reads, evicts by recency, updates keys and preserves snapshots', () => {
  const steps = traceLru([1, 2], 2, 'get 1, set 3 30, get 2, set 1 10');
  expect(steps.find((step) => step.type === 'get').variables.entries).toBe('[["2",2],["1",1]]');
  expect(steps.find((step) => step.variables.evicted !== undefined).variables.evicted).toBe('2');
  expect(steps.filter((step) => step.type === 'get').at(-1).variables.result).toBe('undefined');
  expect(JSON.parse(steps.at(-1).variables.entries)).toEqual([['3', 30], ['1', 10]]);
  expect(JSON.parse(steps[0].variables.entries)).toEqual([]);
  expect(() => traceLru([], 0)).toThrow('cache-capacity');
});
