import regularExpressionMatching from '../algorithms/string/regular-expression-matching/regularExpressionMatching';
import longestCommonSubstring from '../algorithms/string/longest-common-substring/longestCommonSubstring';
import longestCommonSubsequence from '../algorithms/sets/longest-common-subsequence/longestCommonSubsequence';
import levenshteinDistance from '../algorithms/string/levenshtein-distance/levenshteinDistance';
import Knapsack from '../algorithms/sets/knapsack-problem/Knapsack';
import KnapsackItem from '../algorithms/sets/knapsack-problem/KnapsackItem';
import { requireStrings } from './strings';

export function requireDpStrings(first, second) {
  requireStrings(first, second);
  if (first.length > 12 || second.length > 12) throw new Error('dp-strings');
}

function traceStringDp(first, second, algorithm) {
  requireDpStrings(first, second);
  const edit = algorithm === levenshteinDistance;
  const steps = [];
  const emptyMatrix = Array(second.length + 1).fill(null)
    .map(() => Array(first.length + 1).fill(null));
  let context = {
    mode: edit ? 'edit' : 'lcs',
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
  snapshot('start', edit ? 'const distanceMatrix = Array(' : 'const lcsMatrix = Array(');
  const result = algorithm(edit ? first : first.split(''), edit ? second : second.split(''), (step) => {
    snapshot(step.type, step.code, step.variables);
  });
  if (edit) {
    snapshot('done', 'return distanceMatrix[b.length][a.length];', {
      result, dependencies: '[]', row: -1, column: -1,
    });
    return steps;
  }
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

export function traceLcs(first, second) {
  return traceStringDp(first, second, longestCommonSubsequence);
}

export function traceEditDistance(first, second) {
  return traceStringDp(first, second, levenshteinDistance);
}

export function traceKnapsack(text, capacity) {
  if (typeof text !== 'string' || !/^\d+$/.test(capacity)) throw new Error('knapsack-input');
  const limit = Number(capacity);
  const entries = text.trim() ? text.split(',').map((part) => part.trim()) : [];
  if (limit > 24 || entries.length > 8) throw new Error('knapsack-input');
  const items = entries.map((entry) => {
    if (!/^\d+:\d+$/.test(entry)) throw new Error('knapsack-input');
    const [weight, value] = entry.split(':').map(Number);
    if (weight < 1 || weight > 24 || value > 999) throw new Error('knapsack-input');
    return new KnapsackItem({ weight, value });
  });
  const knapsack = new Knapsack(items, limit);
  const steps = [];
  let context = {
    mode: 'knapsack',
    columns: JSON.stringify(Array.from({ length: limit + 1 }, (_, i) => String(i))),
    rows: JSON.stringify(['∅', ...entries]),
    dpMatrix: JSON.stringify(Array(items.length + 1).fill(null)
      .map(() => Array(limit + 1).fill(null))),
    selected: '[]',
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
  snapshot('start', 'this.sortPossibleItemsByValue();');
  knapsack.solveZeroOneKnapsackProblem((step) => {
    snapshot(step.type, step.code, {
      ...step.variables,
      rows: JSON.stringify(['∅', ...knapsack.possibleItems.map((item) => {
        return `#${items.indexOf(item) + 1} · w${item.weight} v${item.value}`;
      })]),
    });
  });
  snapshot('done', 'return this.selectedItems.reduce((accumulator, item) => {', {
    result: knapsack.totalValue,
    totalWeight: knapsack.totalWeight,
    dependencies: '[]',
    row: -1,
    column: -1,
    selectedItems: JSON.stringify(knapsack.selectedItems.map((item) => items.indexOf(item) + 1)),
  });
  return steps;
}

export function traceSubstring(first, second) {
  if (typeof first !== 'string' || typeof second !== 'string'
    || [...first].length > 12 || [...second].length > 12) throw new Error('dp-codepoints');
  const steps = [];
  longestCommonSubstring(first, second, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables,
      mode: 'substring',
      columns: JSON.stringify(['∅', ...first]),
      rows: JSON.stringify(['∅', ...second]),
    },
  }));
  return steps;
}

export function traceRegex(text, pattern) {
  requireDpStrings(text, pattern);
  const steps = [];
  regularExpressionMatching(text, pattern, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables,
      mode: 'regex',
      columns: JSON.stringify(['∅', ...pattern.split('')]),
      rows: JSON.stringify(['∅', ...text.split('')]),
    },
  }));
  return steps;
}
