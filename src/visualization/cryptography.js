import { encodeRailFenceCipher, decodeRailFenceCipher } from '../algorithms/cryptography/rail-fence-cipher/railFenceCipher';
import PolynomialHash from '../algorithms/cryptography/polynomial-hash/PolynomialHash';

export default function tracePolynomialHash(values) {
  const characters = Array.from(values[0]);
  const width = Number(values[1]);
  if (!characters.length || characters.length > 24 || !Number.isInteger(width)
    || width < 1 || width > 12 || width > characters.length) throw new Error('hash-input');
  const hasher = new PolynomialHash();
  const steps = [];
  const rows = [];
  let previous = '';
  let hash = 0;
  const save = (type, variables, code) => steps.push({
    type,
    array: [],
    indices: [],
    code,
    variables: {
      mode: 'polynomial-hash',
      text: values[0],
      width,
      base: 37,
      modulus: 101,
      rows: JSON.stringify(rows),
      ...variables,
    },
  });
  save('start', { windowStart: 0, hash: 0 }, 'let hash = 0');
  for (let start = 0; start <= characters.length - width; start += 1) {
    const word = characters.slice(start, start + width).join('');
    const callback = (step) => save(step.type, {
      ...step.variables,
      windowStart: start,
      windowText: word,
    }, step.code);
    hash = start === 0 ? hasher.hash(word, callback) : hasher.roll(hash, previous, word, callback);
    rows.push([start, word, hash]);
    save('window', {
      windowStart: start,
      windowText: word,
      hash,
      verified: hash === hasher.hash(word),
    }, start === 0 ? 'hash %= this.modulus' : 'rollingHash %= this.modulus');
    previous = word;
  }
  save('done', {
    windowStart: characters.length - width,
    hash,
    result: rows.map((row) => row[2]).join(', '),
  }, 'return rollingHash');
  return steps;
}

export function traceRailFence(values) {
  const text = values[0];
  const characters = Array.from(text);
  const rails = Number(values[1]);
  if (!characters.length || characters.length > 24 || !Number.isInteger(rails)
    || rails < 2 || rails > 6) throw new Error('rail-input');
  const grid = Array.from({ length: rails }, () => Array(characters.length).fill(''));
  const steps = [];
  const save = (type, variables, code) => steps.push({
    type,
    array: [],
    indices: [],
    code,
    variables: {
      mode: 'rail-fence', text, rails, grid: JSON.stringify(grid), ...variables,
    },
  });
  save('start', { output: '' }, 'const fence = buildFence(railCount)');
  const result = encodeRailFenceCipher(text, rails, (step) => {
    const { currentRail, column, letter } = step.variables;
    grid[currentRail][column] = letter;
    save(step.type, step.variables, step.code);
  });
  for (let rail = 0; rail < rails; rail += 1) {
    save('read', {
      currentRail: rail,
      output: grid.slice(0, rail + 1).flat().join(''),
    }, "return filledFence.flat().join('')");
  }
  save(
    'done',
    { output: result, result, restored: decodeRailFenceCipher(result, rails) },
    "return filledFence.flat().join('')",
  );
  return steps;
}
