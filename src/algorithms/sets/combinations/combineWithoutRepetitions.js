import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {*[]} comboOptions
 * @param {number} comboLength
 * @return {*[]}
 */
export default function combineWithoutRepetitions(comboOptions, comboLength, stepCallback) {
  const state = (groups = []) => ({
    inputs: JSON.stringify([comboOptions]),
    groups: JSON.stringify(groups),
    size: comboOptions.length,
    k: comboLength,
    count: groups.length,
    result: '—',
  });
  recordStep(stepCallback, 'enter', [], [], () => state(), 'if (comboLength === 0) {');
  if (comboLength === 0) {
    recordStep(stepCallback, 'base', [], [], () => state([[]]), 'return [[]];');
    return [[]];
  }

  if (comboLength < 0) {
    recordStep(stepCallback, 'base', [], [], () => state(), 'return [];');
    return [];
  }

  // If the length of the combination is 1 then each element of the original array
  // is a combination itself.
  if (comboLength === 1) {
    const singletonCombos = comboOptions.map((comboOption) => [comboOption]);
    recordStep(stepCallback, 'base', [], [], () => state(singletonCombos), 'return singletonCombos;');
    return singletonCombos;
  }

  // Init combinations array.
  const combos = [];

  // Extract characters one by one and concatenate them to combinations of smaller lengths.
  // We need to extract them because we don't want to have repetitions after concatenation.
  comboOptions.forEach((currentOption, optionIndex) => {
    // Generate combinations of smaller size.
    const smallerCombos = combineWithoutRepetitions(
      comboOptions.slice(optionIndex + 1),
      comboLength - 1,
      stepCallback,
    );

    // Concatenate currentOption with all combinations of smaller size.
    smallerCombos.forEach((smallerCombo) => {
      combos.push([currentOption].concat(smallerCombo));
      recordStep(
        stepCallback,
        'append-combination',
        [],
        [],
        () => ({ ...state(combos), currentOption, smaller: smallerCombo.join(', ') }),
        'combos.push([currentOption].concat(smallerCombo));',
      );
    });
  });

  recordStep(stepCallback, 'return', [], [], () => state(combos), 'return combos;');
  return combos;
}
