import recordStep from '../../../utils/trace/recordStep';

/**
 * Picks the random item based on its weight.
 * The items with higher weight will be picked more often (with a higher probability).
 *
 * For example:
 * - items = ['banana', 'orange', 'apple']
 * - weights = [0, 0.2, 0.8]
 * - weightedRandom(items, weights) in 80% of cases will return 'apple', in 20% of cases will return
 * 'orange' and it will never return 'banana' (because probability of picking the banana is 0%)
 *
 * @param {any[]} items
 * @param {number[]} weights
 * @param {function} [stepCallback]
 * @param {function} [random]
 * @returns {{item: any, index: number}}
 */
export default function weightedRandom(
  items,
  weights,
  stepCallback = undefined,
  random = Math.random,
) {
  if (items.length !== weights.length) {
    throw new Error('Items and weights must be of the same size');
  }

  if (!items.length) {
    throw new Error('Items must not be empty');
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  if (!weights.every((weight) => Number.isFinite(weight) && weight >= 0)
    || !Number.isFinite(totalWeight) || totalWeight <= 0) {
    throw new Error('Weights must be finite, nonnegative, and have a positive sum');
  }

  // Preparing the cumulative weights array.
  // For example:
  // - weights = [1, 4, 3]
  // - cumulativeWeights = [1, 5, 8]
  const cumulativeWeights = [];
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    recordStep(stepCallback, 'prefix', [], [], () => ({
      current: i,
      cumulative: JSON.stringify(cumulativeWeights),
    }), 'cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0)');
  }

  // Getting the random number in a range of [0...sum(weights)]
  // For example:
  // - weights = [1, 4, 3]
  // - maxCumulativeWeight = 8
  // - range for the random number is [0...8]
  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const draw = random();
  if (!Number.isFinite(draw) || draw < 0 || draw >= 1) {
    throw new Error('Random draw must be in [0, 1)');
  }
  const randomNumber = maxCumulativeWeight * draw;
  recordStep(stepCallback, 'draw', [], [], { randomNumber }, 'const randomNumber = maxCumulativeWeight * draw');

  // Picking the random item based on its weight.
  // The items with higher weight will be picked more often.
  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    recordStep(stepCallback, 'check', [], [], {
      current: itemIndex,
      randomNumber,
      boundary: cumulativeWeights[itemIndex],
      probabilityBoundary: cumulativeWeights[itemIndex] / maxCumulativeWeight,
    }, 'if (cumulativeWeights[itemIndex] / maxCumulativeWeight > draw)');
    if (cumulativeWeights[itemIndex] / maxCumulativeWeight > draw) {
      return {
        item: items[itemIndex],
        index: itemIndex,
      };
    }
  }
}
