import Sort from '../Sort';

export default class SelectionSort extends Sort {
  sort(originalArray) {
    // Clone original array to prevent its modification.
    const array = [...originalArray];
    this.recordStep('start', array, [], { sortedCount: 0 }, 'const array =');

    for (let i = 0; i < array.length - 1; i += 1) {
      let minIndex = i;

      // Call visiting callback.
      this.callbacks.visitingCallback(array[i]);

      // Find minimum element in the rest of array.
      for (let j = i + 1; j < array.length; j += 1) {
        // Call visiting callback.
        this.callbacks.visitingCallback(array[j]);

        this.recordStep('compare', array, [j, minIndex], {
          i, j, minIndex, sortedCount: i,
        }, 'if (this.comparator.lessThan');
        if (this.comparator.lessThan(array[j], array[minIndex])) {
          minIndex = j;
          this.recordStep('minimum', array, [minIndex], {
            i, j, minIndex, sortedCount: i,
          }, 'minIndex = j;');
        }
      }

      // If new minimum element has been found then swap it with current i-th element.
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        this.recordStep('swap', array, [i, minIndex], { i, minIndex, sortedCount: i }, '[array[i], array[minIndex]] =');
      }
      this.recordStep('pass', array, [], { i, sortedCount: i + 1 }, 'if (minIndex !== i)');
    }

    this.recordStep('done', array, [], { sortedCount: array.length }, 'return array;');
    return array;
  }
}
