import tracePolynomialHash from '../cryptography';
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
