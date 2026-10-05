import recordGraphStep from '../../../utils/trace/recordGraphStep';

/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @return {{distances, previousVertices, negativeCycle: boolean}}
 */
export default function bellmanFord(graph, startVertex, stepCallback) {
  const distances = {};
  const previousVertices = {};

  // Init all distances with infinity assuming that currently we can't reach
  // any of the vertices except start one.
  distances[startVertex.getKey()] = 0;
  graph.getAllVertices().forEach((vertex) => {
    previousVertices[vertex.getKey()] = null;
    if (vertex.getKey() !== startVertex.getKey()) {
      distances[vertex.getKey()] = Infinity;
    }
  });

  recordGraphStep(
    stepCallback,
    graph,
    'start',
    () => ({ distances, previousVertices, current: startVertex.getKey() }),
    'distances[startVertex.getKey()] = 0;',
  );

  // We need (|V| - 1) iterations.
  for (let iteration = 0; iteration < (graph.getAllVertices().length - 1); iteration += 1) {
    recordGraphStep(
      stepCallback,
      graph,
      'pass',
      () => ({ distances, previousVertices, iteration: iteration + 1 }),
      'for (let iteration =',
    );
    // During each iteration go through all vertices.
    Object.keys(distances).forEach((vertexKey) => {
      const vertex = graph.getVertexByKey(vertexKey);

      // Go through all vertex edges.
      graph.getNeighbors(vertex).forEach((neighbor) => {
        const edge = graph.findEdge(vertex, neighbor);
        // Find out if the distance to the neighbor is shorter in this iteration
        // then in previous one.
        const distanceToVertex = distances[vertex.getKey()];
        const distanceToNeighbor = distanceToVertex + edge.weight;
        recordGraphStep(
          stepCallback,
          graph,
          'compare',
          () => ({
            distances,
            previousVertices,
            iteration: iteration + 1,
            current: vertex.getKey(),
            next: neighbor.getKey(),
            candidate: distanceToNeighbor,
          }),
          'if (distanceToNeighbor < distances[neighbor.getKey()])',
        );
        if (distanceToNeighbor < distances[neighbor.getKey()]) {
          distances[neighbor.getKey()] = distanceToNeighbor;
          previousVertices[neighbor.getKey()] = vertex;
          recordGraphStep(
            stepCallback,
            graph,
            'relax',
            () => ({
              distances,
              previousVertices,
              iteration: iteration + 1,
              current: vertex.getKey(),
              next: neighbor.getKey(),
              candidate: distanceToNeighbor,
            }),
            'previousVertices[neighbor.getKey()] = vertex;',
          );
        }
      });
    });
  }

  recordGraphStep(
    stepCallback,
    graph,
    'check-cycle',
    () => ({ distances, previousVertices }),
    'const negativeCycle =',
  );
  // A further reachable improvement proves that shortest paths are unbounded below.
  const negativeCycle = graph.getAllVertices().some((vertex) => {
    return graph.getNeighbors(vertex).some((neighbor) => {
      const edge = graph.findEdge(vertex, neighbor);
      return distances[vertex.getKey()] + edge.weight < distances[neighbor.getKey()];
    });
  });
  recordGraphStep(
    stepCallback,
    graph,
    negativeCycle ? 'negative-cycle' : 'done',
    () => ({ distances, previousVertices, negativeCycle }),
    'return {',
  );
  return {
    distances,
    previousVertices,
    negativeCycle,
  };
}
