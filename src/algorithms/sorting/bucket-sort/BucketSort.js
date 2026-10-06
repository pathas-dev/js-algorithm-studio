import recordStep from '../../../utils/trace/recordStep';

/** Sort finite numbers by range, then sort and concatenate each bucket. */
export default function BucketSort(arr, bucketsNum = 1, stepCallback = undefined) {
  if (!Number.isInteger(bucketsNum) || bucketsNum < 1) throw new Error('buckets');
  if (arr.some((value) => !Number.isFinite(value))) throw new Error('range');
  const buckets = new Array(bucketsNum).fill(null).map(() => []);
  recordStep(stepCallback, 'start', arr, [], () => ({ buckets: JSON.stringify(buckets) }), 'const buckets = new Array(bucketsNum).fill(null).map(() => []);');
  const minValue = arr.length ? Math.min(...arr) : 0;
  const maxValue = arr.length ? Math.max(...arr) : 0;
  const bucketSize = Math.max(1, Math.ceil((maxValue - minValue) / bucketsNum));

  for (let i = 0; i < arr.length; i += 1) {
    const currValue = arr[i];
    const bucketIndex = Math.min(bucketsNum - 1, Math.floor((currValue - minValue) / bucketSize));
    buckets[bucketIndex].push(currValue);
    recordStep(stepCallback, 'bucket', arr, [i], () => ({
      bucket: bucketIndex, value: currValue, bucketSize, minValue, buckets: JSON.stringify(buckets),
    }), 'buckets[bucketIndex].push(currValue);');
  }

  // Numeric comparison also supports negative and fractional values.
  for (let i = 0; i < buckets.length; i += 1) {
    buckets[i].sort((a, b) => a - b);
    recordStep(stepCallback, 'sort-bucket', arr, [], () => ({ bucket: i, buckets: JSON.stringify(buckets) }), 'buckets[i].sort((a, b) => a - b);');
  }

  const sortedArr = [];
  for (let i = 0; i < buckets.length; i += 1) {
    sortedArr.push(...buckets[i]);
    recordStep(stepCallback, 'gather', arr, [], () => ({ bucket: i, buckets: JSON.stringify(buckets), output: JSON.stringify(sortedArr) }), 'sortedArr.push(...buckets[i]);');
  }
  recordStep(stepCallback, 'done', sortedArr, [], { sortedCount: sortedArr.length }, 'return sortedArr;');
  return sortedArr;
}
