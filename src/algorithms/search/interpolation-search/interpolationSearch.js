import recordStep from '../../../utils/trace/recordStep';

/**
 * Interpolation search implementation.
 *
 * @param {*[]} sortedArray - sorted array with uniformly distributed values
 * @param {*} seekElement
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @return {number}
 */
export default function interpolationSearch(sortedArray, seekElement, stepCallback) {
  let leftIndex = 0;
  let rightIndex = sortedArray.length - 1;
  recordStep(
    stepCallback,
    'start',
    sortedArray,
    [],
    {
      low: leftIndex, high: rightIndex, target: seekElement, matches: '',
    },
    'let leftIndex = 0;',
  );

  while (leftIndex <= rightIndex) {
    const rangeDelta = sortedArray[rightIndex] - sortedArray[leftIndex];
    const indexDelta = rightIndex - leftIndex;
    const valueDelta = seekElement - sortedArray[leftIndex];

    // Reject targets outside the current value range before calculating a probe index.
    recordStep(
      stepCallback,
      'range',
      sortedArray,
      [leftIndex, rightIndex],
      {
        low: leftIndex,
        high: rightIndex,
        rangeDelta,
        valueDelta,
        indexDelta,
        target: seekElement,
        matches: '',
      },
      'const rangeDelta =',
    );
    if (valueDelta < 0 || seekElement > sortedArray[rightIndex]) {
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

    // If range delta is zero then subarray contains all the same numbers
    // and thus there is nothing to search for unless this range is all
    // consists of seek number.
    if (!rangeDelta) {
      // By doing this we're also avoiding division by zero while
      // calculating the middleIndex later.
      recordStep(
        stepCallback,
        'done',
        sortedArray,
        sortedArray[leftIndex] === seekElement ? [leftIndex] : [],
        { target: seekElement, matches: sortedArray[leftIndex] === seekElement ? String(leftIndex) : '' },
        'return sortedArray[leftIndex] === seekElement ? leftIndex : -1;',
      );
      return sortedArray[leftIndex] === seekElement ? leftIndex : -1;
    }

    // Do interpolation of the middle index.
    const middleIndex = leftIndex + Math.floor((valueDelta * indexDelta) / rangeDelta);

    recordStep(
      stepCallback,
      'probe',
      sortedArray,
      [middleIndex],
      {
        low: leftIndex,
        high: rightIndex,
        rangeDelta,
        valueDelta,
        indexDelta,
        middleIndex,
        target: seekElement,
        matches: '',
      },
      'const middleIndex =',
    );

    // If we've found the element just return its position.
    if (sortedArray[middleIndex] === seekElement) {
      recordStep(
        stepCallback,
        'done',
        sortedArray,
        [middleIndex],
        { target: seekElement, matches: String(middleIndex) },
        'return middleIndex;',
      );
      return middleIndex;
    }

    // Decide which half to choose for seeking next: left or right one.
    if (sortedArray[middleIndex] < seekElement) {
      // Go to the right half of the array.
      leftIndex = middleIndex + 1;
      recordStep(
        stepCallback,
        'right',
        sortedArray,
        [],
        {
          low: leftIndex, high: rightIndex, target: seekElement, matches: '',
        },
        'leftIndex = middleIndex + 1;',
      );
    } else {
      // Go to the left half of the array.
      rightIndex = middleIndex - 1;
      recordStep(
        stepCallback,
        'left',
        sortedArray,
        [],
        {
          low: leftIndex, high: rightIndex, target: seekElement, matches: '',
        },
        'rightIndex = middleIndex - 1;',
      );
    }
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
