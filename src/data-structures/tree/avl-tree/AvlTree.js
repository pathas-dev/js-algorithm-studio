import BinarySearchTree from '../binary-search-tree/BinarySearchTree';
import recordStep from '../../../utils/trace/recordStep';

export default class AvlTree extends BinarySearchTree {
  /**
   * @param {*} value
   */
  insert(value, stepCallback) {
    // Do the normal BST insert.
    super.insert(value, stepCallback);

    // Let's move up to the root and check balance factors along the way.
    let currentNode = this.root.find(value);
    while (currentNode) {
      this.balance(currentNode, stepCallback);
      currentNode = currentNode.parent;
    }
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value, stepCallback) {
    const node = this.root.find(value);
    let currentNode = node;
    if (node) {
      const successor = node.left && node.right ? node.right.findMin() : node;
      currentNode = successor.parent || this.root;
    }
    // Do standard BST removal.
    super.remove(value);
    recordStep(stepCallback, 'remove-balance', [currentNode], [], { value }, 'super.remove(value);');

    // Every ancestor of the physically removed node may need rebalancing.
    while (currentNode) {
      this.balance(currentNode, stepCallback);
      currentNode = currentNode.parent;
    }
  }

  /**
   * @param {BinarySearchTreeNode} node
   */
  balance(node, stepCallback) {
    recordStep(stepCallback, 'balance', [node], [], () => ({
      balance: node.balanceFactor,
    }), 'balance(node, stepCallback) {');
    // If balance factor is not OK then try to balance the node.
    if (node.balanceFactor > 1) {
      // Left rotation.
      if (node.left.balanceFactor >= 0) {
        // Left-Left rotation
        this.rotateLeftLeft(node, stepCallback);
      } else if (node.left.balanceFactor < 0) {
        // Left-Right rotation.
        this.rotateLeftRight(node, stepCallback);
      }
    } else if (node.balanceFactor < -1) {
      // Right rotation.
      if (node.right.balanceFactor <= 0) {
        // Right-Right rotation
        this.rotateRightRight(node, stepCallback);
      } else if (node.right.balanceFactor > 0) {
        // Right-Left rotation.
        this.rotateRightLeft(node, stepCallback);
      }
    }
  }

  /**
   * @param {BinarySearchTreeNode} rootNode
   */
  rotateLeftLeft(rootNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [rootNode],
      [],
      { rotation: 'LL' },
      'rotateLeftLeft(rootNode, stepCallback) {',
    );
    const { parent } = rootNode;
    const leftNode = rootNode.left;
    const middle = leftNode.right;
    rootNode.setLeft(null);
    leftNode.setRight(null);
    rootNode.setLeft(middle);
    if (parent) {
      parent.replaceChild(rootNode, leftNode);
    } else {
      this.root = leftNode;
      leftNode.parent = null;
    }
    leftNode.setRight(rootNode);
    recordStep(
      stepCallback,
      'rotation',
      [leftNode],
      [],
      { rotation: 'LL' },
      'leftNode.setRight(rootNode);',
    );
  }

  /** Left-right: rotate the left child left, then the node right. */
  rotateLeftRight(rootNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [rootNode],
      [],
      { rotation: 'LR' },
      'rotateLeftRight(rootNode, stepCallback) {',
    );
    this.rotateRightRight(rootNode.left, stepCallback);
    this.rotateLeftLeft(rootNode, stepCallback);
  }

  /** Right-left: rotate the right child right, then the node left. */
  rotateRightLeft(rootNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [rootNode],
      [],
      { rotation: 'RL' },
      'rotateRightLeft(rootNode, stepCallback) {',
    );
    this.rotateLeftLeft(rootNode.right, stepCallback);
    this.rotateRightRight(rootNode, stepCallback);
  }

  /** Right-right: a left rotation preserves the middle subtree. */
  rotateRightRight(rootNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [rootNode],
      [],
      { rotation: 'RR' },
      'rotateRightRight(rootNode, stepCallback) {',
    );
    const { parent } = rootNode;
    const rightNode = rootNode.right;
    const middle = rightNode.left;
    rootNode.setRight(null);
    rightNode.setLeft(null);
    rootNode.setRight(middle);
    if (parent) {
      parent.replaceChild(rootNode, rightNode);
    } else {
      this.root = rightNode;
      rightNode.parent = null;
    }
    rightNode.setLeft(rootNode);
    recordStep(
      stepCallback,
      'rotation',
      [rightNode],
      [],
      { rotation: 'RR' },
      'rightNode.setLeft(rootNode);',
    );
  }
}
