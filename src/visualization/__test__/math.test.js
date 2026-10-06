import traceBits, {
  traceFactorial, traceFibonacci, tracePrimality, traceGcd,
} from '../math';

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

it('checks only necessary primality divisors and rejects nonintegers', () => {
  expect(tracePrimality([1]).at(-1).variables.result).toBe(false);
  expect(tracePrimality([2]).at(-1).variables.result).toBe(true);
  expect(tracePrimality([49]).at(-1).variables.result).toBe(false);
  const prime = tracePrimality([97]);
  expect(prime.at(-1).variables.result).toBe(true);
  expect(JSON.parse(prime.at(-1).variables.checks).map(([divider]) => divider))
    .toEqual([2, 3, 5, 7, 9]);
  expect(() => tracePrimality([1.5])).toThrow('primality-input');
});

it('reduces GCD by remainders and handles signed and zero inputs', () => {
  const steps = traceGcd([252, 105]);
  expect(steps.at(-1).variables.result).toBe(21);
  expect(steps.filter((step) => step.type === 'modulo').map((step) => step.variables.b))
    .toEqual([105, 42, 21]);
  expect(traceGcd([-60, 24]).at(-1).variables.result).toBe(12);
  expect(traceGcd([0, 0]).at(-1).variables.result).toBe(0);
  expect(() => traceGcd([2, 1.5])).toThrow('integer-pair');
});
