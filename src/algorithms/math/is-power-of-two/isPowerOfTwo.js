import recordStep from '../../../utils/trace/recordStep';
/**
 * @param {number} number
 * @return {boolean}
 */
export default function isPowerOfTwo(number, stepCallback) {
  const state = (current = number, result = '—') => ({
    number,
    current,
    result,
    expression: `current = ${current}`,
    cells: JSON.stringify([['n', number], ['current', current], ['current mod 2', current % 2]]),
  });
  recordStep(stepCallback, 'start', [], [], () => state(), 'if (number < 1) {');
  // 1 (2^0) is the smallest power of two.
  if (number < 1) {
    recordStep(stepCallback, 'done', [], [], () => state(number, false), 'if (number < 1) {');
    return false;
  }

  // Let's find out if we can divide the number by two
  // many times without remainder.
  let dividedNumber = number;
  while (dividedNumber !== 1) {
    recordStep(stepCallback, 'check', [], [], () => state(dividedNumber), 'if (dividedNumber % 2 !== 0) {');
    if (dividedNumber % 2 !== 0) {
      // For every case when remainder isn't zero we can say that this number
      // couldn't be a result of power of two.
      recordStep(stepCallback, 'done', [], [], () => state(dividedNumber, false), 'if (dividedNumber % 2 !== 0) {');
      return false;
    }

    dividedNumber /= 2;
    recordStep(stepCallback, 'halve', [], [], () => ({ ...state(dividedNumber), expression: `${dividedNumber * 2} ÷ 2 = ${dividedNumber}` }), 'dividedNumber /= 2;');
  }

  recordStep(stepCallback, 'done', [], [], () => state(dividedNumber, true), 'return true;');
  return true;
}
