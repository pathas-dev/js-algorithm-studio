import weightedRandom from '../algorithms/statistics/weighted-random/weightedRandom';

export default function traceWeighted(values) {
  let rows;
  const u = Number(values[1]);
  try { rows = JSON.parse(values[0]); } catch (_) { throw new Error('weighted-input'); }
  if (!Array.isArray(rows) || !rows.length || rows.length > 8
    || !rows.every((row) => Array.isArray(row) && row.length === 2
      && typeof row[0] === 'string' && row[0].length > 0 && row[0].length <= 10
      && Number.isFinite(row[1]) && row[1] >= 0 && row[1] <= 100)
    || rows.reduce((sum, row) => sum + row[1], 0) <= 0
    || !Number.isFinite(u) || u < 0 || u >= 1) throw new Error('weighted-input');
  const items = rows.map((row) => row[0]);
  const weights = rows.map((row) => row[1]);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const steps = [];
  let state = { cumulative: '[]' };
  const save = (type, variables, code) => {
    state = { ...state, ...variables };
    steps.push({
      type,
      array: [],
      indices: [],
      code,
      variables: {
        ...state, rows: JSON.stringify(rows), total, u,
      },
    });
  };
  save('start', {}, 'const cumulativeWeights = []');
  const result = weightedRandom(
    items,
    weights,
    (step) => save(step.type, step.variables, step.code),
    () => u,
  );
  save('done', { current: result.index, result: result.item }, 'index: itemIndex');
  return steps;
}
