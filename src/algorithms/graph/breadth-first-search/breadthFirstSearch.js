import recordStep from '../../../utils/trace/recordStep';
import Queue from '../../../data-structures/queue/Queue';

/**
 * @typedef {Object} Callbacks
 *
 * @property {function(vertices: Object): boolean} [allowTraversal] -
 *   Determines whether DFS should traverse from the vertex to its neighbor
 *   (along the edge). By default prohibits visiting the same vertex again.
 *
 * @property {function(vertices: Object)} [enterVertex] - Called when BFS enters the vertex.
 *
 * @property {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @property {function(vertices: Object)} [leaveVertex] - Called when BFS leaves the vertex.
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
 * @param {GraphVertex} startVertex
 * @param {Callbacks} [originalCallbacks]
 */
export default function breadthFirstSearch(graph, startVertex, originalCallbacks) {
  const callbacks = initCallbacks(originalCallbacks);
  const vertexQueue = new Queue();

  // Do initial queue setup.
  vertexQueue.enqueue(startVertex);
  recordStep(callbacks.stepCallback, 'start', () => graph.getAllVertices(), [], () => ({ current: startVertex.getKey(), queue: vertexQueue.toString() }), 'vertexQueue.enqueue(startVertex);');

  let previousVertex = null;

  // Traverse all vertices from the queue.
  while (!vertexQueue.isEmpty()) {
    const currentVertex = vertexQueue.dequeue();
    callbacks.enterVertex({ currentVertex, previousVertex });
    recordStep(callbacks.stepCallback, 'enter', () => graph.getAllVertices(), [], () => ({ current: currentVertex.getKey(), queue: vertexQueue.toString() }), 'const currentVertex = vertexQueue.dequeue();');

    // Add all neighbors to the queue for future traversals.
    graph.getNeighbors(currentVertex).forEach((nextVertex) => {
      recordStep(callbacks.stepCallback, 'edge', () => graph.getAllVertices(), [], () => ({ current: currentVertex.getKey(), next: nextVertex.getKey(), queue: vertexQueue.toString() }), 'if (callbacks.allowTraversal');
      if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
        vertexQueue.enqueue(nextVertex);
        recordStep(callbacks.stepCallback, 'enqueue', () => graph.getAllVertices(), [], () => ({ current: currentVertex.getKey(), next: nextVertex.getKey(), queue: vertexQueue.toString() }), 'vertexQueue.enqueue(nextVertex);');
      }
    });

    callbacks.leaveVertex({ currentVertex, previousVertex });
    recordStep(callbacks.stepCallback, 'leave', () => graph.getAllVertices(), [], () => ({ current: currentVertex.getKey(), queue: vertexQueue.toString() }), 'callbacks.leaveVertex({ currentVertex, previousVertex });');

    // Memorize current vertex before next loop.
    previousVertex = currentVertex;
  }
  recordStep(callbacks.stepCallback, 'done', () => graph.getAllVertices(), [], { queue: '' }, 'while (!vertexQueue.isEmpty())');
}
