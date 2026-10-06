import { tracePalindrome } from '../strings';

it('compares Unicode code points literally and stops at the first mismatch', () => {
  expect(tracePalindrome('racecar').at(-1).variables.result).toBe(true);
  expect(tracePalindrome('😀a😀').at(-1).variables.result).toBe(true);
  expect(tracePalindrome('').at(-1).variables.result).toBe(true);
  expect(tracePalindrome('AbA').at(-1).variables.result).toBe(true);
  const rejected = tracePalindrome('abca');
  expect(rejected.at(-1).variables.result).toBe(false);
  expect(JSON.parse(rejected.at(-1).variables.differences)).toEqual([1, 2]);
  expect(() => tracePalindrome('a'.repeat(49))).toThrow('palindrome-length');
});
