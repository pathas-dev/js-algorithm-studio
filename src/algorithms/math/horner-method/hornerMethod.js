import recordStep from '../../../utils/trace/recordStep';

/**
 * Returns the evaluation of a polynomial function at a certain point.
 * Uses Horner's rule.
 *
 * @param {number[]} coefficients - i.e. [4, 3, 2] for (4 * x^2 + 3 * x + 2)
 * @param {number} xVal
 * @return {number}
 */
export default function hornerMethod(coefficients, xVal, stepCallback) {
  const state = (result = 0, index = -1, previous = 0) => ({
    result,
    index,
    x: xVal,
    sequence: JSON.stringify(coefficients),
    expression: index < 0 ? 'accumulator = 0'
      : `${previous} × ${xVal} + ${coefficients[index]} = ${result}`,
    cells: JSON.stringify([['x', xVal], ['previous accumulator', previous],
      ['coefficient', index < 0 ? '—' : coefficients[index]], ['result', result]]),
  });
  recordStep(stepCallback, 'start', [], [], () => state(), 'return coefficients.reduce(');
  return coefficients.reduce(
    (accumulator, currentCoefficient, index) => {
      const result = accumulator * xVal + currentCoefficient;
      recordStep(
        stepCallback,
        'multiply-add',
        [],
        [],
        () => state(result, index, accumulator),
        'const result = accumulator * xVal + currentCoefficient;',
      );
      return result;
    },
    0,
  );
}
