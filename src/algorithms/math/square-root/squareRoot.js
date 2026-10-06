import recordStep from '../../../utils/trace/recordStep';

/**
 * Newton's method, followed by rounding to the requested decimal places.
 * @param {number} number
 * @param {number} [tolerance]
 * @param {function} [stepCallback]
 * @return {number}
 */
export default function squareRoot(number, tolerance = 0, stepCallback = undefined) {
  if (!Number.isFinite(number) || number < 0 || !Number.isInteger(tolerance)
    || tolerance < 0 || tolerance > 15) {
    throw new Error('Expected a finite nonnegative number and 0–15 decimal places');
  }
  let root = number === 0 ? 0 : 1;
  let iteration = 0;
  const state = (result = '—', expression = `x = ${root}`) => ({
    number,
    tolerance,
    root,
    iteration,
    result,
    expression,
    cells: JSON.stringify([['n', number], ['estimate', root],
      ['estimate² − n', root ** 2 - number], ['decimal places', tolerance]]),
  });
  recordStep(stepCallback, 'start', [], [], () => state(), 'let root = number === 0 ? 0 : 1;');
  if (number === 0) {
    recordStep(stepCallback, 'done', [], [], () => state(0, '√0 = 0'), 'return 0;');
    return 0;
  }
  let change = Infinity;
  while (change > Number.EPSILON * root) {
    const previous = root;
    root = (root + number / root) / 2;
    change = Math.abs(root - previous);
    iteration += 1;
    recordStep(
      stepCallback,
      'update',
      [],
      [],
      () => state('—', `(${previous.toPrecision(6)} + ${number} ÷ ${previous.toPrecision(6)}) ÷ 2 = ${root.toPrecision(8)}`),
      'root = (root + number / root) / 2;',
    );
  }
  const result = Math.round(root * (10 ** tolerance)) / (10 ** tolerance);
  recordStep(
    stepCallback,
    'done',
    [],
    [],
    () => state(result, `√${number} ≈ ${result}`),
    'const result = Math.round(root * (10 ** tolerance)) / (10 ** tolerance);',
  );
  return result;
}
