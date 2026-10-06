import traceBits from '../math';

it('applies bit operations independently and validates the input', () => {
  const steps = traceBits([13, 2, 0]);
  const result = (type) => steps.find((step) => step.type === type).variables.result;
  expect(result('getBit')).toBe(1);
  expect(result('setBit')).toBe(13);
  expect(result('clearBit')).toBe(9);
  expect(result('updateBit')).toBe(9);
  expect(result('multiplyByTwo')).toBe(26);
  expect(result('divideByTwo')).toBe(6);
  expect(() => traceBits([1, 8, 0])).toThrow('bits-input');
});
