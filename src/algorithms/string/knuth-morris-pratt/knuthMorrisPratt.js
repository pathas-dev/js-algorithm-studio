import recordStep from '../../../utils/trace/recordStep';

/**
 * @see https://www.youtube.com/watch?v=GTJr8OvyEVQ
 * @param {string} word
 * @return {number[]}
 */
function buildPatternTable(word, stepCallback) {
  const patternTable = [0];
  let prefixIndex = 0;
  let suffixIndex = 1;
  recordStep(stepCallback, 'prefix-start', patternTable, [], { phase: 'prefix' }, 'const patternTable = [0];');

  while (suffixIndex < word.length) {
    recordStep(stepCallback, 'prefix-compare', patternTable, [], {
      prefixIndex, suffixIndex, phase: 'prefix',
    }, 'if (word[prefixIndex] === word[suffixIndex]) {');
    if (word[prefixIndex] === word[suffixIndex]) {
      patternTable[suffixIndex] = prefixIndex + 1;
      recordStep(stepCallback, 'prefix-save', patternTable, [], {
        prefixIndex, suffixIndex, phase: 'prefix',
      }, 'patternTable[suffixIndex] = prefixIndex + 1;');
      suffixIndex += 1;
      prefixIndex += 1;
    } else if (prefixIndex === 0) {
      patternTable[suffixIndex] = 0;
      recordStep(stepCallback, 'prefix-zero', patternTable, [], {
        prefixIndex, suffixIndex, phase: 'prefix',
      }, 'patternTable[suffixIndex] = 0;');
      suffixIndex += 1;
    } else {
      const lookup = prefixIndex - 1;
      prefixIndex = patternTable[prefixIndex - 1];
      recordStep(stepCallback, 'prefix-fallback', patternTable, [], {
        prefixIndex, suffixIndex, lookup, phase: 'prefix',
      }, 'prefixIndex = patternTable[prefixIndex - 1];');
    }
  }

  return patternTable;
}

/**
 * @param {string} text
 * @param {string} word
 * @return {number}
 */
export default function knuthMorrisPratt(text, word, stepCallback) {
  if (word.length === 0) {
    return 0;
  }

  let textIndex = 0;
  let wordIndex = 0;

  const patternTable = buildPatternTable(word, stepCallback);
  recordStep(stepCallback, 'prefix-done', patternTable, [], { phase: 'search' }, 'const patternTable = buildPatternTable(word, stepCallback);');

  while (textIndex < text.length) {
    recordStep(stepCallback, 'compare', patternTable, [], {
      textIndex, wordIndex, alignment: textIndex - wordIndex, phase: 'search',
    }, 'if (text[textIndex] === word[wordIndex]) {');
    if (text[textIndex] === word[wordIndex]) {
      // We've found a match.
      if (wordIndex === word.length - 1) {
        return (textIndex - word.length) + 1;
      }
      wordIndex += 1;
      textIndex += 1;
    } else if (wordIndex > 0) {
      const lookup = wordIndex - 1;
      wordIndex = patternTable[wordIndex - 1];
      recordStep(stepCallback, 'fallback', patternTable, [], {
        textIndex, wordIndex, lookup, alignment: textIndex - wordIndex, phase: 'search',
      }, 'wordIndex = patternTable[wordIndex - 1];');
    } else {
      // wordIndex = 0;
      textIndex += 1; // shift
      recordStep(stepCallback, 'shift', patternTable, [], {
        textIndex, wordIndex, alignment: textIndex, phase: 'search',
      }, 'textIndex += 1; // shift');
    }
  }

  return -1;
}
