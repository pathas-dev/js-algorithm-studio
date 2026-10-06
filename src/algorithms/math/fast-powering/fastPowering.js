import recordStep from '../../../utils/trace/recordStep';

/**
 * Fast Powering Algorithm.
 * Recursive implementation to compute power.
 *
 * Complexity: log(n)
 *
 * @param {number} base - Number that will be raised to the power.
 * @param {number} power - The power that number will be raised to.
 * @return {number}
 */
export default function fastPowering(base, power, stepCallback) {
  const state = (result = '—', multiplier = '—') => ({
    base,
    power,
    result,
    multiplier,
    expression: `${base}^${power} = ${result}`,
    cells: JSON.stringify([['base', base], ['power', power], ['half-power result', multiplier]]),
  });
  recordStep(stepCallback, 'enter', [], [], () => state(), 'if (power === 0) {');
  if (power === 0) {
    // Anything that is raised to the power of zero is 1.
    recordStep(stepCallback, 'base', [], [], () => state(1), 'return 1;');
    return 1;
  }

  if (power % 2 === 0) {
    // If the power is even...
    // we may recursively redefine the result via twice smaller powers:
    // x^8 = x^4 * x^4.
    const multiplier = fastPowering(base, power / 2, stepCallback);
    recordStep(
      stepCallback,
      'square',
      [],
      [],
      () => state(multiplier * multiplier, multiplier),
      'return multiplier * multiplier;',
    );
    return multiplier * multiplier;
  }

  // If the power is odd...
  // we may recursively redefine the result via twice smaller powers:
  // x^9 = x^4 * x^4 * x.
  const multiplier = fastPowering(base, Math.floor(power / 2), stepCallback);
  recordStep(
    stepCallback,
    'multiply',
    [],
    [],
    () => state(multiplier * multiplier * base, multiplier),
    'return multiplier * multiplier * base;',
  );
  return multiplier * multiplier * base;
}
