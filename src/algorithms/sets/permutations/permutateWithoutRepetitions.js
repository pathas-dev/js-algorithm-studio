import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {*[]} permutationOptions
 * @return {*[]}
 */
export default function permutateWithoutRepetitions(permutationOptions, stepCallback) {
  const state = (groups = [], position = -1) => ({
    groups: JSON.stringify(groups),
    inputs: JSON.stringify([permutationOptions]),
    count: groups.length,
    size: permutationOptions.length,
    position,
    result: '—',
  });
  recordStep(stepCallback, 'enter', [], [], () => state(), 'if (permutationOptions.length <= 1) {');
  if (permutationOptions.length <= 1) {
    recordStep(stepCallback, 'base', [], [], () => state([permutationOptions]), 'return [permutationOptions];');
    return [permutationOptions];
  }

  // Init permutations array.
  const permutations = [];

  // Get all permutations for permutationOptions excluding the first element.
  const smallerPermutations = permutateWithoutRepetitions(
    permutationOptions.slice(1),
    stepCallback,
  );

  // Insert first option into every possible position of every smaller permutation.
  const firstOption = permutationOptions[0];

  for (let permIndex = 0; permIndex < smallerPermutations.length; permIndex += 1) {
    const smallerPermutation = smallerPermutations[permIndex];

    // Insert first option into every possible position of smallerPermutation.
    for (let positionIndex = 0; positionIndex <= smallerPermutation.length; positionIndex += 1) {
      const permutationPrefix = smallerPermutation.slice(0, positionIndex);
      const permutationSuffix = smallerPermutation.slice(positionIndex);
      permutations.push(permutationPrefix.concat([firstOption], permutationSuffix));
      recordStep(
        stepCallback,
        'insert',
        [],
        [],
        () => ({
          ...state(permutations, positionIndex),
          firstOption,
          smaller: smallerPermutation.join(', '),
        }),
        'permutations.push(permutationPrefix.concat([firstOption], permutationSuffix));',
      );
    }
  }

  recordStep(stepCallback, 'return', [], [], () => state(permutations), 'return permutations;');
  return permutations;
}
