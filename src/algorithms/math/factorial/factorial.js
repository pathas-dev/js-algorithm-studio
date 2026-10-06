import recordStep from '../../../utils/trace/recordStep';
/**
 * @param {number} number
 * @return {number}
 */
export default function factorial(number, stepCallback) {
  let result = 1;
  recordStep(stepCallback, 'start', [], [], {
    number, result: 1, expression: '0! = 1', cells: JSON.stringify([['n', number], ['product', 1]]),
  }, 'let result = 1;');

  for (let i = 2; i <= number; i += 1) {
    const previous = result;
    result *= i;
    recordStep(stepCallback, 'multiply', [], [], () => ({
      number, i, result, expression: `${previous} × ${i} = ${result}`, cells: JSON.stringify([['n', number], ['i', i], ['previous', previous], ['product', result]]),
    }), 'result *= i;');
  }

  recordStep(stepCallback, 'done', [], [], () => ({
    number, result, expression: `${number}! = ${result}`, cells: JSON.stringify([['n', number], ['product', result]]),
  }), 'return result;');
  return result;
}
