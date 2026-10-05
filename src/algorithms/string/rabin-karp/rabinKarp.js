import PolynomialHash from '../../cryptography/polynomial-hash/PolynomialHash';
import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {string} text - Text that may contain the searchable word.
 * @param {string} word - Word that is being searched in text.
 * @return {number} - Position of the word in text.
 */
export default function rabinKarp(text, word, stepCallback) {
  const hasher = new PolynomialHash();

  // Calculate word hash that we will use for comparison with other substring hashes.
  const wordHash = hasher.hash(word);
  recordStep(stepCallback, 'word-hash', [], [], { wordHash }, 'const wordHash = hasher.hash(word);');

  let prevFrame = null;
  let currentFrameHash = null;

  // Go through all substring of the text that may match.
  for (let charIndex = 0; charIndex <= (text.length - word.length); charIndex += 1) {
    const currentFrame = text.substring(charIndex, charIndex + word.length);

    // Calculate the hash of current substring.
    const prevHash = currentFrameHash;
    // UTF-16 windows may split a pair; PolynomialHash hashes code points.
    // Recompute when either window contains a pair instead of rolling different token counts.
    const rehash = Array.from(currentFrame).length !== currentFrame.length
      || (prevFrame !== null && Array.from(prevFrame).length !== prevFrame.length);
    if (currentFrameHash === null || rehash) {
      currentFrameHash = hasher.hash(currentFrame);
      recordStep(stepCallback, prevHash === null ? 'frame-hash' : 'frame-rehash', [], [], {
        wordHash, currentFrameHash, alignment: charIndex, currentFrame,
      }, 'currentFrameHash = hasher.hash(currentFrame);');
    } else {
      currentFrameHash = hasher.roll(currentFrameHash, prevFrame, currentFrame);
      recordStep(stepCallback, 'frame-roll', [], [], {
        wordHash, currentFrameHash, prevHash, alignment: charIndex, currentFrame,
      }, 'currentFrameHash = hasher.roll(currentFrameHash, prevFrame, currentFrame);');
    }

    prevFrame = currentFrame;
    recordStep(stepCallback, 'hash-compare', [], [], {
      wordHash, currentFrameHash, alignment: charIndex, currentFrame,
    }, 'wordHash === currentFrameHash');
    if (wordHash === currentFrameHash) {
      recordStep(stepCallback, 'verify', [], [], {
        wordHash,
        currentFrameHash,
        alignment: charIndex,
        currentFrame,
        equal: currentFrame === word,
      }, '&& text.substring(charIndex, charIndex + word.length) === word');
    }

    // Compare the hash of current substring and seeking string.
    // In case if hashes match let's make sure that substrings are equal.
    // In case of hash collision the strings may not be equal.
    if (
      wordHash === currentFrameHash
      && text.substring(charIndex, charIndex + word.length) === word
    ) {
      return charIndex;
    }
  }

  return -1;
}
