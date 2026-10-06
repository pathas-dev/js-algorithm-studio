import traceCartesian, { traceShuffle, tracePowerSet } from '../collections';

it('creates unique ordered pairs and handles an empty set', () => {
  const steps = traceCartesian(['1, 2, 1', 'a b']);
  expect(JSON.parse(steps.at(-1).variables.groups))
    .toEqual([['1', 'a'], ['1', 'b'], ['2', 'a'], ['2', 'b']]);
  expect(JSON.parse(steps[1].variables.groups)).toEqual([['1', 'a']]);
  expect(traceCartesian(['', 'a']).at(-1).variables.count).toBe(0);
  expect(() => traceCartesian(['1 2 3 4 5 6 7', 'a'])).toThrow('cartesian-input');
});

it('shuffles stable identities in bounded ranges without changing the input', () => {
  const input = [1, 2, 3, 4];
  const steps = traceShuffle(input, () => 0);
  expect(steps.at(-1).array.map((item) => item.value)).toEqual([2, 3, 4, 1]);
  expect(input).toEqual([1, 2, 3, 4]);
  expect(steps[0].array.map((item) => item.value)).toEqual(input);
  expect(steps.filter((step) => step.type === 'select').map((step) => step.variables.i))
    .toEqual([3, 2, 1]);
  expect(traceShuffle([2, 2], () => 0).at(-1).array.map((item) => item.id)).toEqual([1, 0]);
  expect(traceShuffle([]).at(-1).variables.result).toBe('∅');
});

it('enumerates each subset once including the empty set', () => {
  const steps = tracePowerSet([1, 2, 2, 3]);
  const subsets = JSON.parse(steps.at(-1).variables.groups);
  expect(subsets).toHaveLength(8);
  expect(subsets[0]).toEqual([]);
  expect(subsets.at(-1)).toEqual([1, 2, 3]);
  expect(new Set(subsets.map(JSON.stringify)).size).toBe(8);
  expect(tracePowerSet([]).at(-1).variables.count).toBe(1);
  expect(() => tracePowerSet([1, 2, 3, 4, 5, 6, 7])).toThrow('powerset-input');
});
