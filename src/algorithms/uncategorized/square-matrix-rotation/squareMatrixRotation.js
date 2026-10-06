import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {*[][]} originalMatrix
 * @param {function} [stepCallback]
 * @return {*[][]}
 */
export default function squareMatrixRotation(originalMatrix, stepCallback = undefined) {
  const matrix = originalMatrix.slice();

  recordStep(
    stepCallback,
    'start',
    [],
    [],
    { matrix: JSON.stringify(matrix) },
    'const matrix = originalMatrix.slice()',
  );

  // Do top-right/bottom-left diagonal reflection of the matrix.
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    for (let columnIndex = rowIndex + 1; columnIndex < matrix.length; columnIndex += 1) {
      // Swap elements.
      [
        matrix[columnIndex][rowIndex],
        matrix[rowIndex][columnIndex],
      ] = [
        matrix[rowIndex][columnIndex],
        matrix[columnIndex][rowIndex],
      ];
      recordStep(
        stepCallback,
        'transpose',
        [],
        [],
        {
          row: rowIndex,
          column: columnIndex,
          otherRow: columnIndex,
          otherColumn: rowIndex,
          matrix: JSON.stringify(matrix),
        },
        'matrix[columnIndex][rowIndex],',
      );
    }
  }

  // Do horizontal reflection of the matrix.
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < matrix.length / 2; columnIndex += 1) {
      // Swap elements.
      [
        matrix[rowIndex][matrix.length - columnIndex - 1],
        matrix[rowIndex][columnIndex],
      ] = [
        matrix[rowIndex][columnIndex],
        matrix[rowIndex][matrix.length - columnIndex - 1],
      ];
      recordStep(stepCallback, 'reverse-row', [], [], {
        row: rowIndex,
        column: columnIndex,
        otherRow: rowIndex,
        otherColumn: matrix.length - columnIndex - 1,
        matrix: JSON.stringify(matrix),
      }, 'matrix[rowIndex][matrix.length - columnIndex - 1],');
    }
  }

  recordStep(stepCallback, 'done', [], [], { matrix: JSON.stringify(matrix) }, 'return matrix');
  return matrix;
}
