import RadixSort from '../algorithms/sorting/radix-sort/RadixSort';
import CountingSort from '../algorithms/sorting/counting-sort/CountingSort';

export function requireIntegers(values) {
  if (values.some((value) => !Number.isInteger(value))) throw new Error('integers');
}

export function traceCounting(values) {
  requireIntegers(values);
  const minimum = values.length ? Math.min(...values) : 0;
  const maximum = values.length ? Math.max(...values) : 0;
  // ponytail: at most 64 readable buckets; use sparse buckets for wider ranges.
  if (maximum - minimum >= 64) throw new Error('buckets');
  const steps = [];
  new CountingSort({ stepCallback: (step) => steps.push(step) }).sort(values, minimum, maximum);
  return steps;
}

export function traceRadix(values) {
  requireIntegers(values);
  if (values.some((value) => value < 0)) throw new Error('nonnegative');
  const steps = [];
  new RadixSort({ stepCallback: (step) => steps.push(step) }).sort(values);
  return steps;
}
