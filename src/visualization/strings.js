import naiveSearch from '../algorithms/string/naive-search/naiveSearch';

export function requireStrings(text, pattern) {
  if (typeof text !== 'string' || typeof pattern !== 'string'
    || text.length > 48 || pattern.length > 16) throw new Error('strings');
}

export function traceStringSearch(text, pattern, search = naiveSearch) {
  requireStrings(text, pattern);
  const steps = [];
  const items = text.split('').map((character, id) => ({ value: character.charCodeAt(0), id }));
  const snapshot = (type, code, variables = {}) => steps.push({
    type,
    code,
    array: [...items],
    indices: Number.isInteger(variables.textIndex) && variables.textIndex < items.length
      ? [variables.textIndex] : [],
    variables: {
      text, pattern, alignment: 0, ...variables,
    },
  });
  snapshot('start', 'if (!word.length) return 0;');
  const result = search(text, pattern, (step) => snapshot(step.type, step.code, step.variables));
  let code = 'return -1;';
  if (result >= 0) code = 'if (wordIndex === word.length) return alignment;';
  if (!pattern.length) code = 'if (!word.length) return 0;';
  snapshot('done', code, {
    result, alignment: Math.max(0, result), matchIndex: result,
  });
  return steps;
}
