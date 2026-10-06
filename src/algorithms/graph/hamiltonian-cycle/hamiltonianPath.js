import recordGraphStep from '../../../utils/trace/recordGraphStep';

/** Find one Hamiltonian path; unlike a cycle, no closing edge is required. */
export default function hamiltonianPath(graph, stepCallback) {
  const vertices = graph.getAllVertices();
  const path = [];
  const visited = new Set();
  const state = (current, next) => ({
    current: current ? current.getKey() : '',
    next: next ? next.getKey() : '',
    seen: path.map((vertex) => vertex.getKey()).join(','),
    processed: '',
    order: path.map((vertex) => vertex.getKey()).join(','),
    stack: path.map((vertex) => vertex.getKey()).join(','),
    chosen: JSON.stringify(path.slice(1).map((vertex, i) => [path[i].getKey(), vertex.getKey()])),
    result: path.map((vertex) => vertex.getKey()).join(' → ') || '∅',
  });
  recordGraphStep(stepCallback, graph, 'start', () => state(), 'const path = [];');
  function visit(vertex) {
    path.push(vertex);
    visited.add(vertex);
    recordGraphStep(stepCallback, graph, 'enter', () => state(vertex), 'path.push(vertex);');
    if (path.length === vertices.length) {
      recordGraphStep(stepCallback, graph, 'found', () => state(vertex), 'if (path.length === vertices.length) {');
      return true;
    }
    const neighbors = vertex.getNeighbors();
    for (let i = 0; i < neighbors.length; i += 1) {
      const next = neighbors[i];
      recordGraphStep(stepCallback, graph, 'edge', () => state(vertex, next), 'if (!visited.has(next) && visit(next)) return true;');
      if (!visited.has(next) && visit(next)) return true;
    }
    visited.delete(vertex);
    path.pop();
    recordGraphStep(stepCallback, graph, 'backtrack', () => state(vertex), 'path.pop();');
    return false;
  }
  for (let i = 0; i < vertices.length; i += 1) {
    if (visit(vertices[i])) break;
  }
  recordGraphStep(stepCallback, graph, 'done', () => state(), 'return path;');
  return path;
}
