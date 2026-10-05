import Sort from '../Sort';

export default class CountingSort extends Sort {
  /**
   * @param {number[]} originalArray
   * @param {number} [smallestElement]
   * @param {number} [biggestElement]
   */
  sort(originalArray, smallestElement = undefined, biggestElement = undefined) {
    this.recordStep(
      'start',
      originalArray,
      [],
      {},
      'let detectedSmallestElement = smallestElement || 0;',
    );
    // Init biggest and smallest elements in array in order to build number bucket array later.
    let detectedSmallestElement = smallestElement || 0;
    let detectedBiggestElement = biggestElement || 0;

    if (smallestElement === undefined || biggestElement === undefined) {
      originalArray.forEach((element) => {
        // Visit element.
        this.callbacks.visitingCallback(element);

        // Detect biggest element.
        if (this.comparator.greaterThan(element, detectedBiggestElement)) {
          detectedBiggestElement = element;
        }

        // Detect smallest element.
        if (this.comparator.lessThan(element, detectedSmallestElement)) {
          detectedSmallestElement = element;
        }
      });
    }

    // Init buckets array.
    // This array will hold frequency of each number from originalArray.
    const buckets = Array(detectedBiggestElement - detectedSmallestElement + 1).fill(0);

    this.recordStep(
      'buckets',
      originalArray,
      [],
      () => ({ minimum: detectedSmallestElement, buckets: JSON.stringify(buckets) }),
      'const buckets = Array(',
    );
    originalArray.forEach((element, index) => {
      // Visit element.
      this.callbacks.visitingCallback(element);

      buckets[element - detectedSmallestElement] += 1;
      this.recordStep(
        'count',
        originalArray,
        [index],
        () => ({
          minimum: detectedSmallestElement,
          bucket: element - detectedSmallestElement,
          buckets: JSON.stringify(buckets),
        }),
        'buckets[element - detectedSmallestElement] += 1;',
      );
    });

    // Add previous frequencies to the current one for each number in bucket
    // to detect how many numbers less then current one should be standing to
    // the left of current one.
    for (let bucketIndex = 1; bucketIndex < buckets.length; bucketIndex += 1) {
      buckets[bucketIndex] += buckets[bucketIndex - 1];
      this.recordStep(
        'prefix',
        originalArray,
        [],
        () => ({
          minimum: detectedSmallestElement,
          bucket: bucketIndex,
          buckets: JSON.stringify(buckets),
        }),
        'buckets[bucketIndex] += buckets[bucketIndex - 1];',
      );
    }

    // Now let's shift frequencies to the right so that they show correct numbers.
    // I.e. if we won't shift right than the value of buckets[5] will display how many
    // elements less than 5 should be placed to the left of 5 in sorted array
    // INCLUDING 5th. After shifting though this number will not include 5th anymore.
    buckets.pop();
    buckets.unshift(0);

    // Now let's assemble sorted array.
    const sortedArray = Array(originalArray.length).fill(null);
    this.recordStep(
      'offset',
      originalArray,
      [],
      () => ({
        minimum: detectedSmallestElement,
        buckets: JSON.stringify(buckets),
        output: JSON.stringify(sortedArray),
      }),
      'buckets.unshift(0);',
    );
    for (let elementIndex = 0; elementIndex < originalArray.length; elementIndex += 1) {
      // Get the element that we want to put into correct sorted position.
      const element = originalArray[elementIndex];

      // Visit element.
      this.callbacks.visitingCallback(element);

      // Get correct position of this element in sorted array.
      const elementSortedPosition = buckets[element - detectedSmallestElement];

      // Put element into correct position in sorted array.
      sortedArray[elementSortedPosition] = element;
      this.recordStep(
        'place',
        originalArray,
        [elementIndex],
        () => ({
          minimum: detectedSmallestElement,
          bucket: element - detectedSmallestElement,
          position: elementSortedPosition,
          buckets: JSON.stringify(buckets),
          output: JSON.stringify(sortedArray),
        }),
        'sortedArray[elementSortedPosition] = element;',
      );

      // Increase position of current element in the bucket for future correct placements.
      buckets[element - detectedSmallestElement] += 1;
    }

    // Return sorted array.
    this.recordStep(
      'done',
      sortedArray,
      [],
      { sortedCount: sortedArray.length },
      'return sortedArray;',
    );
    return sortedArray;
  }
}
