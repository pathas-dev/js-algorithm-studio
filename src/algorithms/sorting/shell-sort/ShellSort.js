import Sort from '../Sort';

export default class ShellSort extends Sort {
  sort(originalArray) {
    // Prevent original array from mutations.
    const array = [...originalArray];
    this.recordStep('start', array, [], {}, 'const array = [...originalArray];');

    // Define a gap distance.
    let gap = Math.floor(array.length / 2);

    // Until gap is bigger then zero do elements comparisons and swaps.
    while (gap > 0) {
      this.recordStep('gap', array, [], { gap }, 'while (gap > 0)');
      // Go and compare all distant element pairs.
      for (let i = 0; i < (array.length - gap); i += 1) {
        let currentIndex = i;
        let gapShiftedIndex = i + gap;

        while (currentIndex >= 0) {
          // Call visiting callback.
          this.callbacks.visitingCallback(array[currentIndex]);

          // Compare and swap array elements if needed.
          this.recordStep(
            'compare',
            array,
            [currentIndex, gapShiftedIndex],
            {
              gap, i, currentIndex, gapShiftedIndex,
            },
            'if (this.comparator.lessThan(',
          );
          if (this.comparator.lessThan(array[gapShiftedIndex], array[currentIndex])) {
            const tmp = array[currentIndex];
            array[currentIndex] = array[gapShiftedIndex];
            array[gapShiftedIndex] = tmp;
            this.recordStep(
              'swap',
              array,
              [currentIndex, gapShiftedIndex],
              {
                gap, i, currentIndex, gapShiftedIndex,
              },
              'array[gapShiftedIndex] = tmp;',
            );
          }

          gapShiftedIndex = currentIndex;
          currentIndex -= gap;
        }
      }

      // Shrink the gap.
      this.recordStep('pass', array, [], { gap }, 'gap = Math.floor(gap / 2);');
      gap = Math.floor(gap / 2);
    }

    // Return sorted copy of an original array.
    this.recordStep('done', array, [], { sortedCount: array.length }, 'return array;');
    return array;
  }
}
