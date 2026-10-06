import recordGraphStep from '../../../utils/trace/recordGraphStep';
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * Detect cycle in undirected graph using Depth First Search.
 *
 * @param {Graph} graph
 */
export default function detectUndirectedCycle(graph, stepCallback) {
  let cycle = null;

  // List of vertices that we have visited.
  const visitedVertices = {};

  // List of parents vertices for every visited vertex.
  const parents = {};

  const processed = [];
  const stack = [];
  const state = (currentVertex, nextVertex) => ({
    mode: 'dfs',
    seen: Object.keys(visitedVertices).join(','),
    processed: processed.join(','),
    stack: stack.join(','),
    order: cycle ? Object.keys(cycle).join(',') : '',
    result: cycle ? 'cycle' : 'acyclic',
    chosen: JSON.stringify(cycle ? Object.entries(cycle).map(
      ([key, parent]) => [parent.getKey(), graph.getVertexByKey(key).getKey()],
    ) : []),
    ...(currentVertex ? { current: currentVertex.getKey() } : {}),
    ...(nextVertex ? { next: nextVertex.getKey() } : {}),
  });
  recordGraphStep(stepCallback, graph, 'start', () => state(), 'const visitedVertices = {};');

  // Callbacks for DFS traversing.
  const callbacks = {
    allowTraversal: ({ currentVertex, nextVertex }) => {
      // Don't allow further traversal in case if cycle has been detected.
      if (cycle) {
        return false;
      }

      // Don't allow traversal from child back to its parent.
      const currentVertexParent = parents[currentVertex.getKey()];
      const currentVertexParentKey = currentVertexParent ? currentVertexParent.getKey() : null;

      recordGraphStep(stepCallback, graph, 'edge', () => state(currentVertex, nextVertex), 'return currentVertexParentKey !== nextVertex.getKey();');
      return currentVertexParentKey !== nextVertex.getKey();
    },
    enterVertex: ({ currentVertex, previousVertex }) => {
      if (visitedVertices[currentVertex.getKey()]) {
        // Compile cycle path based on parents of previous vertices.
        cycle = {};

        let currentCycleVertex = currentVertex;
        let previousCycleVertex = previousVertex;

        while (previousCycleVertex.getKey() !== currentVertex.getKey()) {
          cycle[currentCycleVertex.getKey()] = previousCycleVertex;
          currentCycleVertex = previousCycleVertex;
          previousCycleVertex = parents[previousCycleVertex.getKey()];
        }

        cycle[currentCycleVertex.getKey()] = previousCycleVertex;
        recordGraphStep(stepCallback, graph, 'cycle', () => state(currentVertex), 'cycle = {};');
      } else {
        // Add next vertex to visited set.
        visitedVertices[currentVertex.getKey()] = currentVertex;
        parents[currentVertex.getKey()] = previousVertex;
        stack.push(currentVertex.getKey());
        recordGraphStep(stepCallback, graph, 'enter', () => state(currentVertex), 'visitedVertices[currentVertex.getKey()] = currentVertex;');
      }
    },
    leaveVertex: ({ currentVertex }) => {
      processed.push(currentVertex.getKey());
      stack.pop();
      recordGraphStep(stepCallback, graph, 'leave', () => state(currentVertex), 'stack.pop();');
    },
  };

  // Start DFS traversing.
  graph.getAllVertices().forEach((startVertex) => {
    if (!cycle && !visitedVertices[startVertex.getKey()]) {
      depthFirstSearch(graph, startVertex, callbacks);
    }
  });

  recordGraphStep(stepCallback, graph, 'done', () => state(), 'return cycle;');
  return cycle;
}
