import recordStep from '../../../utils/trace/recordStep';
import Queue from '../../../data-structures/queue/Queue';

/**
 * @typedef {Object} Callbacks
 * @property {function(node: BinaryTreeNode, child: BinaryTreeNode): boolean} allowTraversal -
 *   Determines whether BFS should traverse from the node to its child.
 * @property {function(node: BinaryTreeNode)} enterNode - Called when BFS enters the node.
 * @property {function(node: BinaryTreeNode)} leaveNode - Called when BFS leaves the node.
 */

/**
 * @param {Callbacks} [callbacks]
 * @returns {Callbacks}
 */
function initCallbacks(callbacks = {}) {
  const initiatedCallback = callbacks;

  const stubCallback = () => {};
  const defaultAllowTraversal = () => true;

  initiatedCallback.allowTraversal = callbacks.allowTraversal || defaultAllowTraversal;
  initiatedCallback.enterNode = callbacks.enterNode || stubCallback;
  initiatedCallback.leaveNode = callbacks.leaveNode || stubCallback;

  return initiatedCallback;
}

/**
 * @param {BinaryTreeNode} rootNode
 * @param {Callbacks} [originalCallbacks]
 */
export default function breadthFirstSearch(rootNode, originalCallbacks, stepCallback) {
  const callbacks = initCallbacks(originalCallbacks);
  const nodeQueue = new Queue();

  const queueState = () => ({
    queue: JSON.stringify(nodeQueue.linkedList.toArray().map((entry) => entry.value.value)),
  });
  // Do initial queue setup.
  nodeQueue.enqueue(rootNode);
  recordStep(stepCallback, 'enqueue', [rootNode], [], queueState, 'nodeQueue.enqueue(rootNode);');

  while (!nodeQueue.isEmpty()) {
    const currentNode = nodeQueue.dequeue();
    recordStep(stepCallback, 'dequeue', [currentNode], [], queueState, 'const currentNode = nodeQueue.dequeue();');

    callbacks.enterNode(currentNode);

    // Add all children to the queue for future traversals.

    // Traverse left branch.
    if (currentNode.left && callbacks.allowTraversal(currentNode, currentNode.left)) {
      nodeQueue.enqueue(currentNode.left);
      recordStep(stepCallback, 'enqueue', [currentNode.left], [], queueState, 'nodeQueue.enqueue(currentNode.left);');
    }

    // Traverse right branch.
    if (currentNode.right && callbacks.allowTraversal(currentNode, currentNode.right)) {
      nodeQueue.enqueue(currentNode.right);
      recordStep(stepCallback, 'enqueue', [currentNode.right], [], queueState, 'nodeQueue.enqueue(currentNode.right);');
    }

    callbacks.leaveNode(currentNode);
  }
}
