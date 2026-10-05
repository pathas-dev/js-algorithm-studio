import recordStep from './recordStep';

export default function recordGraphStep(callback, graph, type, state, code) {
  if (!callback) return;
  const { distances, previousVertices, ...variables } = state();
  const pathState = distances ? {
    distances: JSON.stringify(distances),
    previous: JSON.stringify(Object.fromEntries(Object.entries(previousVertices).map(
      ([key, vertex]) => [key, vertex ? vertex.getKey() : null],
    ))),
  } : {};
  recordStep(callback, type, () => graph.getAllVertices().map((vertex) => vertex.getKey()), [], {
    ...variables, ...pathState,
  }, code);
}
