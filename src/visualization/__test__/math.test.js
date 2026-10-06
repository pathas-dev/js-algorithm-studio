import traceBits, { traceFactorial, traceFibonacci } from '../math';

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

it('records exact factorial products and handles zero without iterations', () => {
  expect(traceFactorial([0]).at(-1).variables.result).toBe(1);
  const steps = traceFactorial([6]);
  expect(steps.at(-1).variables.result).toBe(720);
  expect(steps.filter((step) => step.type === 'multiply').map((step) => step.variables.result))
    .toEqual([2, 6, 24, 120, 720]);
  expect(Number.isSafeInteger(traceFactorial([18]).at(-1).variables.result)).toBe(true);
  expect(() => traceFactorial([19])).toThrow('factorial-input');
});

it('starts Fibonacci at zero and accumulates exact values through F(78)', () => {
  expect(traceFibonacci([0]).at(-1).variables.result).toBe(0);
  const steps = traceFibonacci([10]);
  expect(steps.at(-1).variables.result).toBe(55);
  expect(JSON.parse(steps.at(-1).variables.sequence))
    .toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
  expect(JSON.parse(steps[0].variables.sequence)).toEqual([0, 1]);
  expect(Number.isSafeInteger(traceFibonacci([78]).at(-1).variables.result)).toBe(true);
  expect(() => traceFibonacci([79])).toThrow('fibonacci-input');
});
