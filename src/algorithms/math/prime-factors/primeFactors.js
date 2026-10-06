import recordStep from '../../../utils/trace/recordStep';

/**
 * Finds prime factors of a number.
 *
 * @param {number} n - the number that is going to be split into prime factors.
 * @returns {number[]} - array of prime factors.
 */
export function primeFactors(n, stepCallback) {
  // Clone n to avoid function arguments override.
  let nn = n;

  // Array that stores the all the prime factors.
  const factors = [];

  const state = (factor = 2, result = '—') => ({
    number: n,
    remaining: nn,
    factor,
    result,
    sequence: JSON.stringify(factors),
    expression: `${n} = ${factors.length ? `${factors.join(' × ')} × ` : ''}${nn}`,
    cells: JSON.stringify([['remaining', nn], ['factor', factor], ['remainder', nn % factor]]),
  });
  recordStep(stepCallback, 'start', [], [], () => state(), 'let nn = n;');

  // Running the loop till sqrt(n) instead of n to optimise time complexity from O(n) to O(sqrt(n)).
  for (let factor = 2; factor <= Math.sqrt(nn); factor += 1) {
    recordStep(stepCallback, 'check', [], [], () => state(factor), 'while (nn % factor === 0) {');
    // Check that factor divides n without a reminder.
    while (nn % factor === 0) {
      // Overriding the value of n.
      nn /= factor;
      // Saving the factor.
      factors.push(factor);
      recordStep(stepCallback, 'divide', [], [], () => state(factor), 'nn /= factor;');
    }
  }

  // The ultimate reminder should be a last prime factor,
  // unless it is not 1 (since 1 is not a prime number).
  if (nn !== 1) {
    factors.push(nn);
    recordStep(stepCallback, 'append', [], [], () => ({ ...state(nn), expression: `${n} = ${factors.join(' × ')}` }), 'factors.push(nn);');
  }

  recordStep(
    stepCallback,
    'done',
    [],
    [],
    () => ({ ...state(nn, factors.join(' × ') || '1'), expression: `${n} = ${factors.join(' × ') || '1'}` }),
    'return factors;',
  );
  return factors;
}

/**
 * Hardy-Ramanujan approximation of prime factors count.
 *
 * @param {number} n
 * @returns {number} - approximate number of prime factors.
 */
export function hardyRamanujan(n) {
  return Math.log(Math.log(n));
}
