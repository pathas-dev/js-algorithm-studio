import recordStep from '../../../utils/trace/recordStep';

/**
 * Generates Cartesian Product of two sets.
 * @param {*[]} setA
 * @param {*[]} setB
 * @return {*[]}
 */
export default function cartesianProduct(setA, setB, stepCallback) {
  // Check if input sets are not empty.
  // Otherwise return null since we can't generate Cartesian Product out of them.
  if (!setA || !setB || !setA.length || !setB.length) {
    recordStep(stepCallback, 'done', [], [], { groups: '[]', count: 0, result: '∅' }, 'return null;');
    return null;
  }

  // Init product set.
  const product = [];

  recordStep(stepCallback, 'start', [], [], { groups: '[]', count: 0, result: '—' }, 'const product = [];');

  // Now, let's go through all elements of a first and second set and form all possible pairs.
  for (let indexA = 0; indexA < setA.length; indexA += 1) {
    for (let indexB = 0; indexB < setB.length; indexB += 1) {
      // Add current product pair to the product set.
      product.push([setA[indexA], setB[indexB]]);
      recordStep(stepCallback, 'append-pair', [], [], {
        indexA,
        indexB,
        count: product.length,
        result: '—',
        groups: JSON.stringify(product),
        first: setA[indexA],
        second: setB[indexB],
      }, 'product.push([setA[indexA], setB[indexB]]);');
    }
  }

  // Return cartesian product set.
  recordStep(stepCallback, 'done', [], [], {
    groups: JSON.stringify(product), count: product.length, result: product.length,
  }, 'return product;');
  return product;
}
