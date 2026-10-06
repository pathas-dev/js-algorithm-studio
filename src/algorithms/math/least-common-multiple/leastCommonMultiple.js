import recordStep from '../../../utils/trace/recordStep';
import euclideanAlgorithm from '../euclidean-algorithm/euclideanAlgorithm';

/** Least common multiple with a zero case and division before multiplication. */
export default function leastCommonMultiple(a, b, stepCallback) {
  recordStep(stepCallback, 'start', [], [], () => ({
    a,
    b,
    result: '—',
    expression: `lcm(${a}, ${b})`,
    cells: JSON.stringify([['a', a], ['b', b]]),
  }), 'if (a === 0 || b === 0) {');
  if (a === 0 || b === 0) {
    recordStep(stepCallback, 'done', [], [], { result: 0, expression: 'lcm = 0', cells: '[["result",0]]' }, 'return 0;');
    return 0;
  }
  const divisor = euclideanAlgorithm(a, b, stepCallback ? (step) => stepCallback({
    ...step, variables: { ...step.variables, phase: 'gcd' },
  }) : undefined);
  const multiple = Math.abs((a / divisor) * b);
  recordStep(stepCallback, 'done', [], [], () => ({
    a,
    b,
    divisor,
    result: multiple,
    expression: `|${a} ÷ ${divisor} × ${b}| = ${multiple}`,
    cells: JSON.stringify([['a', a], ['b', b], ['gcd', divisor], ['lcm', multiple]]),
  }), 'const multiple = Math.abs((a / divisor) * b);');
  return multiple;
}
