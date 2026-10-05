import naiveSearch from '../algorithms/string/naive-search/naiveSearch';
import knuthMorrisPratt from '../algorithms/string/knuth-morris-pratt/knuthMorrisPratt';

export function requireStrings(text, pattern) {
  if (typeof text !== 'string' || typeof pattern !== 'string'
    || text.length > 48 || pattern.length > 16) throw new Error('strings');
}

export function traceStringSearch(text, pattern, search = naiveSearch) {
  requireStrings(text, pattern);
  const steps = [];
  const kmp = search === knuthMorrisPratt;
  let table = '[]';
  const items = text.split('').map((character, id) => ({ value: character.charCodeAt(0), id }));
  const snapshot = (type, code, variables = {}) => steps.push({
    type,
    code,
    array: [...items],
    indices: Number.isInteger(variables.textIndex) && variables.textIndex < items.length
      ? [variables.textIndex] : [],
    variables: {
      text, pattern, alignment: 0, ...(kmp ? { mode: 'kmp', table } : {}), ...variables,
    },
  });
  snapshot('start', kmp ? 'if (word.length === 0) {' : 'if (!word.length) return 0;');
  const result = search(text, pattern, (step) => {
    if (kmp) table = JSON.stringify(step.array);
    snapshot(step.type, step.code, step.variables);
  });
  let code = 'return -1;';
  if (result >= 0) code = kmp ? 'return (textIndex - word.length) + 1;' : 'if (wordIndex === word.length) return alignment;';
  if (!pattern.length) code = kmp ? 'return 0;' : 'if (!word.length) return 0;';
  snapshot('done', code, {
    result, alignment: Math.max(0, result), matchIndex: result,
  });
  return steps;
}

export function traceKmpSearch(text, pattern) {
  return traceStringSearch(text, pattern, knuthMorrisPratt);
}
