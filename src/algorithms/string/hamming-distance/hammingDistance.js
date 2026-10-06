import recordStep from '../../../utils/trace/recordStep';
/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
export default function hammingDistance(a, b, stepCallback) {
  if (a.length !== b.length) {
    throw new Error('Strings must be of the same length');
  }

  let distance = 0;
  recordStep(stepCallback, 'start', [], [], { distance }, 'let distance = 0;');

  for (let i = 0; i < a.length; i += 1) {
    recordStep(stepCallback, 'compare', [], [], { textIndex: i, wordIndex: i, distance }, 'if (a[i] !== b[i]) {');
    if (a[i] !== b[i]) {
      distance += 1;
      recordStep(stepCallback, 'mismatch', [], [], { textIndex: i, wordIndex: i, distance }, 'distance += 1;');
    }
  }

  recordStep(stepCallback, 'done', [], [], { result: distance, distance }, 'return distance;');
  return distance;
}
