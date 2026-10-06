import recordGraphStep from '../../../utils/trace/recordGraphStep';

/** Exact TSP by exhaustive search. Return vertices without repeating the start. */
export default function bfTravellingSalesman(graph, stepCallback) {
  const vertices = graph.getAllVertices();
  const start = vertices[0];
  const path = [];
  const visited = new Set();
  let best = [];
  let bestWeight = Infinity;
  const routeEdges = (route) => route.slice(1).map(
    (vertex, i) => [route[i].getKey(), vertex.getKey()],
  );
  const state = (vertex, weight = 0) => ({
    current: vertex ? vertex.getKey() : '',
    seen: path.map((item) => item.getKey()).join(','),
    processed: '',
    stack: path.map((item) => item.getKey()).join(','),
    order: path.map((item) => item.getKey()).join(','),
    cost: weight,
    best: Number.isFinite(bestWeight) ? bestWeight : '∞',
    chosen: JSON.stringify(routeEdges(path)),
    result: best.length ? `${best.map((item) => item.getKey()).join(' → ')} → ${start.getKey()}` : '∅',
  });
  recordGraphStep(stepCallback, graph, 'start', () => state(), 'let bestWeight = Infinity;');
  function visit(vertex, weight) {
    path.push(vertex);
    visited.add(vertex);
    recordGraphStep(stepCallback, graph, 'enter', () => state(vertex, weight), 'path.push(vertex);');
    if (path.length === vertices.length) {
      const closing = graph.findEdge(vertex, start);
      let total = vertices.length === 1 ? 0 : Infinity;
      if (closing) total = weight + closing.weight;
      recordGraphStep(stepCallback, graph, 'compare-tour', () => state(vertex, total), 'if (total < bestWeight) {');
      if (total < bestWeight) {
        best = [...path];
        bestWeight = total;
        recordGraphStep(stepCallback, graph, 'save-tour', () => state(vertex, total), 'bestWeight = total;');
      }
    } else {
      vertex.getNeighbors().forEach((next) => {
        if (!visited.has(next)) visit(next, weight + graph.findEdge(vertex, next).weight);
      });
    }
    visited.delete(vertex);
    path.pop();
    recordGraphStep(stepCallback, graph, 'backtrack', () => state(vertex, weight), 'path.pop();');
  }
  if (start) visit(start, 0);
  recordGraphStep(stepCallback, graph, 'done', () => ({
    ...state(),
    weight: Number.isFinite(bestWeight) ? bestWeight : '∞',
    chosen: JSON.stringify(best.length > 1 ? [
      ...routeEdges(best), [best[best.length - 1].getKey(), start.getKey()],
    ] : []),
  }), 'return best;');
  return best;
}
