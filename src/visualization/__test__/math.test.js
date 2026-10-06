import traceBits, {
  traceFactorial, traceFibonacci, tracePrimality, traceGcd, traceLcm, traceSieve, tracePowerTwo,
  tracePascal, tracePartition, traceLiuHui, traceFloat, traceFactors,
  traceComplex, traceRadian, tracePower, traceHorner, traceMatrix,
  traceDistance, traceRoot,
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

it('derives LCM from GCD with zero and signed inputs', () => {
  const steps = traceLcm([12, 18]);
  expect(steps.at(-1).variables.result).toBe(36);
  expect(steps.some((step) => step.variables.phase === 'gcd')).toBe(true);
  expect(traceLcm([0, 4]).at(-1).variables.result).toBe(0);
  expect(traceLcm([-9, 18]).at(-1).variables.result).toBe(18);
});

it('sieves composites starting at each prime square and handles tiny limits', () => {
  const steps = traceSieve([10]);
  expect(JSON.parse(steps.at(-1).variables.primes)).toEqual([2, 3, 5, 7]);
  expect(steps.find((step) => step.type === 'mark-composite').variables.current).toBe(4);
  expect(JSON.parse(steps[0].variables.isPrime)[4]).toBe(true);
  expect(traceSieve([0]).at(-1).variables.count).toBe(0);
  expect(() => traceSieve([121])).toThrow('sieve-input');
});

it('accepts 2^0 and reaches one by exact halving, rejecting odd factors', () => {
  expect(tracePowerTwo([1]).at(-1).variables.result).toBe(true);
  expect(tracePowerTwo([0]).at(-1).variables.result).toBe(false);
  expect(tracePowerTwo([-2]).at(-1).variables.result).toBe(false);
  expect(tracePowerTwo([32]).at(-1).variables.result).toBe(true);
  expect(tracePowerTwo([12]).at(-1).variables.current).toBe(3);
  expect(tracePowerTwo([12]).at(-1).variables.result).toBe(false);
});

it('builds Pascal rows from their two parents with immutable snapshots', () => {
  const steps = tracePascal([6]);
  expect(JSON.parse(steps.at(-1).variables.triangle)[6]).toEqual([1, 6, 15, 20, 15, 6, 1]);
  expect(JSON.parse(steps[0].variables.triangle)).toEqual([[1]]);
  expect(tracePascal([0]).at(-1).variables.result).toBe('1');
  expect(() => tracePascal([13])).toThrow('pascal-input');
});

it('counts unordered partitions with repeatable summands and the empty sum', () => {
  expect(tracePartition([6]).at(-1).variables.result).toBe(11);
  expect(tracePartition([0]).at(-1).variables.result).toBe(1);
  const steps = tracePartition([4]);
  expect(JSON.parse(steps[0].variables.dpMatrix)[1][1]).toBeNull();
  expect(steps.at(-1).variables.result).toBe(5);
  expect(() => tracePartition([-1])).toThrow('partition-input');
});

it('doubles inscribed polygon sides and converges toward pi from below', () => {
  const steps = traceLiuHui([5]);
  expect(steps.map((step) => step.variables.sides)).toEqual([6, 12, 24, 48, 96, 96]);
  expect(steps.at(-1).variables.result).toBeCloseTo(96 * Math.sin(Math.PI / 96), 10);
  expect(steps.at(-1).variables.result).toBeLessThan(Math.PI);
  expect(traceLiuHui([1]).at(-1).variables.result).toBe(3);
  expect(() => traceLiuHui([0])).toThrow('liu-input');
});

it('rounds float32 and decodes zeros and subnormals correctly', () => {
  expect(traceFloat([0.1]).at(-1).variables.result).toBe(Math.fround(0.1));
  expect(traceFloat([0]).at(-1).variables.result).toBe(0);
  expect(traceFloat([-0]).at(-1).variables.result).toBe('-0');
  expect(traceFloat([1e-40]).at(-1).variables.result).toBe(Math.fround(1e-40));
  expect(traceFloat([-2.5]).at(-1).variables.result).toBe(-2.5);
  expect(() => traceFloat([Infinity])).toThrow('float-input');
});

it('preserves repeated prime factors and the empty factorization of one', () => {
  expect(JSON.parse(traceFactors([84]).at(-1).variables.sequence)).toEqual([2, 2, 3, 7]);
  expect(JSON.parse(traceFactors([97]).at(-1).variables.sequence)).toEqual([97]);
  expect(JSON.parse(traceFactors([1]).at(-1).variables.sequence)).toEqual([]);
  expect(() => traceFactors([0])).toThrow('factors-input');
});

it('computes independent complex operations and rejects a zero divisor', () => {
  const steps = traceComplex([3, 2, 1, -1]);
  expect(steps.find((step) => step.type === 'multiply').variables.result).toBe('5 − 1i');
  expect(steps.find((step) => step.type === 'divide').variables.result).toBe('0.5 + 2.5i');
  expect(steps.find((step) => step.type === 'conjugate').variables.result).toBe('3 − 2i');
  expect(JSON.parse(traceComplex([0, 0, 1, 1]).at(-1).variables.cells).at(-1)[1]).toBe(0);
  expect(() => traceComplex([1, 2, 0, 0])).toThrow('complex-input');
});

it('converts degrees and restores negative and multi-turn angles', () => {
  expect(traceRadian([180])[1].variables.result).toBe(Math.PI);
  expect(traceRadian([-90])[1].variables.result).toBe(-Math.PI / 2);
  expect(traceRadian([720]).at(-1).variables.result).toBeCloseTo(720);
  expect(traceRadian([0]).at(-1).variables.result).toBe(0);
  expect(() => traceRadian([1, 2])).toThrow('float-input');
});

it('reuses recursive half powers with odd, even and zero exponents', () => {
  expect(tracePower([3, 7]).at(-1).variables.result).toBe(2187);
  expect(tracePower([-2, 8]).at(-1).variables.result).toBe(256);
  expect(tracePower([-2, 7]).at(-1).variables.result).toBe(-128);
  expect(tracePower([0, 0]).at(-1).variables.result).toBe(1);
  expect(tracePower([3, 7]).filter((step) => step.type === 'enter').length).toBe(3);
  expect(() => tracePower([3, -1])).toThrow('power-input');
});

it('evaluates descending polynomial coefficients by multiply-add', () => {
  const steps = traceHorner([4, 3, 2], 2);
  expect(steps.filter((step) => step.type === 'multiply-add')
    .map((step) => step.variables.result)).toEqual([4, 11, 24]);
  expect(traceHorner([4, 3, 2], 0).at(-1).variables.result).toBe(2);
  expect(traceHorner([4, 3, 2], -1).at(-1).variables.result).toBe(3);
  expect(traceHorner([7], 2).at(-1).variables.result).toBe(7);
  expect(() => traceHorner([], 2)).toThrow('horner-input');
});

it('traces rectangular matrix products and rejects ragged or incompatible inputs', () => {
  const steps = traceMatrix(['[[1,2,3],[4,5,6]]', '[[1],[2],[3]]']);
  expect(JSON.parse(steps.at(-1).variables.output)).toEqual([[14], [32]]);
  expect(JSON.parse(steps[0].variables.output)).toEqual([[0], [0]]);
  expect(traceMatrix(['[[-2]]', '[[3]]']).at(-1).variables.result).toBe('[[-6]]');
  expect(() => traceMatrix(['[[1,2],[3]]', '[[1],[2]]'])).toThrow('matrix-input');
  expect(() => traceMatrix(['[[1,2]]', '[[3,4]]'])).toThrow('matrix-shape');
});

it('sums squared coordinate differences before rounding the distance', () => {
  expect(traceDistance([0, 0, 3, 4]).at(-1).variables.result).toBe(5);
  expect(traceDistance([3, 4, 0, 0]).at(-1).variables.result).toBe(5);
  expect(traceDistance([8, 2, 6, 3, 5, 7]).at(-1).variables.result).toBe(5.92);
  expect(traceDistance([2, 2]).at(-1).variables.result).toBe(0);
  expect(traceDistance([0, 0, 3, 4])[1].variables.sum).toBe(9);
  expect(() => traceDistance([1, 2, 3])).toThrow('distance-input');
});

it('converges Newton estimates before rounding and handles small positive inputs', () => {
  expect(traceRoot([2], 6).at(-1).variables.result).toBe(1.414214);
  expect(traceRoot([0.01], 0).at(-1).variables.result).toBe(0);
  expect(traceRoot([3], 1).at(-1).variables.result).toBe(1.7);
  expect(traceRoot([0], 6).at(-1).variables.result).toBe(0);
  expect(() => traceRoot([-1], 6)).toThrow('root-input');
  expect(() => traceRoot([2], 7)).toThrow('root-input');
});
