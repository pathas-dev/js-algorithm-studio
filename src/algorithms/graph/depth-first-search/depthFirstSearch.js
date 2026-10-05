import recordStep from '../../../utils/trace/recordStep';

/**
 * @typedef {Object} Callbacks
 *
 * @property {function(vertices: Object): boolean} [allowTraversal] -
 *  Determines whether DFS should traverse from the vertex to its neighbor
 *  (along the edge). By default prohibits visiting the same vertex again.
 *
 * @property {function(vertices: Object)} [enterVertex] - Called when DFS enters the vertex.
 *
 * @property {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @property {function(vertices: Object)} [leaveVertex] - Called when DFS leaves the vertex.
 */

/**
 * @param {Callbacks} [callbacks]
 * @returns {Callbacks}
 */
function initCallbacks(callbacks = {}) {
  const initiatedCallback = callbacks;

  const stubCallback = () => {};

  const allowTraversalCallback = (
    () => {
      const seen = {};
      return ({ nextVertex }) => {
        if (!seen[nextVertex.getKey()]) {
          seen[nextVertex.getKey()] = true;
          return true;
        }
        return false;
      };
    }
  )();

  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enterVertex = callbacks.enterVertex || stubCallback;
  initiatedCallback.leaveVertex = callbacks.leaveVertex || stubCallback;

  return initiatedCallback;
}

/**
 * @param {Graph} graph
 * @param {GraphVertex} currentVertex
 * @param {GraphVertex} previousVertex
 * @param {Callbacks} callbacks
 */
function depthFirstSearchRecursive(graph, currentVertex, previousVertex, callbacks, depth = 0) {
  callbacks.enterVertex({ currentVertex, previousVertex });
  recordStep(callbacks.stepCallback, 'enter', () => graph.getAllVertices(), [], () => ({ current: currentVertex.getKey(), depth }), 'callbacks.enterVertex({ currentVertex, previousVertex });');

  graph.getNeighbors(currentVertex).forEach((nextVertex) => {
    recordStep(callbacks.stepCallback, 'edge', () => graph.getAllVertices(), [], () => ({ current: currentVertex.getKey(), next: nextVertex.getKey(), depth }), 'if (callbacks.allowTraversal');
    if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
      depthFirstSearchRecursive(graph, nextVertex, currentVertex, callbacks, depth + 1);
    }
  });

  callbacks.leaveVertex({ currentVertex, previousVertex });
  recordStep(callbacks.stepCallback, 'leave', () => graph.getAllVertices(), [], () => ({ current: currentVertex.getKey(), parent: previousVertex ? previousVertex.getKey() : '', depth }), 'callbacks.leaveVertex({ currentVertex, previousVertex });');
}

/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {Callbacks} [callbacks]
 */
export default function depthFirstSearch(graph, startVertex, callbacks) {
  const previousVertex = null;
  const initialized = initCallbacks(callbacks);
  recordStep(initialized.stepCallback, 'start', () => graph.getAllVertices(), [], () => ({ current: startVertex.getKey(), depth: 0 }), 'const previousVertex = null;');
  depthFirstSearchRecursive(graph, startVertex, previousVertex, initialized);
  recordStep(initialized.stepCallback, 'done', () => graph.getAllVertices(), [], {}, 'depthFirstSearchRecursive(graph, startVertex');
}
