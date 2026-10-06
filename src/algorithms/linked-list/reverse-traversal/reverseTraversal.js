import recordStep from '../../../utils/trace/recordStep';

/**
 * Traversal callback function.
 * @callback traversalCallback
 * @param {*} nodeValue
 */

/**
 * @param {LinkedListNode} node
 * @param {traversalCallback} callback
 */
function reverseTraversalRecursive(node, callback, stepCallback) {
  if (!node) {
    recordStep(stepCallback, 'base', [], [], {}, 'if (node) {');
  }
  if (node) {
    recordStep(
      stepCallback,
      'enter',
      [node.value],
      [],
      {},
      'reverseTraversalRecursive(node.next, callback, stepCallback);',
    );
    reverseTraversalRecursive(node.next, callback, stepCallback);
    callback(node.value);
    recordStep(stepCallback, 'leave', [node.value], [], {}, 'callback(node.value);');
  }
}

/**
 * @param {LinkedList} linkedList
 * @param {traversalCallback} callback
 */
export default function reverseTraversal(linkedList, callback, stepCallback) {
  reverseTraversalRecursive(linkedList.head, callback, stepCallback);
}
