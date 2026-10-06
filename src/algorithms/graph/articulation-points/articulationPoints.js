import recordGraphStep from '../../../utils/trace/recordGraphStep';

/** Tarjan articulation points, including disconnected components. */
export default function articulationPoints(graph, stepCallback) {
  const discovery = {};
  const low = {};
  const points = {};
  const stack = [];
  const processed = [];
  let time = 0;
  const state = (vertex, next) => ({
    current: vertex ? vertex.getKey() : '',
    next: next ? next.getKey() : '',
    seen: Object.keys(discovery).join(','),
    processed: processed.join(','),
    stack: stack.join(','),
    order: Object.keys(points).join(','),
    discovery: JSON.stringify(discovery),
    low: JSON.stringify(low),
    result: Object.keys(points).join(',') || '∅',
  });
  recordGraphStep(stepCallback, graph, 'start', () => state(), 'const discovery = {};');
  function visit(vertex, parent = null) {
    const key = vertex.getKey();
    time += 1;
    discovery[key] = time;
    low[key] = time;
    stack.push(key);
    let children = 0;
    recordGraphStep(stepCallback, graph, 'enter', () => state(vertex), 'discovery[key] = time;');
    vertex.getNeighbors().forEach((next) => {
      const nextKey = next.getKey();
      if (next === parent) return;
      recordGraphStep(stepCallback, graph, 'edge', () => state(vertex, next), 'if (next === parent) return;');
      if (!discovery[nextKey]) {
        children += 1;
        visit(next, vertex);
        low[key] = Math.min(low[key], low[nextKey]);
        recordGraphStep(stepCallback, graph, 'low', () => state(vertex, next), 'low[key] = Math.min(low[key], low[nextKey]);');
        if ((parent && low[nextKey] >= discovery[key]) || (!parent && children > 1)) {
          points[key] = vertex;
          recordGraphStep(stepCallback, graph, 'cut', () => state(vertex, next), 'points[key] = vertex;');
        }
      } else {
        low[key] = Math.min(low[key], discovery[nextKey]);
        recordGraphStep(stepCallback, graph, 'back-edge', () => state(vertex, next), 'low[key] = Math.min(low[key], discovery[nextKey]);');
      }
    });
    stack.pop();
    processed.push(key);
    recordGraphStep(stepCallback, graph, 'leave', () => state(vertex), 'processed.push(key);');
  }
  graph.getAllVertices().forEach((vertex) => {
    if (!discovery[vertex.getKey()]) visit(vertex);
  });
  recordGraphStep(stepCallback, graph, 'done', () => state(), 'return points;');
  return points;
}
