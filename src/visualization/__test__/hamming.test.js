import { traceHamming } from '../strings';

it('counts aligned UTF-16 differences, preserves snapshots and rejects unequal lengths', () => {
  const steps = traceHamming('karolin', 'kathrin');
  expect(steps.at(-1).variables.result).toBe(3);
  expect(JSON.parse(steps.at(-1).variables.differences)).toEqual([2, 3, 4]);
  expect(steps[0].variables.differences).toBe('[]');
  expect(traceHamming('', '').at(-1).variables.result).toBe(0);
  expect(traceHamming('😀', '😃').at(-1).variables.result).toBe(1);
  expect(() => traceHamming('a', '')).toThrow('hamming-length');
});
