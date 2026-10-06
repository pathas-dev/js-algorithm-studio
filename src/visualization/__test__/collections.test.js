import traceCartesian, {
  traceShuffle, tracePowerSet, tracePermutations, traceCombinations, traceLis, traceSupersequence,
} from '../collections';

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

it('inserts all permutation positions and terminates the empty recursion', () => {
  const steps = tracePermutations([1, 2, 3]);
  const groups = JSON.parse(steps.at(-1).variables.groups);
  expect(groups).toHaveLength(6);
  expect(new Set(groups.map(JSON.stringify)).size).toBe(6);
  expect(groups).toContainEqual([3, 2, 1]);
  expect(tracePermutations([]).at(-1).variables.count).toBe(1);
  expect(tracePermutations([2, 2]).at(-1).variables.count).toBe(1);
  expect(() => tracePermutations([1, 2, 3, 4, 5, 6])).toThrow('permutation-input');
});

it('chooses unordered combinations without replacement including k=0 and k>n', () => {
  const groups = JSON.parse(traceCombinations([1, 2, 3, 4], 2).at(-1).variables.groups);
  expect(groups).toEqual([[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]);
  expect(traceCombinations([], 0).at(-1).variables.result).toBe(1);
  expect(traceCombinations([1], 2).at(-1).variables.result).toBe(0);
  expect(traceCombinations([1, 1, 2], 1).at(-1).variables.result).toBe(2);
  expect(() => traceCombinations([1], -1)).toThrow('combination-input');
});

it('computes strict LIS lengths while preserving duplicate input values', () => {
  const steps = traceLis([3, 1, 2, 5, 4]);
  expect(steps.at(-1).variables.result).toBe(3);
  expect(JSON.parse(steps.at(-1).variables.lengths)).toEqual([1, 1, 2, 3, 3]);
  expect(traceLis([2, 2, 2]).at(-1).variables.result).toBe(1);
  expect(traceLis([3, 2, 1]).at(-1).variables.result).toBe(1);
  expect(traceLis([]).at(-1).variables.result).toBe(0);
  expect(JSON.parse(steps[0].variables.lengths)).toEqual([1, 1, 1, 1, 1]);
});

it('merges around the LCS preserving repeated and Unicode characters', () => {
  expect(traceSupersequence(['GEEK', 'EKE']).at(-1).variables.result).toBe('GEKEK');
  expect(traceSupersequence(['abc', 'def']).at(-1).variables.result).toBe('abcdef');
  expect(traceSupersequence(['', 'abc']).at(-1).variables.result).toBe('abc');
  expect(traceSupersequence(['', '']).at(-1).variables.count).toBe(0);
  expect(traceSupersequence(['😀a', '😀b']).at(-1).variables.count).toBe(3);
  expect(traceSupersequence(['aaa', 'aa']).at(-1).variables.result).toBe('aaa');
});
