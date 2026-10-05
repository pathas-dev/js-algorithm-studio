import recordStep from './recordStep';

export default function recordGraphStep(callback, graph, type, state, code) {
  if (!callback) return;
  const { distances, previousVertices, ...variables } = state();
  recordStep(callback, type, () => graph.getAllVertices().map((vertex) => vertex.getKey()), [], {
    ...variables,
    distances: JSON.stringify(distances),
    previous: JSON.stringify(Object.fromEntries(Object.entries(previousVertices).map(
      ([key, vertex]) => [key, vertex ? vertex.getKey() : null],
    ))),
  }, code);
}
