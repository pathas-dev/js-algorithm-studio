import recordStep from '../../../utils/trace/recordStep';

export default class FenwickTree {
  /**
   * Constructor creates empty fenwick tree of size 'arraySize',
   * however, array size is size+1, because index is 1-based.
   *
   * @param  {number} arraySize
   */
  constructor(arraySize, stepCallback) {
    this.arraySize = arraySize;
    this.stepCallback = stepCallback;

    // Fill tree array with zeros.
    this.treeArray = Array(this.arraySize + 1).fill(0);
  }

  /**
   * Adds value to existing value at position.
   *
   * @param  {number} position
   * @param  {number} value
   * @return {FenwickTree}
   */
  increase(position, value) {
    if (!Number.isInteger(position) || position < 1 || position > this.arraySize) {
      throw new Error('Position is out of allowed range');
    }

    for (let i = position; i <= this.arraySize; i += (i & -i)) {
      this.treeArray[i] += value;
      recordStep(this.stepCallback, 'increase-node', this.treeArray, [i], {
        i, value, lowbit: i & -i, next: i + (i & -i),
      }, 'this.treeArray[i] += value;');
    }

    return this;
  }

  /**
   * Query sum from index 1 to position.
   *
   * @param  {number} position
   * @return {number}
   */
  query(position) {
    if (!Number.isInteger(position) || position < 1 || position > this.arraySize) {
      throw new Error('Position is out of allowed range');
    }

    let sum = 0;

    for (let i = position; i > 0; i -= (i & -i)) {
      sum += this.treeArray[i];
      recordStep(this.stepCallback, 'query-node', this.treeArray, [i], {
        i, sum, position, lowbit: i & -i, next: i - (i & -i),
      }, 'sum += this.treeArray[i];');
    }

    return sum;
  }

  /**
   * Query sum from index leftIndex to rightIndex.
   *
   * @param  {number} leftIndex
   * @param  {number} rightIndex
   * @return {number}
   */
  queryRange(leftIndex, rightIndex) {
    if (leftIndex > rightIndex) {
      throw new Error('Left index can not be greater than right one');
    }

    if (leftIndex === 1) {
      return this.query(rightIndex);
    }

    return this.query(rightIndex) - this.query(leftIndex - 1);
  }
}
