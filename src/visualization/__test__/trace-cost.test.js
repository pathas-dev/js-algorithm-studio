import kNN from '../../algorithms/ml/knn/kNN';
import weightedRandom from '../../algorithms/statistics/weighted-random/weightedRandom';
import rotate from '../../algorithms/uncategorized/square-matrix-rotation/squareMatrixRotation';

it('does not serialize visualization snapshots when tracing is disabled', () => {
  const stringify = vi.spyOn(JSON, 'stringify');
  try {
    kNN([[0, 0], [1, 1]], [0, 1], [0, 0], 1);
    weightedRandom(['A', 'B'], [1, 2]);
    rotate([[1, 2], [3, 4]]);
    expect(stringify).not.toHaveBeenCalled();
  } finally {
    stringify.mockRestore();
  }
});
