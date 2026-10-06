import resizeImageWidth from '../algorithms/image-processing/seam-carving/resizeImageWidth';
import { getPixel } from '../algorithms/image-processing/utils/imageData';

export default function traceSeam(values) {
  let pixels;
  const toWidth = Number(values[1]);
  try { pixels = JSON.parse(values[0]); } catch (_) { throw new Error('seam-input'); }
  if (!Array.isArray(pixels) || !pixels.length || pixels.length > 6
    || !Array.isArray(pixels[0]) || !pixels[0].length || pixels[0].length > 8
    || !pixels.every((row) => Array.isArray(row) && row.length === pixels[0].length
      && row.every((value) => Number.isInteger(value) && value >= 0 && value <= 255))
    || !Number.isInteger(toWidth) || toWidth < 1 || toWidth > pixels[0].length) {
    throw new Error('seam-input');
  }
  const img = {
    width: pixels[0].length,
    height: pixels.length,
    colorSpace: 'srgb',
    data: new Uint8ClampedArray(pixels.flatMap((row) => row.flatMap((value) => (
      [value, value, value, 255]
    )))),
  };
  const steps = [];
  let state = { energyMap: '[]', totals: '[]', seam: '[]' };
  const save = (type, variables, code) => {
    if (type === 'remove' || type === 'energy') state = { ...state, seam: '[]', totals: '[]' };
    state = { ...state, ...variables };
    const image = Array.from({ length: img.height }, (_, y) => (
      Array.from({ length: variables.w }, (cell, x) => getPixel(img, { x, y })[0])
    ));
    steps.push({
      type,
      array: [],
      indices: [],
      code,
      variables: {
        ...state, mode: 'seam', image: JSON.stringify(image), toWidth,
      },
    });
  };
  save('start', { w: img.width, h: img.height }, 'const size = { w: img.width, h: img.height }');
  resizeImageWidth({
    img,
    toWidth,
    stepCallback: (step) => save(step.type, step.variables, step.code),
  });
  save(
    'done',
    { w: toWidth, h: img.height, result: `${toWidth} × ${img.height}` },
    'return { img, size }',
  );
  return steps;
}
