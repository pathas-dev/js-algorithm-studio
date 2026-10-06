import BucketSort from '../BucketSort';
import {
  equalArr,
  notSortedArr,
  reverseArr,
  sortedArr,
} from '../../SortTester';

describe('BucketSort', () => {
  it('handles empty, negative and fractional input with immutable snapshots', () => {
    [[], [0, 0], [-3.5, 2, -8, 2, 0.1], [1, 2, 3]].forEach((input) => {
      const original = [...input]; const steps = [];
      const result = BucketSort(input, 3, (step) => steps.push(step));
      expect(result).toEqual([...input].sort((a, b) => a - b));
      expect(input).toEqual(original);
      expect(steps[0].array).toEqual(original);
      expect(JSON.parse(steps[0].variables.buckets)).toEqual([[], [], []]);
      expect(steps.at(-1).array).toEqual([...input].sort((a, b) => a - b));
    });
    expect(() => BucketSort([1], 0)).toThrow('buckets');
    expect(() => BucketSort([Infinity])).toThrow('range');
  });
  it('should sort the array of numbers with different buckets amounts', () => {
    expect(BucketSort(notSortedArr, 4)).toEqual(sortedArr);
    expect(BucketSort(equalArr, 4)).toEqual(equalArr);
    expect(BucketSort(reverseArr, 4)).toEqual(sortedArr);
    expect(BucketSort(sortedArr, 4)).toEqual(sortedArr);

    expect(BucketSort(notSortedArr, 10)).toEqual(sortedArr);
    expect(BucketSort(equalArr, 10)).toEqual(equalArr);
    expect(BucketSort(reverseArr, 10)).toEqual(sortedArr);
    expect(BucketSort(sortedArr, 10)).toEqual(sortedArr);

    expect(BucketSort(notSortedArr, 50)).toEqual(sortedArr);
    expect(BucketSort(equalArr, 50)).toEqual(equalArr);
    expect(BucketSort(reverseArr, 50)).toEqual(sortedArr);
    expect(BucketSort(sortedArr, 50)).toEqual(sortedArr);
  });

  it('should sort the array of numbers with the default buckets of 1', () => {
    expect(BucketSort(notSortedArr)).toEqual(sortedArr);
    expect(BucketSort(equalArr)).toEqual(equalArr);
    expect(BucketSort(reverseArr)).toEqual(sortedArr);
    expect(BucketSort(sortedArr)).toEqual(sortedArr);
  });
});
