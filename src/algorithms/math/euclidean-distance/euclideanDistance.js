import recordStep from '../../../utils/trace/recordStep';
/**
 * @typedef {import('../matrix/Matrix.js').Matrix} Matrix
 */

import * as mtrx from '../matrix/Matrix';

/**
 * Calculates the euclidean distance between 2 matrices.
 *
 * @param {Matrix} a
 * @param {Matrix} b
 * @returns {number}
 * @trows {Error}
 */
const euclideanDistance = (a, b, stepCallback) => {
  mtrx.validateSameShape(a, b);

  let squaresTotal = 0;

  recordStep(stepCallback, 'start', [], [], { sum: 0, result: '—', expression: 'Σ (aᵢ − bᵢ)² = 0' }, 'let squaresTotal = 0;');

  mtrx.walk(a, (indices, aCellValue) => {
    const bCellValue = mtrx.getCellAtIndex(b, indices);
    squaresTotal += (aCellValue - bCellValue) ** 2;
    recordStep(stepCallback, 'square-add', [], [], {
      position: indices.join(','),
      a: aCellValue,
      b: bCellValue,
      difference: aCellValue - bCellValue,
      sum: squaresTotal,
      result: '—',
      expression: `(${aCellValue} − ${bCellValue})² → Σ = ${squaresTotal}`,
    }, 'squaresTotal += (aCellValue - bCellValue) ** 2;');
  });

  recordStep(stepCallback, 'done', [], [], {
    sum: squaresTotal,
    result: Number(Math.sqrt(squaresTotal).toFixed(2)),
    expression: `√${squaresTotal} ≈ ${Number(Math.sqrt(squaresTotal).toFixed(2))}`,
  }, 'return Number(Math.sqrt(squaresTotal).toFixed(2));');
  return Number(Math.sqrt(squaresTotal).toFixed(2));
};

export default euclideanDistance;
