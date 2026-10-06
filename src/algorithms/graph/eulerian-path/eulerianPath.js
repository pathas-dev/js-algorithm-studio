import recordGraphStep from '../../../utils/trace/recordGraphStep';
import graphBridges from '../bridges/graphBridges';

/**
 * Fleury's algorithm of finding Eulerian Path (visit all graph edges exactly once).
 *
 * @param {Graph} graph
 * @return {GraphVertex[]}
 */
export default function eulerianPath(graph, stepCallback) {
  const eulerianPathVertices = [];
  const chosen = [];
  const vertices = graph.getAllVertices();
  const active = vertices.filter((vertex) => vertex.getDegree());
  const connected = new Set();
  const pending = active.length ? [active[0]] : [];
  while (pending.length) {
    const vertex = pending.pop();
    if (!connected.has(vertex)) {
      connected.add(vertex);
      pending.push(...vertex.getNeighbors());
    }
  }
  if (connected.size !== active.length) throw new Error('eulerian');
  const state = (current, next) => ({
    current: current ? current.getKey() : '',
    next: next ? next.getKey() : '',
    seen: eulerianPathVertices.map((vertex) => vertex.getKey()).join(','),
    processed: '',
    order: eulerianPathVertices.map((vertex) => vertex.getKey()).join(','),
    chosen: JSON.stringify(chosen),
    remaining: graph.getAllEdges().length,
    result: eulerianPathVertices.map((vertex) => vertex.getKey()).join(' → ') || '∅',
  });
  recordGraphStep(stepCallback, graph, 'start', () => state(), 'const eulerianPathVertices = [];');

  // Set that contains all vertices with even rank (number of neighbors).
  const evenRankVertices = {};

  // Set that contains all vertices with odd rank (number of neighbors).
  const oddRankVertices = {};

  // Set of all not visited edges.
  const notVisitedEdges = {};
  graph.getAllEdges().forEach((vertex) => {
    notVisitedEdges[vertex.getKey()] = vertex;
  });

  // Detect whether graph contains Eulerian Circuit or Eulerian Path or none of them.
  /** @params {GraphVertex} vertex */
  graph.getAllVertices().forEach((vertex) => {
    if (vertex.getDegree() % 2) {
      oddRankVertices[vertex.getKey()] = vertex;
    } else {
      evenRankVertices[vertex.getKey()] = vertex;
    }
  });

  // Check whether we're dealing with Eulerian Circuit or Eulerian Path only.
  // Graph would be an Eulerian Circuit in case if all its vertices has even degree.
  // If not all vertices have even degree then graph must contain only two odd-degree
  // vertices in order to have Euler Path.
  const isCircuit = !Object.values(oddRankVertices).length;

  if (!isCircuit && Object.values(oddRankVertices).length !== 2) {
    throw new Error('eulerian');
  }

  // Pick start vertex for traversal.
  let startVertex = null;

  if (isCircuit) {
    // For Eulerian Circuit it doesn't matter from what vertex to start thus we'll just
    // peek a first node.
    const evenVertexKey = Object.keys(evenRankVertices)[0];
    startVertex = active[0] || evenRankVertices[evenVertexKey];
  } else {
    // For Eulerian Path we need to start from one of two odd-degree vertices.
    const oddVertexKey = Object.keys(oddRankVertices)[0];
    startVertex = oddRankVertices[oddVertexKey];
  }

  if (!graph.getAllEdges().length) {
    if (startVertex) eulerianPathVertices.push(startVertex);
    recordGraphStep(stepCallback, graph, 'done', () => state(), 'return startVertex ? [startVertex] : [];');
    return startVertex ? [startVertex] : [];
  }
  recordGraphStep(stepCallback, graph, 'degree', () => ({ ...state(startVertex), odd: Object.keys(oddRankVertices).join(',') || '∅' }), 'const isCircuit = !Object.values(oddRankVertices).length;');

  // Start traversing the graph.
  let currentVertex = startVertex;
  while (Object.values(notVisitedEdges).length) {
    // Add current vertex to Eulerian path.
    eulerianPathVertices.push(currentVertex);

    // Detect all bridges in graph.
    // We need to do it in order to not delete bridges if there are other edges
    // exists for deletion.
    const bridges = graphBridges(graph);
    recordGraphStep(stepCallback, graph, 'bridges', () => ({ ...state(currentVertex), bridges: Object.keys(bridges).join(',') }), 'const bridges = graphBridges(graph);');

    // Peek the next edge to delete from graph.
    const currentEdges = currentVertex.getEdges();
    /** @var {GraphEdge} edgeToDelete */
    let edgeToDelete = null;
    if (currentEdges.length === 1) {
      // If there is only one edge left we need to peek it.
      [edgeToDelete] = currentEdges;
    } else {
      // If there are many edges left then we need to peek any of those except bridges.
      [edgeToDelete] = currentEdges.filter((edge) => !bridges[edge.getKey()]);
    }

    if (!edgeToDelete) throw new Error('eulerian');
    chosen.push([edgeToDelete.startVertex.getKey(), edgeToDelete.endVertex.getKey()]);

    // Detect next current vertex.
    if (currentVertex.getKey() === edgeToDelete.startVertex.getKey()) {
      currentVertex = edgeToDelete.endVertex;
    } else {
      currentVertex = edgeToDelete.startVertex;
    }

    // Delete edge from not visited edges set.
    delete notVisitedEdges[edgeToDelete.getKey()];

    // If last edge were deleted then add finish vertex to Eulerian Path.
    if (Object.values(notVisitedEdges).length === 0) {
      eulerianPathVertices.push(currentVertex);
    }

    // Delete the edge from graph.
    graph.deleteEdge(edgeToDelete);
    recordGraphStep(stepCallback, graph, 'take-edge', () => state(currentVertex), 'graph.deleteEdge(edgeToDelete);');
  }

  recordGraphStep(stepCallback, graph, 'done', () => state(), 'return eulerianPathVertices;');
  return eulerianPathVertices;
}
