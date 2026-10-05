import Sort from '../Sort';

export default class InsertionSort extends Sort {
  sort(originalArray) {
    const array = [...originalArray];
    this.recordStep('start', array, [], {}, 'const array =');

    // Go through all array elements...
    for (let i = 1; i < array.length; i += 1) {
      let currentIndex = i;

      // Call visiting callback.
      this.callbacks.visitingCallback(array[i]);

      this.recordStep('compare', array, [currentIndex - 1, currentIndex], { i, currentIndex }, 'while (');

      // Check if previous element is greater than current element.
      // If so, swap the two elements.
      while (
        array[currentIndex - 1] !== undefined
        && this.comparator.lessThan(array[currentIndex], array[currentIndex - 1])
      ) {
        // Call visiting callback.
        this.callbacks.visitingCallback(array[currentIndex - 1]);

        // Swap the elements.
        [
          array[currentIndex - 1],
          array[currentIndex],
        ] = [
          array[currentIndex],
          array[currentIndex - 1],
        ];

        this.recordStep('swap', array, [currentIndex - 1, currentIndex], { i, currentIndex }, 'array[currentIndex - 1],');

        // Shift current index left.
        currentIndex -= 1;
        this.recordStep('compare', array, [currentIndex - 1, currentIndex].filter((index) => index >= 0), { i, currentIndex }, 'while (');
      }
      this.recordStep('pass', array, [], { i, sortedCount: i + 1 }, 'for (let i =');
    }

    this.recordStep('done', array, [], { sortedCount: array.length }, 'return array;');
    return array;
  }
}
