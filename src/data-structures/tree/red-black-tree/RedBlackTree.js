import BinarySearchTree from '../binary-search-tree/BinarySearchTree';
import recordStep from '../../../utils/trace/recordStep';

// Possible colors of red-black tree nodes.
const RED_BLACK_TREE_COLORS = {
  red: 'red',
  black: 'black',
};

// Color property name in meta information of the nodes.
const COLOR_PROP_NAME = 'color';

export default class RedBlackTree extends BinarySearchTree {
  /**
   * @param {*} value
   * @return {BinarySearchTreeNode}
   */
  insert(value, stepCallback) {
    const existing = this.root.find(value);
    if (existing) {
      recordStep(stepCallback, 'duplicate', [existing], [], { value }, 'return existing;');
      return existing;
    }
    const insertedNode = super.insert(value, stepCallback);

    // if (!this.root.left && !this.root.right) {
    if (this.nodeComparator.equal(insertedNode, this.root)) {
      // Make root to always be black.
      this.makeNodeBlack(insertedNode, stepCallback);
    } else {
      // Make all newly inserted nodes to be red.
      this.makeNodeRed(insertedNode, stepCallback);
    }

    // Check all conditions and balance the node.
    this.balance(insertedNode, stepCallback);

    return insertedNode;
  }

  /**
   * @param {*} value
   * @return {boolean}
   */
  remove(value) {
    throw new Error(`Can't remove ${value}. Remove method is not implemented yet`);
  }

  /**
   * @param {BinarySearchTreeNode} node
   */
  balance(node, stepCallback) {
    recordStep(stepCallback, 'rb-balance', [node], [], {}, 'balance(node, stepCallback) {');
    // If it is a root node then nothing to balance here.
    if (this.nodeComparator.equal(node, this.root)) {
      return;
    }

    // If the parent is black then done. Nothing to balance here.
    if (this.isNodeBlack(node.parent)) {
      return;
    }

    const grandParent = node.parent.parent;

    if (node.uncle && this.isNodeRed(node.uncle)) {
      // If node has red uncle then we need to do RECOLORING.

      // Recolor parent and uncle to black.
      this.makeNodeBlack(node.uncle, stepCallback);
      this.makeNodeBlack(node.parent, stepCallback);

      if (!this.nodeComparator.equal(grandParent, this.root)) {
        // Recolor grand-parent to red if it is not root.
        this.makeNodeRed(grandParent, stepCallback);
      } else {
        // If grand-parent is black root don't do anything.
        // Since root already has two black sibling that we've just recolored.
        return;
      }

      // Now do further checking for recolored grand-parent.
      this.balance(grandParent, stepCallback);
    } else if (!node.uncle || this.isNodeBlack(node.uncle)) {
      // If node uncle is black or absent then we need to do ROTATIONS.

      if (grandParent) {
        // Grand parent that we will receive after rotations.
        let newGrandParent;

        if (this.nodeComparator.equal(grandParent.left, node.parent)) {
          // Left case.
          if (this.nodeComparator.equal(node.parent.left, node)) {
            // Left-left case.
            newGrandParent = this.leftLeftRotation(grandParent, stepCallback);
          } else {
            // Left-right case.
            newGrandParent = this.leftRightRotation(grandParent, stepCallback);
          }
        } else {
          // Right case.
          if (this.nodeComparator.equal(node.parent.right, node)) {
            // Right-right case.
            newGrandParent = this.rightRightRotation(grandParent, stepCallback);
          } else {
            // Right-left case.
            newGrandParent = this.rightLeftRotation(grandParent, stepCallback);
          }
        }

        // Set newGrandParent as a root if it doesn't have parent.
        if (newGrandParent && newGrandParent.parent === null) {
          this.root = newGrandParent;

          // Recolor root into black.
          this.makeNodeBlack(this.root, stepCallback);
        }

        // Check if new grand parent don't violate red-black-tree rules.
        this.balance(newGrandParent, stepCallback);
      }
    }
  }

  /** Left-left: rotate right, preserve the middle branch, then exchange colors. */
  leftLeftRotation(grandParentNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [grandParentNode],
      [],
      { rotation: 'LL' },
      'leftLeftRotation(grandParentNode, stepCallback) {',
    );
    const { parent } = grandParentNode;
    const parentNode = grandParentNode.left;
    const middle = parentNode.right;
    grandParentNode.setLeft(null);
    parentNode.setRight(null);
    grandParentNode.setLeft(middle);
    if (parent) {
      parent.replaceChild(grandParentNode, parentNode);
    } else {
      this.root = parentNode;
      parentNode.parent = null;
    }
    parentNode.setRight(grandParentNode);
    this.swapNodeColors(parentNode, grandParentNode); // LL
    recordStep(
      stepCallback,
      'rotation',
      [parentNode],
      [],
      { rotation: 'LL' },
      'this.swapNodeColors(parentNode, grandParentNode); // LL',
    );
    return parentNode;
  }

  /** Left-right: straighten the inner child, then rotate the grandparent right. */
  leftRightRotation(grandParentNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [grandParentNode],
      [],
      { rotation: 'LR' },
      'leftRightRotation(grandParentNode, stepCallback) {',
    );
    const parentNode = grandParentNode.left;
    const childNode = parentNode.right;
    const middle = childNode.left;
    parentNode.setRight(null);
    childNode.setLeft(null);
    parentNode.setRight(middle);
    grandParentNode.setLeft(childNode);
    childNode.setLeft(parentNode);
    recordStep(
      stepCallback,
      'inner-rotation',
      [childNode],
      [],
      { rotation: 'LR' },
      'childNode.setLeft(parentNode);',
    );
    return this.leftLeftRotation(grandParentNode, stepCallback);
  }

  /** Right-right: rotate left and exchange colors. */
  rightRightRotation(grandParentNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [grandParentNode],
      [],
      { rotation: 'RR' },
      'rightRightRotation(grandParentNode, stepCallback) {',
    );
    const { parent } = grandParentNode;
    const parentNode = grandParentNode.right;
    const middle = parentNode.left;
    grandParentNode.setRight(null);
    parentNode.setLeft(null);
    grandParentNode.setRight(middle);
    if (parent) {
      parent.replaceChild(grandParentNode, parentNode);
    } else {
      this.root = parentNode;
      parentNode.parent = null;
    }
    parentNode.setLeft(grandParentNode);
    this.swapNodeColors(parentNode, grandParentNode); // RR
    recordStep(
      stepCallback,
      'rotation',
      [parentNode],
      [],
      { rotation: 'RR' },
      'this.swapNodeColors(parentNode, grandParentNode); // RR',
    );
    return parentNode;
  }

  /** Right-left: straighten the inner child, then rotate the grandparent left. */
  rightLeftRotation(grandParentNode, stepCallback) {
    recordStep(
      stepCallback,
      'rotation-start',
      [grandParentNode],
      [],
      { rotation: 'RL' },
      'rightLeftRotation(grandParentNode, stepCallback) {',
    );
    const parentNode = grandParentNode.right;
    const childNode = parentNode.left;
    const middle = childNode.right;
    parentNode.setLeft(null);
    childNode.setRight(null);
    parentNode.setLeft(middle);
    grandParentNode.setRight(childNode);
    childNode.setRight(parentNode);
    recordStep(
      stepCallback,
      'inner-rotation',
      [childNode],
      [],
      { rotation: 'RL' },
      'childNode.setRight(parentNode);',
    );
    return this.rightRightRotation(grandParentNode, stepCallback);
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {BinarySearchTreeNode}
   */
  makeNodeRed(node, stepCallback) {
    node.meta.set(COLOR_PROP_NAME, RED_BLACK_TREE_COLORS.red);
    recordStep(
      stepCallback,
      'recolor',
      [node],
      [],
      { color: 'red' },
      'node.meta.set(COLOR_PROP_NAME, RED_BLACK_TREE_COLORS.red);',
    );

    return node;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {BinarySearchTreeNode}
   */
  makeNodeBlack(node, stepCallback) {
    node.meta.set(COLOR_PROP_NAME, RED_BLACK_TREE_COLORS.black);
    recordStep(
      stepCallback,
      'recolor',
      [node],
      [],
      { color: 'black' },
      'node.meta.set(COLOR_PROP_NAME, RED_BLACK_TREE_COLORS.black);',
    );

    return node;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {boolean}
   */
  isNodeRed(node) {
    return node.meta.get(COLOR_PROP_NAME) === RED_BLACK_TREE_COLORS.red;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {boolean}
   */
  isNodeBlack(node) {
    return node.meta.get(COLOR_PROP_NAME) === RED_BLACK_TREE_COLORS.black;
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} node
   * @return {boolean}
   */
  isNodeColored(node) {
    return this.isNodeRed(node) || this.isNodeBlack(node);
  }

  /**
   * @param {BinarySearchTreeNode|BinaryTreeNode} firstNode
   * @param {BinarySearchTreeNode|BinaryTreeNode} secondNode
   */
  swapNodeColors(firstNode, secondNode) {
    const firstColor = firstNode.meta.get(COLOR_PROP_NAME);
    const secondColor = secondNode.meta.get(COLOR_PROP_NAME);

    firstNode.meta.set(COLOR_PROP_NAME, secondColor);
    secondNode.meta.set(COLOR_PROP_NAME, firstColor);
  }
}
