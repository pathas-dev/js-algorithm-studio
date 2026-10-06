import LinkedList from '../data-structures/linked-list/LinkedList';
import listTraversal from '../algorithms/linked-list/traversal/traversal';
import breadthFirstSearch from '../algorithms/tree/breadth-first-search/breadthFirstSearch';
import BinaryTreeNode from '../data-structures/tree/BinaryTreeNode';
import depthFirstSearch from '../algorithms/tree/depth-first-search/depthFirstSearch';

function traceTree(values, breadth) {
  if (values.length > 15 || !values.every(Number.isFinite)) throw new Error('traversal-tree-input');
  const nodes = values.map((value) => new BinaryTreeNode(value));
  nodes.forEach((node, index) => {
    if (nodes[index * 2 + 1]) node.setLeft(nodes[index * 2 + 1]);
    if (nodes[index * 2 + 2]) node.setRight(nodes[index * 2 + 2]);
  });
  const tree = nodes.map((node, id) => ({
    id,
    value: node.value,
    depth: Math.floor(Math.log2(id + 1)),
    left: nodes.indexOf(node.left),
    right: nodes.indexOf(node.right),
  }));
  const steps = [];
  const order = [];
  const stack = [];
  const processed = [];
  let queue = '[]';
  const snapshot = (type, code, current = null, next = null) => {
    const currentId = nodes.indexOf(current);
    steps.push({
      type,
      code,
      array: values.map((value, id) => ({ value, id })),
      indices: currentId < 0 ? [] : [currentId],
      variables: {
        mode: breadth ? 'tree-bfs' : 'tree-dfs',
        queue,
        structure: 'binary-tree',
        tree: JSON.stringify(tree),
        current: current ? current.value : '—',
        next: next ? next.value : '—',
        seenIds: JSON.stringify(order),
        processedIds: JSON.stringify(processed),
        stack: stack.map((id) => nodes[id].value).join(' → '),
        order: order.map((id) => nodes[id].value).join(', '),
        result: type === 'done' ? order.map((id) => nodes[id].value).join(', ') || '∅' : '—',
      },
    });
  };
  const entryCode = breadth ? 'while (!nodeQueue.isEmpty()) {'
    : 'depthFirstSearchRecursive(rootNode, processedCallbacks);';
  snapshot('start', entryCode);
  if (nodes.length) {
    const callbacks = {
      enterNode(node) {
        const id = nodes.indexOf(node);
        order.push(id);
        if (!breadth) stack.push(id);
        snapshot('enter', breadth ? 'callbacks.enterNode(currentNode);' : 'callbacks.enterNode(node);', node);
      },
      allowTraversal(node, child) {
        const parentName = breadth ? 'currentNode' : 'node';
        snapshot('edge', child === node.left
          ? `if (${parentName}.left && callbacks.allowTraversal(${parentName}, ${parentName}.left)) {`
          : `if (${parentName}.right && callbacks.allowTraversal(${parentName}, ${parentName}.right)) {`, node, child);
        return true;
      },
      leaveNode(node) {
        processed.push(nodes.indexOf(node));
        if (!breadth) stack.pop();
        snapshot('leave', breadth ? 'callbacks.leaveNode(currentNode);' : 'callbacks.leaveNode(node);', node);
      },
    };
    if (breadth) {
      breadthFirstSearch(nodes[0], callbacks, (step) => {
        queue = step.variables.queue;
        snapshot(step.type, step.code, step.array[0]);
      });
    } else depthFirstSearch(nodes[0], callbacks);
  }
  snapshot('done', entryCode);
  return steps;
}

export default function traceTreeDfs(values) {
  return traceTree(values, false);
}

export function traceTreeBfs(values) {
  return traceTree(values, true);
}

export function traceListForward(values) {
  if (values.length > 12 || !values.every(Number.isFinite)) throw new Error('traversal-list-input');
  const list = new LinkedList();
  values.forEach((value, id) => list.append({ value, id }));
  const nodes = list.toArray();
  const links = JSON.stringify(nodes.map((node) => (
    [node.value.id, node.next ? node.next.value.id : -1]
  )));
  const steps = [];
  const order = [];
  const snapshot = (type, code, current = -1) => steps.push({
    type,
    code,
    array: values.map((value, id) => ({ value, id })),
    indices: current < 0 ? [] : [current],
    variables: {
      mode: 'list-forward',
      structure: 'linked-list',
      links,
      head: nodes.length ? 0 : -1,
      tail: nodes.length - 1,
      current,
      seenIds: JSON.stringify(order),
      order: order.map((id) => values[id]).join(', '),
      result: type === 'done' ? order.map((id) => values[id]).join(', ') || '∅' : '—',
    },
  });
  snapshot('start', 'let currentNode = linkedList.head;');
  listTraversal(list, (item) => {
    order.push(item.id);
    snapshot('visit', 'callback(currentNode.value);', item.id);
  });
  snapshot('done', 'currentNode = currentNode.next;');
  return steps;
}
