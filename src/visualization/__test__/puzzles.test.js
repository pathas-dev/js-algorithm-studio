import traceHanoi from '../puzzles';

it('moves Hanoi discs legally and reaches the destination in 2^n−1 moves', () => {
  [1, 3, 6].forEach((n) => {
    const steps = traceHanoi([n]);
    expect(steps.at(-1).variables.moves).toBe(2 ** n - 1);
    expect(JSON.parse(steps.at(-1).variables.poles)).toEqual([
      [], [], Array.from({ length: n }, (_, i) => i + 1),
    ]);
    steps.forEach((step) => JSON.parse(step.variables.poles).forEach((pole) => {
      expect(pole.every((disc, index) => !index || pole[index - 1] < disc)).toBe(true);
    }));
  });
  expect(() => traceHanoi([0])).toThrow('hanoi-input');
});
