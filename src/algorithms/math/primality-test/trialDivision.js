import recordStep from '../../../utils/trace/recordStep';
/**
 * @param {number} number
 * @return {boolean}
 */
export default function trialDivision(number, stepCallback) {
  const state = (result = '—', divider = 0) => ({
    number,
    result,
    divider,
    remainder: divider ? number % divider : '—',
    expression: divider ? `${number} mod ${divider} = ${number % divider}` : `n = ${number}`,
    cells: JSON.stringify([['n', number], ['divider', divider || '—'], ['remainder', divider ? number % divider : '—']]),
  });
  recordStep(stepCallback, 'start', [], [], () => state(), 'if (number % 1 !== 0) {');

  // Check if number is integer.
  if (number % 1 !== 0) {
    recordStep(stepCallback, 'done', [], [], () => state(false), 'if (number % 1 !== 0) {');
    return false;
  }

  if (number <= 1) {
    // If number is less than one then it isn't prime by definition.
    recordStep(stepCallback, 'done', [], [], () => state(false), 'if (number <= 1) {');
    return false;
  }

  if (number <= 3) {
    // All numbers from 2 to 3 are prime.
    recordStep(stepCallback, 'done', [], [], () => state(true), 'if (number <= 3) {');
    return number >= 2;
  }

  // If the number is not divided by 2 then we may eliminate all further even dividers.
  recordStep(stepCallback, 'check-divisor', [], [], () => state('—', 2), 'if (number % 2 === 0) {');
  if (number % 2 === 0) {
    recordStep(stepCallback, 'done', [], [], () => state(false, 2), 'if (number % 2 === 0) {');
    return false;
  }

  // If there is no dividers up to square root of n then there is no higher dividers as well.
  const dividerLimit = Math.sqrt(number);
  for (let divider = 3; divider <= dividerLimit; divider += 2) {
    recordStep(stepCallback, 'check-divisor', [], [], () => state('—', divider), 'if (number % divider === 0) {');
    if (number % divider === 0) {
      recordStep(stepCallback, 'done', [], [], () => state(false, divider), 'if (number % divider === 0) {');
      return false;
    }
  }

  recordStep(stepCallback, 'done', [], [], () => state(true), 'return true;');
  return true;
}
