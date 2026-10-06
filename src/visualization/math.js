import leastCommonMultiple from '../algorithms/math/least-common-multiple/leastCommonMultiple';
import euclideanAlgorithm from '../algorithms/math/euclidean-algorithm/euclideanAlgorithm';
import trialDivision from '../algorithms/math/primality-test/trialDivision';
import fibonacciNth from '../algorithms/math/fibonacci/fibonacciNth';
import factorial from '../algorithms/math/factorial/factorial';
import getBit from '../algorithms/math/bits/getBit';
import setBit from '../algorithms/math/bits/setBit';
import clearBit from '../algorithms/math/bits/clearBit';
import updateBit from '../algorithms/math/bits/updateBit';
import multiplyByTwo from '../algorithms/math/bits/multiplyByTwo';
import divideByTwo from '../algorithms/math/bits/divideByTwo';

export default function traceBits(values) {
  const [number, position, bitValue] = values;
  if (values.length !== 3 || !values.every(Number.isInteger)
    || number < 0 || number > 255 || position < 0 || position > 7
    || ![0, 1].includes(bitValue)) throw new Error('bits-input');
  const steps = [];
  const results = {};
  const snapshot = (type, result, code) => {
    if (type !== 'start' && type !== 'done') results[type] = result;
    steps.push({
      type,
      array: [],
      indices: [],
      code,
      variables: {
        mode: 'bits', number, position, bitValue, result, results: JSON.stringify(results),
      },
    });
  };
  snapshot('start', number, 'return (number >> bitPosition) & 1;');
  snapshot('getBit', getBit(number, position), 'return (number >> bitPosition) & 1;');
  snapshot('setBit', setBit(number, position), 'return number | (1 << bitPosition);');
  snapshot('clearBit', clearBit(number, position), 'return number & mask;');
  snapshot('updateBit', updateBit(number, position, bitValue), 'return (number & clearMask) | (bitValueNormalized << bitPosition);');
  snapshot('multiplyByTwo', multiplyByTwo(number), 'return number << 1;');
  snapshot('divideByTwo', divideByTwo(number), 'return number >> 1;');
  snapshot('done', divideByTwo(number), 'return number >> 1;');
  return steps;
}

export function traceFactorial(values) {
  const [number] = values;
  if (values.length !== 1 || !Number.isInteger(number) || number < 0 || number > 18) {
    throw new Error('factorial-input');
  }
  const steps = [];
  factorial(number, (step) => steps.push({ ...step, variables: { ...step.variables, mode: 'factorial' } }));
  return steps;
}

export function traceFibonacci(values) {
  const [number] = values;
  if (values.length !== 1 || !Number.isInteger(number) || number < 0 || number > 78) {
    throw new Error('fibonacci-input');
  }
  const sequence = number === 0 ? [0] : [0, 1];
  const steps = [];
  fibonacciNth(number, (step) => {
    if (step.type === 'add') sequence.push(step.variables.result);
    steps.push({ ...step, variables: { ...step.variables, mode: 'fibonacci', sequence: JSON.stringify(sequence) } });
  });
  return steps;
}

export function tracePrimality(values) {
  const [number] = values;
  if (values.length !== 1 || !Number.isInteger(number)) throw new Error('primality-input');
  const checks = [];
  const steps = [];
  trialDivision(number, (step) => {
    if (step.type === 'check-divisor') checks.push([step.variables.divider, step.variables.remainder]);
    steps.push({ ...step, variables: { ...step.variables, mode: 'primality', checks: JSON.stringify(checks) } });
  });
  return steps;
}

export function traceGcd(values) {
  if (values.length !== 2 || !values.every(Number.isInteger)) throw new Error('integer-pair');
  const steps = [];
  euclideanAlgorithm(...values, (step) => steps.push({
    ...step, variables: { ...step.variables, mode: 'gcd' },
  }));
  steps[0].type = 'start';
  steps[steps.length - 1].type = 'done';
  return steps;
}

export function traceLcm(values) {
  if (values.length !== 2 || !values.every(Number.isInteger)) throw new Error('integer-pair');
  const steps = [];
  leastCommonMultiple(...values, (step) => steps.push({
    ...step, variables: { ...step.variables, mode: step.variables.phase === 'gcd' ? 'gcd' : 'lcm' },
  }));
  return steps;
}
