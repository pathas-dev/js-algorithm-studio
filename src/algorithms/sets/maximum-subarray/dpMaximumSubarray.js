import recordStep from '../../../utils/trace/recordStep';

/**
 * Dynamic Programming solution.
 * Complexity: O(n)
 *
 * @param {Number[]} inputArray
 * @return {Number[]}
 */
export default function dpMaximumSubarray(inputArray, stepCallback) {
  // We iterate through the inputArray once, using a greedy approach to keep track of the maximum
  // sum we've seen so far and the current sum.
  //
  // The currentSum variable gets reset to 0 every time it drops below 0.
  //
  // The maxSum variable is set to -Infinity so that if all numbers are negative, the highest
  // negative number will constitute the maximum subarray.

  let maxSum = -Infinity;
  let currentSum = 0;

  // We need to keep track of the starting and ending indices that contributed to our maxSum
  // so that we can return the actual subarray. From the beginning let's assume that whole array
  // is contributing to maxSum.
  let maxStartIndex = 0;
  let maxEndIndex = inputArray.length - 1;
  let currentStartIndex = 0;

  const state = (index = -1, result = '—') => ({
    index,
    result,
    currentSum,
    maxSum: Number.isFinite(maxSum) ? maxSum : '−∞',
    currentStartIndex,
    maxStartIndex,
    maxEndIndex,
    matches: Number.isFinite(maxSum)
      ? Array.from({ length: maxEndIndex - maxStartIndex + 1 }, (_, i) => maxStartIndex + i).join(',') : '',
  });
  recordStep(stepCallback, 'start', inputArray, [], () => state(), 'let maxSum = -Infinity;');

  inputArray.forEach((currentNumber, currentIndex) => {
    currentSum += currentNumber;
    recordStep(
      stepCallback,
      'add',
      inputArray,
      [currentIndex],
      () => state(currentIndex),
      'currentSum += currentNumber;',
    );

    // Update maxSum and the corresponding indices if we have found a new max.
    if (maxSum < currentSum) {
      maxSum = currentSum;
      maxStartIndex = currentStartIndex;
      maxEndIndex = currentIndex;
      recordStep(
        stepCallback,
        'best',
        inputArray,
        [currentIndex],
        () => state(currentIndex),
        'maxSum = currentSum;',
      );
    }

    // Reset currentSum and currentStartIndex if currentSum drops below 0.
    if (currentSum < 0) {
      currentSum = 0;
      currentStartIndex = currentIndex + 1;
      recordStep(
        stepCallback,
        'reset',
        inputArray,
        [currentIndex],
        () => state(currentIndex),
        'currentStartIndex = currentIndex + 1;',
      );
    }
  });

  recordStep(
    stepCallback,
    'done',
    inputArray,
    [],
    () => state(-1, inputArray.slice(maxStartIndex, maxEndIndex + 1).join(', ') || '∅'),
    'return inputArray.slice(maxStartIndex, maxEndIndex + 1);',
  );
  return inputArray.slice(maxStartIndex, maxEndIndex + 1);
}
