import kNN from '../algorithms/ml/knn/kNN';

export default function traceKnn(values) {
  let data;
  let query;
  try { data = JSON.parse(values[0]); query = JSON.parse(values[1]); } catch (_) {
    throw new Error('knn-input');
  }
  if (!Array.isArray(data) || !data.length || data.length > 16 || !Array.isArray(query)
    || query.length !== 3 || !data.every((row) => Array.isArray(row) && row.length === 3
      && row.every(Number.isFinite) && Math.abs(row[0]) <= 20 && Math.abs(row[1]) <= 20
      && Number.isInteger(row[2]) && row[2] >= 0 && row[2] <= 5)
    || !query.every(Number.isFinite) || Math.abs(query[0]) > 20 || Math.abs(query[1]) > 20
    || !Number.isInteger(query[2]) || query[2] < 1 || query[2] > data.length) {
    throw new Error('knn-input');
  }
  const points = data.map((row) => row.slice(0, 2));
  const labels = data.map((row) => row[2]);
  const steps = [];
  let state = { distances: '[]', nearest: '[]', counts: '{}' };
  const save = (type, variables, code) => {
    state = { ...state, ...variables };
    steps.push({
      type,
      array: [],
      indices: [],
      code,
      variables: {
        ...state,
        mode: 'knn',
        points: JSON.stringify(points),
        labels: JSON.stringify(labels),
        query: JSON.stringify(query.slice(0, 2)),
        k: query[2],
      },
    });
  };
  save('start', {}, 'const distances = []');
  const result = kNN(
    points,
    labels,
    query.slice(0, 2),
    query[2],
    (step) => save(step.type, step.variables, step.code),
  );
  save('done', { result }, 'return topClass');
  return steps;
}
