import recordStep from '../../../utils/trace/recordStep';

/** Return the first match, using JavaScript UTF-16 indices like String.indexOf. */
export default function naiveSearch(text, word, stepCallback) {
  if (!word.length) return 0;
  for (let alignment = 0; alignment <= text.length - word.length; alignment += 1) {
    let wordIndex = 0;
    while (wordIndex < word.length) {
      const textIndex = alignment + wordIndex;
      recordStep(
        stepCallback,
        'compare',
        [],
        [],
        { alignment, textIndex, wordIndex },
        'if (text[textIndex] !== word[wordIndex]) break;',
      );
      if (text[textIndex] !== word[wordIndex]) break;
      wordIndex += 1;
    }
    if (wordIndex === word.length) return alignment;
    recordStep(
      stepCallback,
      'shift',
      [],
      [],
      { alignment: alignment + 1 },
      'alignment += 1) {',
    );
  }
  return -1;
}
