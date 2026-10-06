import recordStep from '../../../utils/trace/recordStep';

const DEFAULT_BASE = 37;
const DEFAULT_MODULUS = 101;

export default class PolynomialHash {
  /**
   * @param {number} [base] - Base number that is used to create the polynomial.
   * @param {number} [modulus] - Modulus number that keeps the hash from overflowing.
   */
  constructor({ base = DEFAULT_BASE, modulus = DEFAULT_MODULUS } = {}) {
    this.base = base;
    this.modulus = modulus;
  }

  /**
   * Function that creates hash representation of the word.
   *
   * Time complexity: O(word.length).
   *
   * @param {string} word - String that needs to be hashed.
   * @param {function} [stepCallback]
   * @return {number}
   */
  hash(word, stepCallback = undefined) {
    const charCodes = Array.from(word).map((char) => this.charToNumber(char));

    let hash = 0;
    for (let charIndex = 0; charIndex < charCodes.length; charIndex += 1) {
      hash *= this.base;
      hash += charCodes[charIndex];
      hash %= this.modulus;
      recordStep(stepCallback, 'hash', [], [], { charIndex, hash, value: charCodes[charIndex] }, 'hash += charCodes[charIndex]');
    }

    return hash;
  }

  /**
   * Function that creates hash representation of the word
   * based on previous word (shifted by one character left) hash value.
   *
   * Recalculates the hash representation of a word so that it isn't
   * necessary to traverse the whole word again.
   *
   * Time complexity: O(prevWord.length), including the leading-value multiplier.
   *
   * @param {number} prevHash
   * @param {string} prevWord
   * @param {string} newWord
   * @param {function} [stepCallback]
   * @return {number}
   */
  roll(prevHash, prevWord, newWord, stepCallback = undefined) {
    let rollingHash = prevHash;

    const previousCharacters = Array.from(prevWord);
    const nextCharacters = Array.from(newWord);
    const prevValue = this.charToNumber(previousCharacters[0]);
    const newValue = this.charToNumber(nextCharacters.at(-1));

    let prevValueMultiplier = 1;
    for (let i = 1; i < previousCharacters.length; i += 1) {
      prevValueMultiplier *= this.base;
      prevValueMultiplier %= this.modulus;
    }

    rollingHash += this.modulus;
    rollingHash -= (prevValue * prevValueMultiplier) % this.modulus;

    recordStep(stepCallback, 'remove', [], [], { hash: rollingHash, value: prevValue }, 'rollingHash -= (prevValue * prevValueMultiplier) % this.modulus');

    rollingHash *= this.base;
    recordStep(stepCallback, 'shift', [], [], { hash: rollingHash }, 'rollingHash *= this.base');
    rollingHash += newValue;
    rollingHash %= this.modulus;

    recordStep(stepCallback, 'append', [], [], { hash: rollingHash, value: newValue }, 'rollingHash += newValue');
    return rollingHash;
  }

  /**
   * Converts char to number.
   *
   * @param {string} char
   * @param {function} [stepCallback]
   * @return {number}
   */
  charToNumber(char) {
    let charCode = char.codePointAt(0);

    // Check if character has surrogate pair.
    const surrogate = char.codePointAt(1);
    if (surrogate !== undefined) {
      const surrogateShift = 2 ** 16;
      charCode += surrogate * surrogateShift;
    }

    return charCode;
  }
}
