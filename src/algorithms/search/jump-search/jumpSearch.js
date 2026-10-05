import recordStep from '../../../utils/trace/recordStep';
import Comparator from '../../../utils/comparator/Comparator';

/**
 * Jump (block) search implementation.
 *
 * @param {*[]} sortedArray
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @return {number}
 */
export default function jumpSearch(sortedArray, seekElement, comparatorCallback, stepCallback) {
  const comparator = new Comparator(comparatorCallback);
  const arraySize = sortedArray.length;
  recordStep(
    stepCallback,
    'start',
    sortedArray,
    [],
    { target: seekElement, matches: '' },
    'const arraySize = sortedArray.length;',
  );

  if (!arraySize) {
    // We can't find anything in empty array.
    recordStep(
      stepCallback,
      'done',
      sortedArray,
      [],
      { target: seekElement, matches: '' },
      'return -1; // empty',
    );
    return -1; // empty
  }

  // Calculate optimal jump size.
  // Total number of comparisons in the worst case will be ((arraySize/jumpSize) + jumpSize - 1).
  // The value of the function ((arraySize/jumpSize) + jumpSize - 1) will be minimum
  // when jumpSize = √array.length.
  const jumpSize = Math.floor(Math.sqrt(arraySize));

  // Find the block where the seekElement belong to.
  let blockStart = 0;
  let blockEnd = jumpSize;
  recordStep(
    stepCallback,
    'block',
    sortedArray,
    [Math.min(blockEnd, arraySize) - 1],
    {
      low: blockStart,
      high: Math.min(blockEnd, arraySize) - 1,
      jumpSize,
      target: seekElement,
      matches: '',
    },
    'while (comparator.greaterThan',
  );
  while (comparator.greaterThan(seekElement, sortedArray[Math.min(blockEnd, arraySize) - 1])) {
    // Jump to the next block.
    blockStart = blockEnd;
    blockEnd += jumpSize;
    recordStep(
      stepCallback,
      'jump',
      sortedArray,
      [],
      {
        low: blockStart,
        high: Math.min(blockEnd, arraySize) - 1,
        jumpSize,
        target: seekElement,
        matches: '',
      },
      'blockEnd += jumpSize;',
    );

    // If our next block is out of array then we couldn't found the element.
    if (blockStart > arraySize) {
      recordStep(
        stepCallback,
        'done',
        sortedArray,
        [],
        { target: seekElement, matches: '' },
        'return -1; // outside',
      );
      return -1; // outside
    }
    recordStep(
      stepCallback,
      'block',
      sortedArray,
      [Math.min(blockEnd, arraySize) - 1],
      {
        low: blockStart,
        high: Math.min(blockEnd, arraySize) - 1,
        jumpSize,
        target: seekElement,
        matches: '',
      },
      'while (comparator.greaterThan',
    );
  }

  // Do linear search for seekElement in subarray starting from blockStart.
  let currentIndex = blockStart;
  while (currentIndex < Math.min(blockEnd, arraySize)) {
    recordStep(
      stepCallback,
      'compare',
      sortedArray,
      [currentIndex],
      {
        low: blockStart,
        high: Math.min(blockEnd, arraySize) - 1,
        jumpSize,
        index: currentIndex,
        target: seekElement,
        matches: '',
      },
      'if (comparator.equal',
    );
    if (comparator.equal(sortedArray[currentIndex], seekElement)) {
      recordStep(
        stepCallback,
        'done',
        sortedArray,
        [currentIndex],
        { target: seekElement, matches: String(currentIndex) },
        'return currentIndex;',
      );
      return currentIndex;
    }

    currentIndex += 1;
  }

  recordStep(
    stepCallback,
    'done',
    sortedArray,
    [],
    { target: seekElement, matches: '' },
    'return -1; // miss',
  );
  return -1; // miss
}
