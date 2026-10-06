import traceHanoi, {
  traceRotation, traceJump, tracePaths, traceRain, traceQueens, traceKnight,
  traceStairs, traceStocks,
} from '../puzzles';

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

it('counts unique grid paths by adding independent upper and left entries', () => {
  const steps = tracePaths([4], 3);
  expect(steps.at(-1).variables.result).toBe(10);
  expect(steps.find((step) => step.type === 'cell-sum').variables.dependencies).toBe('[[0,1],[1,0]]');
  expect(tracePaths([1], 10).at(-1).variables.result).toBe(1);
  expect(tracePaths([10], 1).at(-1).variables.result).toBe(1);
  expect(() => tracePaths([0], 1)).toThrow('paths-input');
});

it('traps water using the lower of the two maximum walls', () => {
  const steps = traceRain([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
  expect(steps.at(-1).variables.result).toBe(6);
  expect(JSON.parse(steps.at(-1).variables.water)).toEqual([0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0]);
  expect(traceRain([3, 0, 3]).at(-1).variables.result).toBe(3);
  expect(traceRain([1, 2, 3]).at(-1).variables.result).toBe(0);
  expect(traceRain([0]).at(-1).variables.result).toBe(0);
  expect(() => traceRain([-1])).toThrow('rain-input');
});

it('enumerates safe N-Queens solutions and records actual backtracking', () => {
  const steps = traceQueens([4]);
  const solutions = JSON.parse(steps.at(-1).variables.solutions);
  expect(solutions).toHaveLength(2);
  solutions.forEach((solution) => solution.forEach(([row, col], i) => (
    solution.slice(i + 1).forEach(([r, c]) => {
      expect(col).not.toBe(c);
      expect(Math.abs(row - r)).not.toBe(Math.abs(col - c));
    })
  )));
  expect(steps.some((step) => step.type === 'backtrack')).toBe(true);
  expect(traceQueens([3]).at(-1).variables.result).toBe(0);
  expect(traceQueens([1]).at(-1).variables.result).toBe(1);
  expect(() => traceQueens([7])).toThrow('queens-input');
});

it('finds a legal complete knight tour and exhausts impossible small boards', () => {
  const steps = traceKnight([5]);
  const moves = JSON.parse(steps.at(-1).variables.moves);
  expect(moves).toHaveLength(25);
  expect(new Set(moves.map((position) => position.join(','))).size).toBe(25);
  moves.slice(1).forEach((position, i) => {
    const dx = Math.abs(position[0] - moves[i][0]);
    const dy = Math.abs(position[1] - moves[i][1]);
    expect([dx, dy].sort()).toEqual([1, 2]);
  });
  expect(steps.length).toBeLessThan(1000);
  expect(traceKnight([3]).at(-1).variables.result).toBe(false);
  expect(traceKnight([1]).at(-1).variables.result).toBe(true);
  expect(() => traceKnight([6])).toThrow('knight-input');
});

it('counts ordered one/two-step staircase climbs while preserving the zero convention', () => {
  expect(traceStairs([5]).at(-1).variables.result).toBe(8);
  expect(traceStairs([0]).at(-1).variables.result).toBe(0);
  expect(traceStairs([2]).at(-1).variables.result).toBe(2);
  expect(traceStairs([20]).at(-1).variables.result).toBe(10946);
  expect(() => traceStairs([21])).toThrow('stairs-input');
});

it('accumulates unlimited-trading gains without counting losses', () => {
  const steps = traceStocks([7, 1, 5, 3, 6, 4]);
  expect(steps.at(-1).variables.result).toBe(7);
  expect(JSON.parse(steps.at(-1).variables.history).map((row) => row[1])).toEqual([0, 4, 0, 3, 0]);
  expect(traceStocks([1, 2, 3, 4, 5]).at(-1).variables.result).toBe(4);
  expect(traceStocks([5, 4, 3]).at(-1).variables.result).toBe(0);
  expect(traceStocks([]).at(-1).variables.result).toBe(0);
  expect(() => traceStocks([-1])).toThrow('stocks-input');
});
