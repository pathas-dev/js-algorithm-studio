import Sort from '../Sort';
import MinHeap from '../../../data-structures/heap/MinHeap';

export default class HeapSort extends Sort {
  sort(originalArray) {
    const sortedArray = [];
    this.recordStep(
      'start',
      originalArray,
      [],
      { heapSize: 0, sortedCount: 0 },
      'const sortedArray = [];',
    );
    const minHeap = new MinHeap(this.callbacks.compareCallback);

    // Insert all array elements to the heap.
    originalArray.forEach((element, index) => {
      // Call visiting callback.
      this.callbacks.visitingCallback(element);

      minHeap.add(element);
      this.recordStep(
        'add',
        () => [...minHeap.heapContainer, ...originalArray.slice(index + 1)],
        [],
        { heapSize: minHeap.heapContainer.length, sortedCount: 0, index },
        'minHeap.add(element);',
      );
    });

    // Now we have min heap with minimal element always on top.
    // Let's poll that minimal element one by one and thus form the sorted array.
    while (!minHeap.isEmpty()) {
      this.recordStep(
        'poll',
        () => [...sortedArray, ...minHeap.heapContainer],
        [sortedArray.length],
        { heapSize: minHeap.heapContainer.length, sortedCount: sortedArray.length },
        'const nextMinElement = minHeap.poll();',
      );
      const nextMinElement = minHeap.poll();

      // Call visiting callback.
      this.callbacks.visitingCallback(nextMinElement);

      sortedArray.push(nextMinElement);
      this.recordStep(
        'extract',
        () => [...sortedArray, ...minHeap.heapContainer],
        [sortedArray.length - 1],
        { heapSize: minHeap.heapContainer.length, sortedCount: sortedArray.length },
        'sortedArray.push(nextMinElement);',
      );
    }

    this.recordStep(
      'done',
      sortedArray,
      [],
      { heapSize: 0, sortedCount: sortedArray.length },
      'return sortedArray;',
    );
    return sortedArray;
  }
}
