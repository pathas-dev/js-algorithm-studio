import recordStep from '../../../utils/trace/recordStep';
/**
 * @param {string} string
 * @return {boolean}
 */

export default function isPalindrome(string, stepCallback) {
  const characters = [...string];
  let left = 0;
  let right = characters.length - 1;
  recordStep(stepCallback, 'start', [], [], { left, right }, 'const characters = [...string];');

  while (left < right) {
    recordStep(stepCallback, 'compare', [], [], { left, right }, 'if (characters[left] !== characters[right]) {');
    if (characters[left] !== characters[right]) {
      recordStep(stepCallback, 'done', [], [], { left, right, result: false }, 'return false;');
      return false;
    }
    left += 1;
    right -= 1;
    recordStep(stepCallback, 'move', [], [], { left, right }, 'right -= 1;');
  }

  recordStep(stepCallback, 'done', [], [], { left, right, result: true }, 'return true;');
  return true;
}
