import recordGraphStep from '../../../utils/trace/recordGraphStep';
import Stack from '../../../data-structures/stack/Stack';
import depthFirstSearch from '../depth-first-search/depthFirstSearch';

/**
 * @param {Graph} graph
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 */
export default function topologicalSort(graph, stepCallback) {
  if (!graph.isDirected) throw new Error('directed');
  // Create a set of all vertices we want to visit.
  const unvisitedSet = {};
  graph.getAllVertices().forEach((vertex) => {
    unvisitedSet[vertex.getKey()] = vertex;
  });

  // Create a set for all vertices that we've already visited.
  const visitedSet = {};

  // Create a stack of already ordered vertices.
  const sortedStack = new Stack();
  const activeSet = new Set();
  const callStack = [];
  const processed = [];
  recordGraphStep(
    stepCallback,
    graph,
    'start',
    () => ({
      seen: '', processed: '', stack: '', order: '',
    }),
    'const sortedStack = new Stack();',
  );

  const dfsCallbacks = {
    enterVertex: ({ currentVertex }) => {
      // Add vertex to visited set in case if all its children has been explored.
      visitedSet[currentVertex.getKey()] = currentVertex;

      // Remove this vertex from unvisited set.
      delete unvisitedSet[currentVertex.getKey()];
      activeSet.add(currentVertex.getKey());
      callStack.push(currentVertex.getKey());
      recordGraphStep(
        stepCallback,
        graph,
        'enter',
        () => ({
          current: currentVertex.getKey(),
          stack: callStack.join(','),
          seen: Object.keys(visitedSet).join(','),
          processed: processed.join(','),
          order: sortedStack.toArray().map((vertex) => vertex.getKey()).join(','),
        }),
        'visitedSet[currentVertex.getKey()] = currentVertex;',
      );
    },
    leaveVertex: ({ currentVertex }) => {
      // If the vertex has been totally explored then we may push it to stack.
      sortedStack.push(currentVertex);
      activeSet.delete(currentVertex.getKey());
      callStack.pop();
      processed.push(currentVertex.getKey());
      recordGraphStep(
        stepCallback,
        graph,
        'leave',
        () => ({
          current: currentVertex.getKey(),
          stack: callStack.join(','),
          seen: Object.keys(visitedSet).join(','),
          processed: processed.join(','),
          order: sortedStack.toArray().map((vertex) => vertex.getKey()).join(','),
        }),
        'sortedStack.push(currentVertex);',
      );
    },
    allowTraversal: ({ currentVertex, nextVertex }) => {
      recordGraphStep(
        stepCallback,
        graph,
        'edge',
        () => ({
          current: currentVertex.getKey(),
          next: nextVertex.getKey(),
          stack: callStack.join(','),
          seen: Object.keys(visitedSet).join(','),
          processed: processed.join(','),
          order: sortedStack.toArray().map((vertex) => vertex.getKey()).join(','),
        }),
        'if (activeSet.has(nextVertex.getKey()))',
      );
      if (activeSet.has(nextVertex.getKey())) throw new Error('cycle');
      return !visitedSet[nextVertex.getKey()];
    },
  };

  // Let's go and do DFS for all unvisited nodes.
  while (Object.keys(unvisitedSet).length) {
    const currentVertexKey = Object.keys(unvisitedSet)[0];
    const currentVertex = unvisitedSet[currentVertexKey];

    // Do DFS for current node.
    depthFirstSearch(graph, currentVertex, dfsCallbacks);
  }

  recordGraphStep(
    stepCallback,
    graph,
    'done',
    () => ({
      stack: '',
      seen: Object.keys(visitedSet).join(','),
      processed: processed.join(','),
      order: sortedStack.toArray().map((vertex) => vertex.getKey()).join(','),
    }),
    'return sortedStack.toArray();',
  );
  return sortedStack.toArray();
}
