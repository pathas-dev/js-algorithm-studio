import TrieNode from './TrieNode';
import recordStep from '../../utils/trace/recordStep';

// Character that we will use for trie tree root.
const HEAD_CHARACTER = '*';

export default class Trie {
  constructor() {
    this.head = new TrieNode(HEAD_CHARACTER);
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  addWord(word, stepCallback) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      const isComplete = charIndex === characters.length - 1;
      currentNode = currentNode.addChild(characters[charIndex], isComplete);
      recordStep(stepCallback, 'add-character', [currentNode], [], { charIndex, character: characters[charIndex] }, 'currentNode = currentNode.addChild(characters[charIndex], isComplete);');
    }

    return this;
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  deleteWord(word, stepCallback) {
    const characters = Array.from(word);
    const depthFirstDelete = (currentNode, charIndex = 0) => {
      if (charIndex >= characters.length) {
        // Return if we're trying to delete the character that is out of word's scope.
        return;
      }

      const character = characters[charIndex];
      recordStep(stepCallback, 'delete-inspect', [currentNode], [], { charIndex, character }, 'const nextNode = currentNode.getChild(character);');
      const nextNode = currentNode.getChild(character);

      if (nextNode == null) {
        // Return if we're trying to delete a word that has not been added to the Trie.
        return;
      }

      // Go deeper.
      depthFirstDelete(nextNode, charIndex + 1);

      // Since we're going to delete a word let's un-mark its last character isCompleteWord flag.
      if (charIndex === (characters.length - 1)) {
        nextNode.isCompleteWord = false;
      }

      // childNode is deleted only if:
      // - childNode has NO children
      // - childNode.isCompleteWord === false
      currentNode.removeChild(character);
      recordStep(stepCallback, 'delete-prune', [currentNode], [], { charIndex, character }, 'currentNode.removeChild(character);');
    };

    // Start depth-first deletion from the head node.
    depthFirstDelete(this.head);

    return this;
  }

  /**
   * @param {string} word
   * @return {string[]}
   */
  suggestNextCharacters(word, stepCallback) {
    const lastCharacter = this.getLastCharacterNode(word, stepCallback);

    if (!lastCharacter) {
      return null;
    }

    return lastCharacter.suggestChildren();
  }

  /**
   * Check if complete word exists in Trie.
   *
   * @param {string} word
   * @return {boolean}
   */
  doesWordExist(word, stepCallback) {
    const lastCharacter = this.getLastCharacterNode(word, stepCallback);

    return !!lastCharacter && lastCharacter.isCompleteWord;
  }

  /**
   * @param {string} word
   * @return {TrieNode}
   */
  getLastCharacterNode(word, stepCallback) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      recordStep(stepCallback, 'inspect-character', [currentNode], [], { charIndex, character: characters[charIndex] }, 'if (!currentNode.hasChild(characters[charIndex])) {');
      if (!currentNode.hasChild(characters[charIndex])) {
        return null;
      }

      currentNode = currentNode.getChild(characters[charIndex]);
    }

    return currentNode;
  }
}
