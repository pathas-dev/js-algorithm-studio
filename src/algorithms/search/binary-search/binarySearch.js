import recordStep from '../../../utils/trace/recordStep';
import Comparator from '../../../utils/comparator/Comparator';

/**
 * Binary search implementation.
 *
 * @param {*[]} sortedArray
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @return {number}
 */

export default function binarySearch(sortedArray, seekElement, comparatorCallback, stepCallback) {
  // Let's create comparator from the comparatorCallback function.
  // Comparator object will give us common comparison methods like equal() and lessThan().
  const comparator = new Comparator(comparatorCallback);

  // These two indices will contain current array (sub-array) boundaries.
  let startIndex = 0;
  let endIndex = sortedArray.length - 1;
  recordStep(stepCallback, 'start', sortedArray, [], {
    low: startIndex, high: endIndex, target: seekElement, matches: '',
  }, 'let startIndex =');

  // Let's continue to split array until boundaries are collapsed
  // and there is nothing to split anymore.
  while (startIndex <= endIndex) {
    // Let's calculate the index of the middle element.
    const middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);

    recordStep(stepCallback, 'compare', sortedArray, [middleIndex], {
      low: startIndex, high: endIndex, middleIndex, target: seekElement, matches: '',
    }, 'if (comparator.equal');

    // If we've found the element just return its position.
    if (comparator.equal(sortedArray[middleIndex], seekElement)) {
      recordStep(stepCallback, 'done', sortedArray, [middleIndex], {
        low: startIndex,
        high: endIndex,
        middleIndex,
        target: seekElement,
        matches: String(middleIndex),
      }, 'return middleIndex;');
      return middleIndex;
    }

    // Decide which half to choose for seeking next: left or right one.
    if (comparator.lessThan(sortedArray[middleIndex], seekElement)) {
      // Go to the right half of the array.
      startIndex = middleIndex + 1;
      recordStep(stepCallback, 'right', sortedArray, [middleIndex], {
        low: startIndex, high: endIndex, middleIndex, target: seekElement, matches: '',
      }, 'startIndex = middleIndex + 1;');
    } else {
      // Go to the left half of the array.
      endIndex = middleIndex - 1;
      recordStep(stepCallback, 'left', sortedArray, [middleIndex], {
        low: startIndex, high: endIndex, middleIndex, target: seekElement, matches: '',
      }, 'endIndex = middleIndex - 1;');
    }
  }

  // Return -1 if we have not found anything.
  recordStep(stepCallback, 'done', sortedArray, [], {
    low: startIndex, high: endIndex, target: seekElement, matches: '',
  }, 'return -1;');
  return -1;
}
