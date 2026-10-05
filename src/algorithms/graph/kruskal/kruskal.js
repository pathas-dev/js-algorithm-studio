import recordGraphStep from '../../../utils/trace/recordGraphStep';
import Graph from '../../../data-structures/graph/Graph';
import QuickSort from '../../sorting/quick-sort/QuickSort';
import DisjointSet from '../../../data-structures/disjoint-set/DisjointSet';

/**
 * @param {Graph} graph
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @return {Graph}
 */
export default function kruskal(graph, stepCallback) {
  // It should fire error if graph is directed since the algorithm works only
  // for undirected graphs.
  if (graph.isDirected) {
    throw new Error('Kruskal\'s algorithms works only for undirected graphs');
  }

  // Init new graph that will contain minimum spanning tree of original graph.
  const minimumSpanningTree = new Graph();

  // Sort all graph edges in increasing order.
  const sortingCallbacks = {
    /**
     * @param {GraphEdge} graphEdgeA
     * @param {GraphEdge} graphEdgeB
     */
    compareCallback: (graphEdgeA, graphEdgeB) => {
      if (graphEdgeA.weight === graphEdgeB.weight) {
        return 1;
      }

      return graphEdgeA.weight <= graphEdgeB.weight ? -1 : 1;
    },
  };
  const sortedEdges = new QuickSort(sortingCallbacks).sort(graph.getAllEdges());

  // Create disjoint sets for all graph vertices.
  const keyCallback = (graphVertex) => graphVertex.getKey();
  const disjointSet = new DisjointSet(keyCallback);

  graph.getAllVertices().forEach((graphVertex) => {
    disjointSet.makeSet(graphVertex);
  });

  recordGraphStep(
    stepCallback,
    graph,
    'start',
    () => ({
      tree: minimumSpanningTree,
      sets: disjointSet,
      seen: graph.getAllVertices().map((vertex) => vertex.getKey()).join(','),
    }),
    'const sortedEdges = new QuickSort(sortingCallbacks).sort(graph.getAllEdges());',
  );

  // Go through all edges started from the minimum one and try to add them
  // to minimum spanning tree. The criteria of adding the edge would be whether
  // it is forms the cycle or not (if it connects two vertices from one disjoint
  // set or not).
  for (let edgeIndex = 0; edgeIndex < sortedEdges.length; edgeIndex += 1) {
    /** @var {GraphEdge} currentEdge */
    const currentEdge = sortedEdges[edgeIndex];

    recordGraphStep(
      stepCallback,
      graph,
      'edge',
      () => ({
        tree: minimumSpanningTree,
        sets: disjointSet,
        current: currentEdge.startVertex.getKey(),
        next: currentEdge.endVertex.getKey(),
        queue: sortedEdges.slice(edgeIndex).map((edge) => `${edge.startVertex.getKey()}-${edge.endVertex.getKey()}:${edge.weight}`).join(','),
        seen: graph.getAllVertices().map((vertex) => vertex.getKey()).join(','),
      }),
      'if (!disjointSet.inSameSet',
    );

    // Check if edge forms the cycle. If it does then skip it.
    if (!disjointSet.inSameSet(currentEdge.startVertex, currentEdge.endVertex)) {
      // Unite two subsets into one.
      disjointSet.union(currentEdge.startVertex, currentEdge.endVertex);

      // Add this edge to spanning tree.
      minimumSpanningTree.addEdge(currentEdge);
      recordGraphStep(
        stepCallback,
        graph,
        'choose',
        () => ({
          tree: minimumSpanningTree,
          sets: disjointSet,
          current: currentEdge.startVertex.getKey(),
          next: currentEdge.endVertex.getKey(),
          seen: graph.getAllVertices().map((vertex) => vertex.getKey()).join(','),
        }),
        'minimumSpanningTree.addEdge(currentEdge);',
      );
    } else {
      recordGraphStep(
        stepCallback,
        graph,
        'skip',
        () => ({
          tree: minimumSpanningTree,
          sets: disjointSet,
          current: currentEdge.startVertex.getKey(),
          next: currentEdge.endVertex.getKey(),
          seen: graph.getAllVertices().map((vertex) => vertex.getKey()).join(','),
        }),
        'if (!disjointSet.inSameSet',
      );
    }
  }

  // Preserve isolated vertices without changing the existing edge-discovery order.
  graph.getAllVertices().forEach((vertex) => {
    if (!minimumSpanningTree.getVertexByKey(vertex.getKey())) {
      minimumSpanningTree.addVertex(vertex);
    }
  });

  recordGraphStep(
    stepCallback,
    graph,
    'done',
    () => ({
      tree: minimumSpanningTree,
      sets: disjointSet,
      seen: graph.getAllVertices().map((vertex) => vertex.getKey()).join(','),
      processed: graph.getAllVertices().map((vertex) => vertex.getKey()).join(','),
    }),
    'return minimumSpanningTree;',
  );
  return minimumSpanningTree;
}
