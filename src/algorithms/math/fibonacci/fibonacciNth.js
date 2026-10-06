import recordStep from '../../../utils/trace/recordStep';
/**
 * Calculate fibonacci number at specific position using Dynamic Programming approach.
 *
 * @param n
 * @return {number}
 */
export default function fibonacciNth(n, stepCallback) {
  if (!Number.isInteger(n) || n < 0) throw new Error('fibonacci-input');
  recordStep(stepCallback, 'start', [], [], {
    n, result: 0, expression: 'F(0) = 0 · F(1) = 1', cells: JSON.stringify([['n', n], ['F(0)', 0], ['F(1)', 1]]),
  }, 'let currentValue = 1;');
  if (n === 0) {
    recordStep(stepCallback, 'done', [], [], {
      n, result: 0, expression: 'F(0) = 0', cells: JSON.stringify([['n', n], ['result', 0]]),
    }, 'return 0;');
    return 0;
  }
  let currentValue = 1;
  let previousValue = 0;

  if (n === 1) {
    recordStep(stepCallback, 'done', [], [], {
      n, result: 1, expression: 'F(1) = 1', cells: JSON.stringify([['n', n], ['result', 1]]),
    }, 'return 1;');
    return 1;
  }

  let iterationsCounter = n - 1;

  while (iterationsCounter) {
    currentValue += previousValue;
    previousValue = currentValue - previousValue;

    iterationsCounter -= 1;
    recordStep(stepCallback, 'add', [], [], () => ({
      n, index: n - iterationsCounter, result: currentValue, expression: `${currentValue - previousValue} + ${previousValue} = ${currentValue}`, cells: JSON.stringify([['index', n - iterationsCounter], ['previous', previousValue], ['current', currentValue]]),
    }), 'currentValue += previousValue;');
  }

  recordStep(stepCallback, 'done', [], [], {
    n, result: currentValue, expression: `F(${n}) = ${currentValue}`, cells: JSON.stringify([['n', n], ['result', currentValue]]),
  }, 'return currentValue;');
  return currentValue;
}
