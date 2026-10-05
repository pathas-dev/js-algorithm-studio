import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
export default function levenshteinDistance(a, b, stepCallback) {
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  // Fill the first row of the matrix.
  // Transform each prefix of a to the empty string by deleting its characters.
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }

  // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }
  recordStep(stepCallback, 'initialize', [], [], () => ({
    dpMatrix: JSON.stringify(distanceMatrix),
  }), 'distanceMatrix[j][0] = j;');

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator, // substitution
      );
      recordStep(stepCallback, 'cell-min', [], [], () => ({
        dpMatrix: JSON.stringify(distanceMatrix),
        row: j,
        column: i,
        indicator,
        deletion: distanceMatrix[j][i - 1] + 1,
        insertion: distanceMatrix[j - 1][i] + 1,
        substitution: distanceMatrix[j - 1][i - 1] + indicator,
        dependencies: JSON.stringify([[j, i - 1], [j - 1, i], [j - 1, i - 1]]),
      }), 'distanceMatrix[j][i] = Math.min(');
    }
  }

  return distanceMatrix[b.length][a.length];
}
