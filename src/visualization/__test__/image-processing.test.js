import traceSeam from '../image-processing';

it('backtracks a contiguous minimum seam and removes pixels from every row', () => {
  const steps = traceSeam(['[[20,20,200],[20,20,200],[20,20,200]]', '2']);
  const seams = steps.filter((step) => step.type === 'seam');
  const path = JSON.parse(seams.at(-1).variables.seam);
  expect(path).toHaveLength(3);
  expect(path.map((point) => point.y)).toEqual([2, 1, 0]);
  expect(path.every((point, index) => !index || Math.abs(point.x - path[index - 1].x) <= 1))
    .toBe(true);
  expect(steps.at(-1).variables.result).toBe('2 × 3');
  expect(JSON.parse(steps.at(-1).variables.image)).toEqual([[20, 200], [20, 200], [20, 200]]);
  expect(traceSeam(['[[10,20,30]]', '1']).at(-1).variables.result).toBe('1 × 1');
  expect(() => traceSeam(['[[0,1],[0]]', '1'])).toThrow('seam-input');
  expect(() => traceSeam(['[[0,1]]', '0'])).toThrow('seam-input');
});
