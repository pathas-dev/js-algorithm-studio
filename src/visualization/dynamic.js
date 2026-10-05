import longestCommonSubsequence from '../algorithms/sets/longest-common-subsequence/longestCommonSubsequence';
import { requireStrings } from './strings';

export function requireDpStrings(first, second) {
  requireStrings(first, second);
  if (first.length > 12 || second.length > 12) throw new Error('dp-strings');
}

export function traceLcs(first, second) {
  requireDpStrings(first, second);
  const steps = [];
  const emptyMatrix = Array(second.length + 1).fill(null)
    .map(() => Array(first.length + 1).fill(null));
  let context = {
    mode: 'lcs',
    columns: JSON.stringify(['∅', ...first.split('')]),
    rows: JSON.stringify(['∅', ...second.split('')]),
    dpMatrix: JSON.stringify(emptyMatrix),
    sequence: '',
    dependencies: '[]',
    row: -1,
    column: -1,
  };
  const snapshot = (type, code, variables = {}) => {
    context = { ...context, ...variables };
    steps.push({
      type, code, array: [], indices: [], variables: { ...context },
    });
  };
  snapshot('start', 'const lcsMatrix = Array(');
  const result = longestCommonSubsequence(first.split(''), second.split(''), (step) => {
    snapshot(step.type, step.code, step.variables);
  });
  const matrix = JSON.parse(context.dpMatrix);
  snapshot('done', result.join('') ? 'return longestSequence;' : "return [''];", {
    result: result.join(''),
    length: matrix[second.length][first.length],
    sequence: result.join(''),
    dependencies: '[]',
    row: -1,
    column: -1,
  });
  return steps;
}
