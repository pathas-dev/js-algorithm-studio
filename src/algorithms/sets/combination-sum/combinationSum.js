import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {number[]} candidates - candidate numbers we're picking from.
 * @param {number} remainingSum - remaining sum after adding candidates to currentCombination.
 * @param {number[][]} finalCombinations - resulting list of combinations.
 * @param {number[]} currentCombination - currently explored candidates.
 * @param {number} startFrom - index of the candidate to start further exploration from.
 * @param {function} [stepCallback]
 * @return {number[][]}
 */
function combinationSumRecursive(
  candidates,
  remainingSum,
  finalCombinations = [],
  currentCombination = [],
  startFrom = 0,
  stepCallback = undefined,
) {
  const state = () => ({
    remainingSum,
    selection: JSON.stringify(currentCombination),
    groups: JSON.stringify(finalCombinations),
    count: finalCombinations.length,
  });
  recordStep(stepCallback, 'enter', [], [], state, 'if (remainingSum < 0) {');
  if (remainingSum < 0) {
    recordStep(stepCallback, 'prune', [], [], state, 'if (remainingSum < 0) {');
    // By adding another candidate we've gone below zero.
    // This would mean that the last candidate was not acceptable.
    return finalCombinations;
  }

  if (remainingSum === 0) {
    // If after adding the previous candidate our remaining sum
    // became zero - we need to save the current combination since it is one
    // of the answers we're looking for.
    finalCombinations.push(currentCombination.slice());
    recordStep(stepCallback, 'solution', [], [], state, 'finalCombinations.push(currentCombination.slice());');

    return finalCombinations;
  }

  // If we haven't reached zero yet let's continue to add all
  // possible candidates that are left.
  for (let candidateIndex = startFrom; candidateIndex < candidates.length; candidateIndex += 1) {
    const currentCandidate = candidates[candidateIndex];

    // Let's try to add another candidate.
    currentCombination.push(currentCandidate);

    // Explore further option with current candidate being added.
    combinationSumRecursive(
      candidates,
      remainingSum - currentCandidate,
      finalCombinations,
      currentCombination,
      candidateIndex,
      stepCallback,
    );

    // BACKTRACKING.
    // Let's get back, exclude current candidate and try another ones later.
    currentCombination.pop();
    recordStep(stepCallback, 'backtrack', [], [], state, 'currentCombination.pop();');
  }

  return finalCombinations;
}

/**
 * Backtracking algorithm of finding all possible combination for specific sum.
 *
 * @param {number[]} candidates
 * @param {number} target
 * @param {function} [stepCallback]
 * @return {number[][]}
 */
export default function combinationSum(candidates, target, stepCallback) {
  if (!Number.isInteger(target) || target < 0
    || !candidates.every((value) => Number.isInteger(value) && value > 0)) {
    throw new Error('Candidates must be positive integers and target a nonnegative integer');
  }
  return combinationSumRecursive(candidates, target, [], [], 0, stepCallback);
}
