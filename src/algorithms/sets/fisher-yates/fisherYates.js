import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {*[]} originalArray
 * @param {function} [stepCallback]
 * @param {function} [random]
 * @return {*[]}
 */
export default function fisherYates(originalArray, stepCallback, random = Math.random) {
  // Clone array from preventing original array from modification (for testing purpose).
  const array = originalArray.slice(0);

  recordStep(stepCallback, 'start', array, [], { sortedFrom: array.length }, 'const array = originalArray.slice(0);');

  for (let i = (array.length - 1); i > 0; i -= 1) {
    const randomIndex = Math.floor(random() * (i + 1));
    recordStep(stepCallback, 'select', array, [i, randomIndex], {
      i, randomIndex, low: 0, high: i, sortedFrom: i + 1,
    }, 'const randomIndex = Math.floor(random() * (i + 1));');
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    recordStep(stepCallback, 'swap', array, [i, randomIndex], {
      i, randomIndex, sortedFrom: i,
    }, '[array[i], array[randomIndex]] = [array[randomIndex], array[i]];');
  }

  recordStep(stepCallback, 'done', array, [], { sortedFrom: 0 }, 'return array;');
  return array;
}
