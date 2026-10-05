import recordStep from './recordStep';

export default function recordGraphStep(callback, graph, type, state, code) {
  if (!callback) return;
  const {
    distances, previousVertices, tree, sets, ...variables
  } = state();
  const pathState = distances ? {
    distances: JSON.stringify(distances),
    previous: JSON.stringify(Object.fromEntries(Object.entries(previousVertices).map(
      ([key, vertex]) => [key, vertex ? vertex.getKey() : null],
    ))),
  } : {};
  const treeState = tree ? {
    weight: tree.getWeight(),
    chosen: JSON.stringify(tree.getAllEdges().map((edge) => [
      edge.startVertex.getKey(), edge.endVertex.getKey(),
    ])),
  } : {};
  const groupState = sets ? {
    groups: JSON.stringify(graph.getAllVertices().map((vertex) => {
      return [vertex.getKey(), sets.find(vertex)];
    })),
  } : {};
  recordStep(callback, type, () => graph.getAllVertices().map((vertex) => vertex.getKey()), [], {
    ...variables, ...pathState, ...treeState, ...groupState,
  }, code);
}
