import recordGraphStep from '../../../utils/trace/recordGraphStep';
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * Detect cycle in directed graph using Depth First Search.
 *
 * @param {Graph} graph
 */
export default function detectDirectedCycle(graph, stepCallback) {
  let cycle = null;

  // Will store parents (previous vertices) for all visited nodes.
  // This will be needed in order to specify what path exactly is a cycle.
  const dfsParentMap = {};

  // White set (UNVISITED) contains all the vertices that haven't been visited at all.
  const whiteSet = {};

  // Gray set (VISITING) contains all the vertices that are being visited right now
  // (in current path).
  const graySet = {};

  // Black set (VISITED) contains all the vertices that has been fully visited.
  // Meaning that all children of the vertex has been visited.
  const blackSet = {};

  // If we encounter vertex in gray set it means that we've found a cycle.
  // Because when vertex in gray set it means that its neighbors or its neighbors
  // neighbors are still being explored.

  // Init white set and add all vertices to it.
  /** @param {GraphVertex} vertex */
  graph.getAllVertices().forEach((vertex) => {
    whiteSet[vertex.getKey()] = vertex;
  });

  const state = (currentVertex, nextVertex) => ({
    mode: 'dfs',
    seen: [...Object.keys(graySet), ...Object.keys(blackSet)].join(','),
    processed: Object.keys(blackSet).join(','),
    stack: Object.keys(graySet).join(','),
    order: cycle ? Object.keys(cycle).join(',') : '',
    result: cycle ? 'cycle' : 'acyclic',
    chosen: JSON.stringify(cycle ? Object.entries(cycle).map(
      ([key, parent]) => [parent.getKey(), graph.getVertexByKey(key).getKey()],
    ) : []),
    ...(currentVertex ? { current: currentVertex.getKey() } : {}),
    ...(nextVertex ? { next: nextVertex.getKey() } : {}),
  });
  recordGraphStep(stepCallback, graph, 'start', () => state(), 'const whiteSet = {};');

  // Describe BFS callbacks.
  const callbacks = {
    enterVertex: ({ currentVertex, previousVertex }) => {
      if (graySet[currentVertex.getKey()]) {
        // If current vertex already in grey set it means that cycle is detected.
        // Let's detect cycle path.
        cycle = {};

        let currentCycleVertex = currentVertex;
        let previousCycleVertex = previousVertex;

        while (previousCycleVertex.getKey() !== currentVertex.getKey()) {
          cycle[currentCycleVertex.getKey()] = previousCycleVertex;
          currentCycleVertex = previousCycleVertex;
          previousCycleVertex = dfsParentMap[previousCycleVertex.getKey()];
        }

        cycle[currentCycleVertex.getKey()] = previousCycleVertex;
        recordGraphStep(stepCallback, graph, 'cycle', () => state(currentVertex), 'cycle = {};');
      } else {
        // Otherwise let's add current vertex to gray set and remove it from white set.
        graySet[currentVertex.getKey()] = currentVertex;
        delete whiteSet[currentVertex.getKey()];

        // Update DFS parents list.
        dfsParentMap[currentVertex.getKey()] = previousVertex;
        recordGraphStep(stepCallback, graph, 'enter', () => state(currentVertex), 'graySet[currentVertex.getKey()] = currentVertex;');
      }
    },
    leaveVertex: ({ currentVertex }) => {
      // If all node's children has been visited let's remove it from gray set
      // and move it to the black set meaning that all its neighbors are visited.
      blackSet[currentVertex.getKey()] = currentVertex;
      delete graySet[currentVertex.getKey()];
      recordGraphStep(stepCallback, graph, 'leave', () => state(currentVertex), 'delete graySet[currentVertex.getKey()];');
    },
    allowTraversal: ({ currentVertex, nextVertex }) => {
      recordGraphStep(stepCallback, graph, 'edge', () => state(currentVertex, nextVertex), 'return !blackSet[nextVertex.getKey()];');
      // If cycle was detected we must forbid all further traversing since it will
      // cause infinite traversal loop.
      if (cycle) {
        return false;
      }

      // Allow traversal only for the vertices that are not in black set
      // since all black set vertices have been already visited.
      return !blackSet[nextVertex.getKey()];
    },
  };

  // Start exploring vertices.
  while (Object.keys(whiteSet).length) {
    // Pick fist vertex to start BFS from.
    const firstWhiteKey = Object.keys(whiteSet)[0];
    const startVertex = whiteSet[firstWhiteKey];

    // Do Depth First Search.
    depthFirstSearch(graph, startVertex, callbacks);
  }

  recordGraphStep(stepCallback, graph, 'done', () => state(), 'return cycle;');
  return cycle;
}
