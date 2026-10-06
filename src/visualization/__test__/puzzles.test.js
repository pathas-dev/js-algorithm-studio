import traceHanoi, { traceRotation, traceJump } from '../puzzles';

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

it('rotates through independent transpose and reversal snapshots', () => {
  const steps = traceRotation(['[[1,2],[3,4]]']);
  expect(steps.at(-1).variables.matrix).toBe('[[3,1],[4,2]]');
  expect(steps.find((step) => step.type === 'transpose').variables.matrix).toBe('[[1,3],[2,4]]');
  expect(steps[0].variables.matrix).toBe('[[1,2],[3,4]]');
  expect(traceRotation(['[[9]]']).at(-1).variables.matrix).toBe('[[9]]');
  expect(() => traceRotation(['[[1,2]]'])).toThrow('rotation-input');
});

it('checks greedy jump reachability including blocked and singleton arrays', () => {
  expect(traceJump([2, 3, 1, 1, 4]).at(-1).variables.result).toBe(true);
  expect(traceJump([3, 2, 1, 0, 4]).at(-1).variables.result).toBe(false);
  expect(traceJump([0]).at(-1).variables.result).toBe(true);
  expect(traceJump([0, 1]).at(-1).variables.result).toBe(false);
  expect(() => traceJump([-1])).toThrow('jump-input');
});
