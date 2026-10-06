import dpLongestIncreasingSubsequence from '../algorithms/sets/longest-increasing-subsequence/dpLongestIncreasingSubsequence';
import combineWithoutRepetitions from '../algorithms/sets/combinations/combineWithoutRepetitions';
import permutateWithoutRepetitions from '../algorithms/sets/permutations/permutateWithoutRepetitions';
import bwPowerSet from '../algorithms/sets/power-set/bwPowerSet';
import fisherYates from '../algorithms/sets/fisher-yates/fisherYates';
import cartesianProduct from '../algorithms/sets/cartesian-product/cartesianProduct';

export default function traceCartesian(inputs) {
  const sets = inputs.map((input) => [...new Set(input.trim().split(/[\s,]+/).filter(Boolean))]);
  if (sets.length !== 2 || sets.some((set) => set.length > 6
    || set.some((value) => Array.from(value).length > 12))) throw new Error('cartesian-input');
  const steps = [];
  cartesianProduct(...sets, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'cartesian', inputs: JSON.stringify(sets),
    },
  }));
  return steps;
}

export function traceShuffle(values, random = Math.random) {
  if (values.length > 32 || !values.every(Number.isFinite)) throw new Error('limit');
  const steps = [];
  fisherYates(values.map((value, id) => ({ value, id })), (step) => steps.push({
    ...step,
    variables: {
      ...step.variables,
      mode: 'shuffle',
      result: step.type === 'done' ? step.array.map((item) => item.value).join(', ') || '∅' : '—',
    },
  }), random);
  return steps;
}

export function tracePowerSet(values) {
  const items = [...new Set(values)];
  if (items.length > 6 || !items.every(Number.isFinite)) throw new Error('powerset-input');
  const steps = [];
  bwPowerSet(items, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'power-set', inputs: JSON.stringify([items]),
    },
  }));
  return steps;
}

export function tracePermutations(values) {
  const items = [...new Set(values)];
  if (items.length > 5 || !items.every(Number.isFinite)) throw new Error('permutation-input');
  const steps = [];
  const groups = permutateWithoutRepetitions(items, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'permutation', originalSize: items.length,
    },
  }));
  steps[0].type = 'start';
  const last = steps[steps.length - 1];
  steps.push({
    ...last,
    type: 'done',
    variables: {
      ...last.variables, result: groups.length,
    },
  });
  return steps;
}

export function traceCombinations(values, k) {
  const items = [...new Set(values)];
  if (items.length > 6 || !items.every(Number.isFinite) || !Number.isInteger(k)
    || k < 0 || k > 6) throw new Error('combination-input');
  const steps = [];
  const groups = combineWithoutRepetitions(items, k, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'combination', originalSize: items.length, originalK: k,
    },
  }));
  steps[0].type = 'start';
  const last = steps[steps.length - 1];
  steps.push({ ...last, type: 'done', variables: { ...last.variables, result: groups.length } });
  return steps;
}

export function traceLis(values) {
  if (values.length > 16 || !values.every(Number.isFinite)) throw new Error('lis-input');
  const steps = [];
  dpLongestIncreasingSubsequence(values, (step) => steps.push({
    ...step,
    array: step.array.map((value, id) => ({ value, id })),
    variables: { ...step.variables, mode: 'lis' },
  }));
  return steps;
}
