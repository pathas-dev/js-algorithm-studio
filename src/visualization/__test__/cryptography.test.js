import tracePolynomialHash, { traceRailFence, traceCaesar } from '../cryptography';
import PolynomialHash from '../../algorithms/cryptography/polynomial-hash/PolynomialHash';

it('rolls each Unicode window to the same hash as a fresh calculation', () => {
  const hasher = new PolynomialHash();
  ['banana', 'a😀집😀', 'aaaa'].forEach((text) => {
    const chars = Array.from(text);
    const steps = tracePolynomialHash([text, '2']);
    const windows = steps.filter((step) => step.type === 'window');
    expect(windows.map((step) => step.variables.hash)).toEqual(chars.slice(1).map((_, i) => (
      hasher.hash(chars.slice(i, i + 2).join(''))
    )));
    expect(windows.every((step) => step.variables.verified)).toBe(true);
    expect(steps.some((step) => step.type === 'remove')).toBe(true);
  });
  expect(tracePolynomialHash(['😀', '1']).at(-1).variables.result)
    .toBe(String(hasher.hash('😀')));
  expect(() => tracePolynomialHash(['abc', '4'])).toThrow('hash-input');
  expect(() => tracePolynomialHash(['', '1'])).toThrow('hash-input');
});

it('places rail characters on the actual zigzag and restores Unicode plaintext', () => {
  const steps = traceRailFence(['WEAREDISCOVERED', '3']);
  expect(steps.at(-1).variables.result).toBe('WECRERDSOEEAIVD');
  expect(steps.filter((step) => step.type === 'place').map((step) => step.variables.currentRail))
    .toEqual([0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2]);
  expect(steps.at(-1).variables.restored).toBe('WEAREDISCOVERED');
  expect(traceRailFence(['a😀 집', '6']).at(-1).variables.restored).toBe('a😀 집');
  expect(() => traceRailFence(['abc', '1'])).toThrow('rail-input');
});

it('shows Caesar substitutions with wrapping, negative shifts and unchanged symbols', () => {
  const steps = traceCaesar(['Hello, xyz!', '3']);
  expect(steps.at(-1).variables.result).toBe('khoor, abc!');
  expect(steps.at(-1).variables.restored).toBe('hello, xyz!');
  expect(steps.filter((step) => step.type === 'substitute')).toHaveLength(11);
  expect(traceCaesar(['ab 집😀', '-1']).at(-1).variables.result).toBe('za 집😀');
  expect(traceCaesar(['abc', '26']).at(-1).variables.result).toBe('abc');
  expect(() => traceCaesar(['abc', '0.5'])).toThrow('caesar-input');
});
