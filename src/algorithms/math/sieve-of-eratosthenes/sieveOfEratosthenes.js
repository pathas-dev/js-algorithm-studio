import recordStep from '../../../utils/trace/recordStep';
/**
 * @param {number} maxNumber
 * @return {number[]}
 */
export default function sieveOfEratosthenes(maxNumber, stepCallback) {
  const isPrime = new Array(maxNumber + 1).fill(true);
  isPrime[0] = false;
  if (maxNumber >= 1) isPrime[1] = false;

  const primes = [];
  const state = (current = -1, prime = -1) => ({
    maxNumber,
    current,
    prime,
    count: primes.length,
    result: primes.join(', '),
    isPrime: JSON.stringify(isPrime),
    primes: JSON.stringify(primes),
    expression: current >= 0 ? `n = ${maxNumber} · current = ${current}` : `primes ≤ ${maxNumber}`,
    cells: JSON.stringify([['n', maxNumber], ['count', primes.length], ['current', current >= 0 ? current : '—']]),
  });
  recordStep(stepCallback, 'start', [], [], () => state(), 'const isPrime = new Array(maxNumber + 1).fill(true);');

  for (let number = 2; number <= maxNumber; number += 1) {
    if (isPrime[number] === true) {
      primes.push(number);
      recordStep(stepCallback, 'choose-prime', [], [], () => state(number, number), 'primes.push(number);');

      /*
       * Optimisation.
       * Start marking multiples of `p` from `p * p`, and not from `2 * p`.
       * The reason why this works is because, at that point, smaller multiples
       * of `p` will have already been marked `false`.
       *
       * Warning: When working with really big numbers, the following line may cause overflow
       * In that case, it can be changed to:
       * let nextNumber = 2 * number;
       */
      let nextNumber = number * number;

      while (nextNumber <= maxNumber) {
        isPrime[nextNumber] = false;
        recordStep(stepCallback, 'mark-composite', [], [], () => state(nextNumber, number), 'isPrime[nextNumber] = false;');
        nextNumber += number;
      }
    }
  }

  recordStep(stepCallback, 'done', [], [], () => state(), 'return primes;');
  return primes;
}
