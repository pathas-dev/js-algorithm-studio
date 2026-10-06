import recordStep from '../../../utils/trace/recordStep';

/**
 * Dynamic programming approach to find longest increasing subsequence.
 * Complexity: O(n * n)
 *
 * @param {number[]} sequence
 * @return {number}
 */
export default function dpLongestIncreasingSubsequence(sequence, stepCallback) {
  // Create array with longest increasing substrings length and
  // fill it with 1-s that would mean that each element of the sequence
  // is itself a minimum increasing subsequence.
  const lengthsArray = Array(sequence.length).fill(1);

  let previousElementIndex = 0;
  let currentElementIndex = 1;

  const state = (result = '—') => ({
    previousElementIndex,
    currentElementIndex,
    result,
    lengths: JSON.stringify(lengthsArray),
  });
  recordStep(stepCallback, 'start', sequence, [], () => state(), 'const lengthsArray = Array(sequence.length).fill(1);');

  while (currentElementIndex < sequence.length) {
    recordStep(
      stepCallback,
      'compare',
      sequence,
      [previousElementIndex, currentElementIndex],
      () => state(),
      'if (sequence[previousElementIndex] < sequence[currentElementIndex]) {',
    );
    if (sequence[previousElementIndex] < sequence[currentElementIndex]) {
      // If current element is bigger then the previous one then
      // current element is a part of increasing subsequence which
      // length is by one bigger then the length of increasing subsequence
      // for previous element.
      const newLength = lengthsArray[previousElementIndex] + 1;
      if (newLength > lengthsArray[currentElementIndex]) {
        // Increase only if previous element would give us bigger subsequence length
        // then we already have for current element.
        lengthsArray[currentElementIndex] = newLength;
        recordStep(
          stepCallback,
          'update',
          sequence,
          [previousElementIndex, currentElementIndex],
          () => state(),
          'lengthsArray[currentElementIndex] = newLength;',
        );
      }
    }

    // Move previous element index right.
    previousElementIndex += 1;

    // If previous element index equals to current element index then
    // shift current element right and reset previous element index to zero.
    if (previousElementIndex === currentElementIndex) {
      currentElementIndex += 1;
      previousElementIndex = 0;
    }
  }

  // Find the biggest element in lengthsArray.
  // This number is the biggest length of increasing subsequence.
  let longestIncreasingLength = 0;

  for (let i = 0; i < lengthsArray.length; i += 1) {
    if (lengthsArray[i] > longestIncreasingLength) {
      longestIncreasingLength = lengthsArray[i];
      recordStep(stepCallback, 'best', sequence, [i], () => ({
        ...state(), best: longestIncreasingLength,
      }), 'longestIncreasingLength = lengthsArray[i];');
    }
  }

  recordStep(stepCallback, 'done', sequence, [], () => state(longestIncreasingLength), 'return longestIncreasingLength;');
  return longestIncreasingLength;
}
