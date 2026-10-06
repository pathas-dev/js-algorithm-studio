import recordStep from '../../../utils/trace/recordStep';

/** Recursive Euclidean GCD; the library defines gcd(0, 0) as zero. */
export default function euclideanAlgorithm(originalA, originalB, stepCallback) {
  const a = Math.abs(originalA);
  const b = Math.abs(originalB);
  const state = (result = '—') => ({
    a,
    b,
    result,
    expression: `gcd(${a}, ${b})`,
    cells: JSON.stringify([['a', a], ['b', b], ['a mod b', b ? a % b : '—']]),
  });
  recordStep(stepCallback, 'enter', [], [], () => state(), 'const a = Math.abs(originalA);');
  if (b === 0) {
    recordStep(stepCallback, 'base', [], [], () => state(a), 'return a;');
    return a;
  }
  recordStep(stepCallback, 'modulo', [], [], () => ({
    ...state(), expression: `${a} mod ${b} = ${a % b}`,
  }), 'const result = euclideanAlgorithm(b, a % b, stepCallback);');
  const result = euclideanAlgorithm(b, a % b, stepCallback);
  recordStep(stepCallback, 'return', [], [], () => state(result), 'return result;');
  return result;
}
