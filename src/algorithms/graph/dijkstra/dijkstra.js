import recordGraphStep from '../../../utils/trace/recordGraphStep';
import PriorityQueue from '../../../data-structures/priority-queue/PriorityQueue';

/**
 * @typedef {Object} ShortestPaths
 * @property {Object} distances - shortest distances to all vertices
 * @property {Object} previousVertices - shortest paths to all vertices.
 */

/**
 * Implementation of Dijkstra algorithm of finding the shortest paths to graph nodes.
 * @param {Graph} graph - graph we're going to traverse.
 * @param {GraphVertex} startVertex - traversal start vertex.
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @return {ShortestPaths}
 */
export default function dijkstra(graph, startVertex, stepCallback) {
  // Init helper variables that we will need for Dijkstra algorithm.
  const distances = {};
  const visitedVertices = {};
  const previousVertices = {};
  const queue = new PriorityQueue();

  // Init all distances with infinity assuming that currently we can't reach
  // any of the vertices except the start one.
  graph.getAllVertices().forEach((vertex) => {
    distances[vertex.getKey()] = Infinity;
    previousVertices[vertex.getKey()] = null;
  });

  // We are already at the startVertex so the distance to it is zero.
  distances[startVertex.getKey()] = 0;

  // Init vertices queue.
  queue.add(startVertex, distances[startVertex.getKey()]);

  recordGraphStep(
    stepCallback,
    graph,
    'start',
    () => ({
      distances,
      previousVertices,
      current: startVertex.getKey(),
      queue: queue.heapContainer.map((vertex) => vertex.getKey()).join(','),
      processed: '',
    }),
    'queue.add(startVertex, distances[startVertex.getKey()]);',
  );

  // Iterate over the priority queue of vertices until it is empty.
  while (!queue.isEmpty()) {
    // Fetch next closest vertex.
    const currentVertex = queue.poll();
    recordGraphStep(
      stepCallback,
      graph,
      'enter',
      () => ({
        distances,
        previousVertices,
        current: currentVertex.getKey(),
        queue: queue.heapContainer.map((vertex) => vertex.getKey()).join(','),
        processed: Object.keys(visitedVertices).join(','),
      }),
      'const currentVertex = queue.poll();',
    );

    // Iterate over every unvisited neighbor of the current vertex.
    currentVertex.getNeighbors().forEach((neighbor) => {
      // Don't visit already visited vertices.
      if (!visitedVertices[neighbor.getKey()]) {
        // Update distances to every neighbor from current vertex.
        const edge = graph.findEdge(currentVertex, neighbor);

        const existingDistanceToNeighbor = distances[neighbor.getKey()];
        const distanceToNeighborFromCurrent = distances[currentVertex.getKey()] + edge.weight;

        recordGraphStep(
          stepCallback,
          graph,
          'compare',
          () => ({
            distances,
            previousVertices,
            current: currentVertex.getKey(),
            next: neighbor.getKey(),
            candidate: distanceToNeighborFromCurrent,
            queue: queue.heapContainer.map((vertex) => vertex.getKey()).join(','),
            processed: Object.keys(visitedVertices).join(','),
          }),
          'if (distanceToNeighborFromCurrent < existingDistanceToNeighbor)',
        );

        // If we've found shorter path to the neighbor - update it.
        if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
          distances[neighbor.getKey()] = distanceToNeighborFromCurrent;

          // Change priority of the neighbor in a queue since it might have became closer.
          if (queue.hasValue(neighbor)) {
            queue.changePriority(neighbor, distances[neighbor.getKey()]);
          }

          // Remember previous closest vertex.
          previousVertices[neighbor.getKey()] = currentVertex;
          recordGraphStep(
            stepCallback,
            graph,
            'relax',
            () => ({
              distances,
              previousVertices,
              current: currentVertex.getKey(),
              next: neighbor.getKey(),
              candidate: distanceToNeighborFromCurrent,
              queue: queue.heapContainer.map((vertex) => vertex.getKey()).join(','),
              processed: Object.keys(visitedVertices).join(','),
            }),
            'previousVertices[neighbor.getKey()] = currentVertex;',
          );
        }

        // Add neighbor to the queue for further visiting.
        if (!queue.hasValue(neighbor)) {
          queue.add(neighbor, distances[neighbor.getKey()]);
        }
      }
    });

    // Add current vertex to visited ones to avoid visiting it again later.
    visitedVertices[currentVertex.getKey()] = currentVertex;
    recordGraphStep(
      stepCallback,
      graph,
      'leave',
      () => ({
        distances,
        previousVertices,
        current: currentVertex.getKey(),
        queue: queue.heapContainer.map((vertex) => vertex.getKey()).join(','),
        processed: Object.keys(visitedVertices).join(','),
      }),
      'visitedVertices[currentVertex.getKey()] = currentVertex;',
    );
  }

  // Return the set of shortest distances to all vertices and the set of
  // shortest paths to all vertices in a graph.
  recordGraphStep(
    stepCallback,
    graph,
    'done',
    () => ({
      distances,
      previousVertices,
      queue: '',
      processed: Object.keys(visitedVertices).join(','),
    }),
    'return {',
  );
  return {
    distances,
    previousVertices,
  };
}
