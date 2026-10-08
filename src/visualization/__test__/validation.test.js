import {
  traceShuffle, traceLis, traceSupersequence, traceMaximumSubarray,
} from '../collections';
import { traceSalesman } from '../graph';
import traceSeam from '../image-processing';
import traceKnn, { traceKmeans } from '../machine-learning';
import { traceLcm, tracePowerTwo, traceMatrix } from '../math';
import { traceRotation } from '../puzzles';
import traceWeighted from '../statistics';
import { traceDeque, traceLru } from '../structures';
import traceTreeDfs, { traceListForward } from '../traversals';
import { MAX_VALUES } from '../playback';
import fibonacciNth from '../../algorithms/math/fibonacci/fibonacciNth';
import trialDivision from '../../algorithms/math/primality-test/trialDivision';
import combinationSum from '../../algorithms/sets/combination-sum/combinationSum';
import combineWithoutRepetitions from '../../algorithms/sets/combinations/combineWithoutRepetitions';
import hanoiTower from '../../algorithms/uncategorized/hanoi-tower/hanoiTower';

it.each([
  [traceShuffle, [[NaN]], 'limit'],
  [traceShuffle, [Array(33).fill(0)], 'limit'],
  [traceLis, [[NaN]], 'lis-input'],
  [traceLis, [Array(17).fill(0)], 'lis-input'],
  [traceSupersequence, [['a']], 'scs-input'],
  [traceSupersequence, [['a'.repeat(13), 'b']], 'scs-input'],
  [traceMaximumSubarray, [[NaN]], 'limit'],
  [traceMaximumSubarray, [Array(33).fill(0)], 'limit'],
  [traceSalesman, [[1, 2, 3, 4, 5, 6, 7, 8], []], 'graph-search-limit'],
  [traceLcm, [[1]], 'integer-pair'],
  [traceLcm, [[1, 1.5]], 'integer-pair'],
  [tracePowerTwo, [[1, 2]], 'integer-single'],
  [tracePowerTwo, [[1.5]], 'integer-single'],
  [traceDeque, [Array(MAX_VALUES + 1).fill(0)], 'limit'],
  [traceLru, [Array(MAX_VALUES + 1).fill(0)], 'limit'],
  [traceTreeDfs, [[NaN]], 'traversal-tree-input'],
  [traceTreeDfs, [Array(16).fill(0)], 'traversal-tree-input'],
  [traceListForward, [[NaN]], 'traversal-list-input'],
  [traceListForward, [Array(13).fill(0)], 'traversal-list-input'],
])('rejects invalid input in %p (%p)', (trace, args, error) => {
  expect(() => trace(...args)).toThrow(error);
});

it.each([
  [traceSeam, 'seam-input'],
  [traceKnn, 'knn-input'],
  [traceKmeans, 'kmeans-input'],
  [traceMatrix, 'matrix-input'],
  [traceRotation, 'rotation-input'],
  [traceWeighted, 'weighted-input'],
])('rejects malformed JSON in %p', (trace, error) => {
  expect(() => trace(['{', '1'])).toThrow(error);
});

it.each([-1, 1.5])('rejects invalid Fibonacci and Hanoi counts: %p', (count) => {
  expect(() => fibonacciNth(count)).toThrow('fibonacci-input');
  expect(() => hanoiTower({ numberOfDiscs: count })).toThrow('Disc count');
});

it('does not move any discs for an empty Hanoi tower', () => {
  const moveCallback = jest.fn();
  hanoiTower({ numberOfDiscs: 0, moveCallback });
  expect(moveCallback).not.toHaveBeenCalled();
});

it.each([
  [[0], 1], [[-1], 1], [[1.5], 1], [[1], -1], [[1], 1.5],
])('rejects nonterminating combination sum inputs: %p, %p', (candidates, target) => {
  expect(() => combinationSum(candidates, target)).toThrow('Candidates must be positive integers');
});

it.each([1.5, 4])('records the nonprime result for %p', (number) => {
  const callback = jest.fn();
  expect(trialDivision(number, callback)).toBe(false);
  expect(callback.mock.calls.at(-1)[0].variables.result).toBe(false);
});

it('records an empty result for a negative combination length', () => {
  const callback = jest.fn();
  expect(combineWithoutRepetitions([1], -1, callback)).toEqual([]);
  expect(callback.mock.calls.at(-1)[0]).toMatchObject({
    type: 'base', variables: { groups: '[]', count: 0 },
  });
});
