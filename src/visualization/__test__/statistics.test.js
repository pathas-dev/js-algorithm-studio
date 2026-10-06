import traceWeighted from '../statistics';
import weightedRandom from '../../algorithms/statistics/weighted-random/weightedRandom';

it('selects half-open weight intervals and never selects a zero-weight item', () => {
  expect(weightedRandom(['zero', 'one'], [0, 1], undefined, () => 0).item).toBe('one');
  expect(weightedRandom(['A', 'B'], [1, 1], undefined, () => 0.5).item).toBe('B');
  const steps = traceWeighted(['[["A",1],["B",4],["C",3]]', '0.62']);
  expect(steps.at(-1).variables.result).toBe('B');
  expect(steps.at(-1).variables.cumulative).toBe('[1,5,8]');
  expect(steps.at(-1).variables.randomNumber).toBe(4.96);
  expect(() => traceWeighted(['[["A",0]]', '0'])).toThrow('weighted-input');
  expect(() => traceWeighted(['[["A",1]]', '1'])).toThrow('weighted-input');
  expect(() => weightedRandom(['A'], [-1])).toThrow('Weights must');
});
