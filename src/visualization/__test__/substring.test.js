import { traceSubstring } from '../dynamic';

it('finds contiguous Unicode spans and keeps previous matrix snapshots immutable', () => {
  const steps = traceSubstring('ABABC', 'BABCA');
  expect(steps.at(-1).variables.result).toBe('BABC');
  expect(steps.at(-1).variables.length).toBe(4);
  expect(JSON.parse(steps[0].variables.dpMatrix)[0][0]).toBeNull();
  expect(steps.some((step) => step.type === 'cell-zero')).toBe(true);
  expect(traceSubstring('😀x', '😀y').at(-1).variables.result).toBe('😀');
  expect(traceSubstring('', '').at(-1).variables.length).toBe(0);
  expect(() => traceSubstring('a'.repeat(13), '')).toThrow('dp-codepoints');
});
