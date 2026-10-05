import Sort from '../Sort';

export default class MergeSort extends Sort {
  sort(originalArray, depth = 0) {
    this.recordStep(depth === 0 ? 'start' : 'focus', originalArray, [], { depth }, 'if (originalArray.length <= 1)');
    // Call visiting callback.
    this.callbacks.visitingCallback(null);

    // If array is empty or consists of one element then return this array since it is sorted.
    if (originalArray.length <= 1) {
      this.recordStep(depth === 0 ? 'done' : 'base', originalArray, [], { depth, sortedCount: originalArray.length }, 'return originalArray;');
      return originalArray;
    }

    // Split array on two halves.
    const middleIndex = Math.floor(originalArray.length / 2);
    const leftArray = originalArray.slice(0, middleIndex);
    const rightArray = originalArray.slice(middleIndex, originalArray.length);
    this.recordStep('split', originalArray, [], { depth, middleIndex }, 'const leftArray =');

    // Sort two halves of split array
    const leftSortedArray = this.sort(leftArray, depth + 1);
    const rightSortedArray = this.sort(rightArray, depth + 1);

    // Merge two sorted arrays into one.
    const mergedArray = this.mergeSortedArrays(leftSortedArray, rightSortedArray, depth);
    this.recordStep(depth === 0 ? 'done' : 'merged', mergedArray, [], { depth, sortedCount: mergedArray.length }, 'return mergedArray;');
    return mergedArray;
  }

  mergeSortedArrays(leftArray, rightArray, depth = 0) {
    const sortedArray = [];

    // Use array pointers to exclude old elements after they have been added to the sorted array.
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
      let minElement = null;

      this.recordStep('compare', () => [...sortedArray, ...leftArray.slice(leftIndex), ...rightArray.slice(rightIndex)], [sortedArray.length, sortedArray.length + leftArray.length - leftIndex], {
        depth, leftIndex, rightIndex, sortedCount: sortedArray.length,
      }, 'if (this.comparator.lessThanOrEqual');

      // Find the minimum element between the left and right array.
      if (this.comparator.lessThanOrEqual(leftArray[leftIndex], rightArray[rightIndex])) {
        minElement = leftArray[leftIndex];
        // Increment index pointer to the right
        leftIndex += 1;
      } else {
        minElement = rightArray[rightIndex];
        // Increment index pointer to the right
        rightIndex += 1;
      }

      // Add the minimum element to the sorted array.
      sortedArray.push(minElement);
      this.recordStep('take', () => [...sortedArray, ...leftArray.slice(leftIndex), ...rightArray.slice(rightIndex)], [sortedArray.length - 1], {
        depth, leftIndex, rightIndex, sortedCount: sortedArray.length,
      }, 'sortedArray.push(minElement);');

      // Call visiting callback.
      this.callbacks.visitingCallback(minElement);
    }

    // There will be elements remaining from either the left OR the right
    // Concatenate the remaining elements into the sorted array
    return sortedArray
      .concat(leftArray.slice(leftIndex))
      .concat(rightArray.slice(rightIndex));
  }
}
