import { dot } from '../algorithms/math/matrix/Matrix';
import hornerMethod from '../algorithms/math/horner-method/hornerMethod';
import fastPowering from '../algorithms/math/fast-powering/fastPowering';
import degreeToRadian from '../algorithms/math/radian/degreeToRadian';
import radianToDegree from '../algorithms/math/radian/radianToDegree';
import ComplexNumber from '../algorithms/math/complex-number/ComplexNumber';
import { primeFactors } from '../algorithms/math/prime-factors/primeFactors';
import { floatAs32BinaryString } from '../algorithms/math/binary-floating-point/floatAsBinaryString';
import { bitsToFloat32 } from '../algorithms/math/binary-floating-point/bitsToFloat';
import liuHui from '../algorithms/math/liu-hui/liuHui';
import integerPartition from '../algorithms/math/integer-partition/integerPartition';
import pascalTriangleRecursive from '../algorithms/math/pascal-triangle/pascalTriangleRecursive';
import isPowerOfTwo from '../algorithms/math/is-power-of-two/isPowerOfTwo';
import sieveOfEratosthenes from '../algorithms/math/sieve-of-eratosthenes/sieveOfEratosthenes';
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

export function traceSieve(values) {
  const [number] = values;
  if (values.length !== 1 || !Number.isInteger(number) || number < 0 || number > 120) {
    throw new Error('sieve-input');
  }
  const steps = [];
  sieveOfEratosthenes(number, (step) => steps.push({
    ...step, variables: { ...step.variables, mode: 'sieve' },
  }));
  return steps;
}

export function tracePowerTwo(values) {
  if (values.length !== 1 || !values.every(Number.isInteger)) throw new Error('integer-single');
  const steps = [];
  isPowerOfTwo(values[0], (step) => steps.push({
    ...step, variables: { ...step.variables, mode: 'power-two' },
  }));
  return steps;
}

export function tracePascal(values) {
  const [row] = values;
  if (values.length !== 1 || !Number.isInteger(row) || row < 0 || row > 12) {
    throw new Error('pascal-input');
  }
  const steps = [];
  const triangle = [];
  const result = pascalTriangleRecursive(row, (step) => {
    triangle[step.variables.row] = step.array;
    steps.push({
      ...step,
      array: [],
      variables: {
        ...step.variables,
        result: '—',
        mode: 'pascal',
        triangle: JSON.stringify(triangle),
        expression: step.variables.expression || 'C(0, 0) = 1',
      },
    });
  });
  steps.push({
    type: 'done',
    array: [],
    indices: [],
    code: 'return currentLine;',
    variables: {
      mode: 'pascal',
      row,
      triangle: JSON.stringify(triangle),
      result: result.join(', '),
      expression: `C(${row}, k)`,
    },
  });
  if (row === 0) steps[steps.length - 1].code = 'return [1];';
  return steps;
}

export function tracePartition(values) {
  const [number] = values;
  if (values.length !== 1 || !Number.isInteger(number) || number < 0 || number > 12) {
    throw new Error('partition-input');
  }
  const steps = [];
  integerPartition(number, (step) => steps.push(step));
  return steps;
}

export function traceLiuHui(values) {
  const [iterations] = values;
  if (values.length !== 1 || !Number.isInteger(iterations) || iterations < 1 || iterations > 7) {
    throw new Error('liu-input');
  }
  const steps = [];
  liuHui(iterations, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables,
      mode: 'liu',
      cells: JSON.stringify([['sides', step.variables.sides],
        ['side length', step.variables.sideLength], ['π error', Math.PI - step.variables.result]]),
    },
  }));
  return steps;
}

export function traceFloat(values) {
  const [number] = values;
  if (values.length !== 1 || !Number.isFinite(number)) throw new Error('float-input');
  const binary = floatAs32BinaryString(number);
  const bits = binary.split('').map(Number);
  const exponentBits = bits.slice(1, 9);
  const exponent = parseInt(exponentBits.join(''), 2);
  const fraction = bits.slice(9).reduce((sum, bit, i) => sum + bit * (2 ** -(i + 1)), 0);
  const decoded = bitsToFloat32(bits);
  const result = Object.is(decoded, -0) ? '-0' : decoded;
  const phases = [
    ['start', 'dataView.setFloat32', 'IEEE 754 · float32', '—'],
    ['sign', 'const sign = (-1) ** bits[0]', `sign = ${bits[0] ? -1 : 1}`, '—'],
    ['exponent', 'const exponent = exponentUnbiased - exponentBias;',
      `exponent = ${exponent} − 127 = ${exponent - 127}`, '—'],
    ['fraction', 'const bitPowerOfTwo = 2 ** -(bitIndex + 1);', `fraction = ${fraction}`, '—'],
    ['done', exponent === 0 ? 'return sign * (2 ** (1 - exponentBias)) * fraction;'
      : 'return sign * (2 ** exponent) * (1 + fraction);',
    exponent === 0 ? 'sign × 2⁻¹²⁶ × fraction' : 'sign × 2^exponent × (1 + fraction)', result],
  ];
  return phases.map(([type, code, expression, value]) => ({
    type: String(type),
    array: [],
    indices: [],
    code: String(code),
    variables: {
      mode: 'float',
      binary,
      exponent,
      fraction,
      result: value,
      expression,
      cells: JSON.stringify([['input', Object.is(number, -0) ? '-0' : number],
        ['encoded exponent', exponent], ['bias', 127],
        ['decoded float32', result], ['rounding error', decoded - number]]),
    },
  }));
}

export function traceFactors(values) {
  const [number] = values;
  if (values.length !== 1 || !Number.isInteger(number) || number < 1) {
    throw new Error('factors-input');
  }
  const steps = [];
  primeFactors(number, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'factors',
    },
  }));
  return steps;
}

export function traceComplex(values) {
  if (values.length !== 4 || !values.every(Number.isFinite)
    || (values[2] === 0 && values[3] === 0)) throw new Error('complex-input');
  const [a, b, c, d] = values;
  const first = new ComplexNumber({ re: a, im: b });
  const second = new ComplexNumber({ re: c, im: d });
  const format = (z) => `${Number(z.re.toPrecision(6))} ${z.im < 0 ? '−' : '+'} ${Number(Math.abs(z.im).toPrecision(6))}i`;
  const operations = [
    ['add', first.add(second), 're: this.re + complexAddend.re,'],
    ['subtract', first.subtract(second), 're: this.re - complexSubtrahend.re,'],
    ['multiply', first.multiply(second), 're: this.re * complexMultiplicand.re - this.im * complexMultiplicand.im,'],
    ['divide', first.divide(second), 're: finalDivident.re / finalDivider,'],
    ['conjugate', first.conjugate(first), 'im: -1 * complexNumber.im,'],
  ];
  const points = [first, second, ...operations.map(([, z]) => z)];
  const scale = Math.max(1, ...points.map((z) => Math.max(Math.abs(z.re), Math.abs(z.im)))) * 1.2;
  const cells = [['z₁', format(first)], ['z₂', format(second)]];
  const snapshot = (type, z, code) => ({
    type: String(type),
    array: [],
    indices: [],
    code: String(code),
    variables: {
      mode: 'complex',
      scale,
      operation: String(type),
      result: format(z),
      expression: `${type === 'start' ? 'z₁' : `z₁ ${{
        add: '+', subtract: '−', multiply: '×', divide: '÷',
      }[type] || type} z₂`} = ${format(z)}`,
      points: JSON.stringify([[first.re, first.im, 'z₁'], [second.re, second.im, 'z₂'],
        [z.re, z.im, 'result']]),
      cells: JSON.stringify(cells),
    },
  });
  const steps = [snapshot('start', first, 'constructor({ re = 0, im = 0 } = {}) {')];
  operations.forEach(([type, z, code]) => {
    cells.push([type, format(z)]);
    const step = snapshot(type, z, code);
    if (type === 'conjugate') step.variables.expression = `conjugate(z₁) = ${format(z)}`;
    steps.push(step);
  });
  const polar = first.getPolarForm();
  cells.push(['|z₁|', polar.radius], ['arg(z₁) · radians', polar.phase]);
  const done = snapshot('done', first, 'radius: this.getRadius(),');
  done.variables.expression = `z₁ = ${polar.radius.toPrecision(6)} × e^(i × ${polar.phase.toPrecision(6)})`;
  steps.push(done);
  return steps;
}

export function traceRadian(values) {
  const [degree] = values;
  if (values.length !== 1 || !Number.isFinite(degree)) throw new Error('float-input');
  const radian = degreeToRadian(degree);
  const restored = radianToDegree(radian);
  return [
    ['start', 'return degree * (Math.PI / 180);', `${degree}°`, '—'],
    ['convert', 'return degree * (Math.PI / 180);',
      `${degree} × π ÷ 180 = ${radian.toPrecision(7)} rad`, radian],
    ['done', 'return radian * (180 / Math.PI);',
      `${radian.toPrecision(7)} × 180 ÷ π = ${restored.toPrecision(7)}°`, restored],
  ].map(([type, code, expression, result]) => ({
    type: String(type),
    code: String(code),
    array: [],
    indices: [],
    variables: {
      mode: 'radian',
      degree,
      radian,
      expression,
      result,
      cells: JSON.stringify([['degrees', degree], ['radians', radian],
        ['turns', degree / 360], ['restored degrees', restored]]),
    },
  }));
}

export function tracePower(values) {
  const [base, power] = values;
  if (values.length !== 2 || !values.every(Number.isInteger)
    || Math.abs(base) > 20 || power < 0 || power > 12) throw new Error('power-input');
  const steps = [];
  const stack = [];
  fastPowering(base, power, (step) => {
    if (step.type === 'enter') stack.push(step.variables.power);
    steps.push({
      ...step,
      variables: {
        ...step.variables, mode: 'power', stack: stack.join(' → '),
      },
    });
    if (step.type !== 'enter') stack.pop();
  });
  steps[0].type = 'start';
  steps[steps.length - 1].type = 'done';
  return steps;
}

export function traceHorner(values, x) {
  if (!values.length || values.length > 8 || !values.every(Number.isFinite)
    || !Number.isFinite(x) || Math.abs(x) > 10) throw new Error('horner-input');
  const steps = [];
  const result = hornerMethod(values, x, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'horner',
    },
  }));
  const last = steps[steps.length - 1];
  steps.push({
    ...last,
    type: 'done',
    code: 'return result;',
    variables: {
      ...last.variables, result, expression: `P(${x}) = ${result}`,
    },
  });
  return steps;
}

export function traceMatrix(inputs) {
  const matrices = inputs.map((input) => {
    let matrix;
    try { matrix = JSON.parse(input); } catch (error) { throw new Error('matrix-input'); }
    if (!Array.isArray(matrix) || !matrix.length || matrix.length > 4
      || !matrix.every((row) => Array.isArray(row) && row.length > 0 && row.length <= 4
        && row.length === matrix[0].length && row.every((value) => (
        typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 999
      )))) throw new Error('matrix-input');
    return matrix;
  });
  if (matrices.length !== 2 || matrices[0][0].length !== matrices[1].length) {
    throw new Error('matrix-shape');
  }
  const steps = [];
  dot(...matrices, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'matrix-product',
    },
  }));
  return steps;
}
