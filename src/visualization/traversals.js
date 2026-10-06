import BinaryTreeNode from '../data-structures/tree/BinaryTreeNode';
import depthFirstSearch from '../algorithms/tree/depth-first-search/depthFirstSearch';

export default function traceTreeDfs(values) {
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
  const snapshot = (type, code, current = null, next = null) => {
    const currentId = nodes.indexOf(current);
    steps.push({
      type,
      code,
      array: values.map((value, id) => ({ value, id })),
      indices: currentId < 0 ? [] : [currentId],
      variables: {
        mode: 'tree-dfs',
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
  snapshot('start', 'depthFirstSearchRecursive(rootNode, processedCallbacks);');
  if (nodes.length) {
    depthFirstSearch(nodes[0], {
      enterNode(node) {
        const id = nodes.indexOf(node);
        order.push(id);
        stack.push(id);
        snapshot('enter', 'callbacks.enterNode(node);', node);
      },
      allowTraversal(node, child) {
        snapshot('edge', child === node.left
          ? 'if (node.left && callbacks.allowTraversal(node, node.left)) {'
          : 'if (node.right && callbacks.allowTraversal(node, node.right)) {', node, child);
        return true;
      },
      leaveNode(node) {
        processed.push(nodes.indexOf(node));
        stack.pop();
        snapshot('leave', 'callbacks.leaveNode(node);', node);
      },
    });
  }
  snapshot('done', 'depthFirstSearchRecursive(rootNode, processedCallbacks);');
  return steps;
}
