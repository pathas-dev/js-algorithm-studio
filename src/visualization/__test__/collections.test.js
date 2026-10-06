import traceCartesian from '../collections';

it('creates unique ordered pairs and handles an empty set', () => {
  const steps = traceCartesian(['1, 2, 1', 'a b']);
  expect(JSON.parse(steps.at(-1).variables.groups))
    .toEqual([['1', 'a'], ['1', 'b'], ['2', 'a'], ['2', 'b']]);
  expect(JSON.parse(steps[1].variables.groups)).toEqual([['1', 'a']]);
  expect(traceCartesian(['', 'a']).at(-1).variables.count).toBe(0);
  expect(() => traceCartesian(['1 2 3 4 5 6 7', 'a'])).toThrow('cartesian-input');
});
