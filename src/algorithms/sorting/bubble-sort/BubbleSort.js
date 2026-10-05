import Sort from '../Sort';

export default class BubbleSort extends Sort {
  sort(originalArray) {
    // Flag that holds info about whether the swap has occur or not.
    let swapped = false;
    // Clone original array to prevent its modification.
    const array = [...originalArray];
    this.recordStep('start', array, [], { sortedFrom: array.length }, 'const array =');

    for (let i = 1; i < array.length; i += 1) {
      swapped = false;

      // Call visiting callback.
      this.callbacks.visitingCallback(array[i]);

      for (let j = 0; j < array.length - i; j += 1) {
        // Call visiting callback.
        this.callbacks.visitingCallback(array[j]);

        this.recordStep(
          'compare',
          array,
          [j, j + 1],
          { i, j, sortedFrom: array.length - i + 1 },
          'if (this.comparator.lessThan',
        );

        // Swap elements if they are in wrong order.
        if (this.comparator.lessThan(array[j + 1], array[j])) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];

          // Register the swap.
          swapped = true;
          this.recordStep(
            'swap',
            array,
            [j, j + 1],
            { i, j, sortedFrom: array.length - i + 1 },
            '[array[j], array[j + 1]] =',
          );
        }
      }

      this.recordStep('pass', array, [], { i, swapped, sortedFrom: array.length - i }, 'if (!swapped)');

      // If there were no swaps then array is already sorted and there is
      // no need to proceed.
      if (!swapped) {
        this.recordStep('done', array, [], { sortedFrom: 0, early: true }, 'if (!swapped)');
        return array;
      }
    }

    this.recordStep('done', array, [], { sortedFrom: 0, early: false }, 'return array; // sorted');
    return array; // sorted
  }
}
