import recordStep from '../../../utils/trace/recordStep';

/**
 * DYNAMIC PROGRAMMING approach of solving Trapping Rain Water problem.
 *
 * @param {number[]} terraces
 * @param {function} [stepCallback]
 * @return {number}
 */
export default function dpRainTerraces(terraces, stepCallback = undefined) {
  let waterAmount = 0;

  // Init arrays that will keep the list of left and right maximum levels for specific positions.
  const leftMaxLevels = new Array(terraces.length).fill(0);
  const rightMaxLevels = new Array(terraces.length).fill(0);

  const water = new Array(terraces.length).fill(0);
  const state = (current = -1) => ({
    current,
    waterAmount,
    left: JSON.stringify(leftMaxLevels),
    right: JSON.stringify(rightMaxLevels),
    water: JSON.stringify(water),
  });
  recordStep(stepCallback, 'start', terraces, [], () => state(), 'let waterAmount = 0');

  // Calculate the highest terrace level from the LEFT relative to the current terrace.
  [leftMaxLevels[0]] = terraces;
  for (let terraceIndex = 1; terraceIndex < terraces.length; terraceIndex += 1) {
    leftMaxLevels[terraceIndex] = Math.max(
      terraces[terraceIndex],
      leftMaxLevels[terraceIndex - 1],
    );
    recordStep(
      stepCallback,
      'left-max',
      terraces,
      [terraceIndex],
      () => state(terraceIndex),
      'leftMaxLevels[terraceIndex] = Math.max(',
    );
  }

  // Calculate the highest terrace level from the RIGHT relative to the current terrace.
  rightMaxLevels[terraces.length - 1] = terraces[terraces.length - 1];
  for (let terraceIndex = terraces.length - 2; terraceIndex >= 0; terraceIndex -= 1) {
    rightMaxLevels[terraceIndex] = Math.max(
      terraces[terraceIndex],
      rightMaxLevels[terraceIndex + 1],
    );
    recordStep(
      stepCallback,
      'right-max',
      terraces,
      [terraceIndex],
      () => state(terraceIndex),
      'rightMaxLevels[terraceIndex] = Math.max(',
    );
  }

  // Not let's go through all terraces one by one and calculate how much water
  // each terrace may accumulate based on previously calculated values.
  for (let terraceIndex = 0; terraceIndex < terraces.length; terraceIndex += 1) {
    // Pick the lowest from the left/right highest terraces.
    const currentTerraceBoundary = Math.min(
      leftMaxLevels[terraceIndex],
      rightMaxLevels[terraceIndex],
    );

    if (currentTerraceBoundary > terraces[terraceIndex]) {
      water[terraceIndex] = currentTerraceBoundary - terraces[terraceIndex];
      waterAmount += water[terraceIndex];
    }
    recordStep(
      stepCallback,
      'water',
      terraces,
      [terraceIndex],
      () => ({ ...state(terraceIndex), currentTerraceBoundary }),
      'const currentTerraceBoundary = Math.min(',
    );
  }

  recordStep(
    stepCallback,
    'done',
    terraces,
    [],
    () => ({ ...state(), result: waterAmount }),
    'return waterAmount',
  );
  return waterAmount;
}
