import { traceRegex } from '../dynamic';

it('matches entire strings with dot and star, including empty prefixes', () => {
  expect(traceRegex('aab', 'c*a*b').at(-1).variables.result).toBe(true);
  expect(traceRegex('ab', 'a').at(-1).variables.result).toBe(false);
  expect(traceRegex('', 'a*').at(-1).variables.result).toBe(true);
  expect(traceRegex('', '').at(-1).variables.result).toBe(true);
  expect(traceRegex('ab', '.*').at(-1).variables.result).toBe(true);
  expect(() => traceRegex('a', '*a')).toThrow('regex-pattern');
  expect(() => traceRegex('a', 'a**')).toThrow('regex-pattern');
  expect(JSON.parse(traceRegex('a', 'a')[0].variables.dpMatrix)[0][0]).toBeNull();
});
