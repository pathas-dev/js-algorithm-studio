import recordStep from '../../../utils/trace/recordStep';
import Comparator from '../../../utils/comparator/Comparator';

/**
 * Linear search implementation.
 *
 * @param {*[]} array
 * @param {*} seekElement
 * @param {function(a, b)} [comparatorCallback]
 * @param {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 * @return {number[]}
 */
export default function linearSearch(array, seekElement, comparatorCallback, stepCallback) {
  const comparator = new Comparator(comparatorCallback);
  const foundIndices = [];
  recordStep(stepCallback, 'start', array, [], { target: seekElement, matches: '' }, 'const foundIndices =');

  array.forEach((element, index) => {
    recordStep(stepCallback, 'compare', array, [index], { index, target: seekElement, matches: foundIndices.join(',') }, 'if (comparator.equal');
    if (comparator.equal(element, seekElement)) {
      foundIndices.push(index);
      recordStep(stepCallback, 'found', array, [index], { index, target: seekElement, matches: foundIndices.join(',') }, 'foundIndices.push(index);');
    }
  });

  recordStep(stepCallback, 'done', array, foundIndices, { target: seekElement, matches: foundIndices.join(',') }, 'return foundIndices;');
  return foundIndices;
}
