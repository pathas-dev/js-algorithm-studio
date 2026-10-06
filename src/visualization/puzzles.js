import nQueens from '../algorithms/uncategorized/n-queens/nQueens';
import dpRainTerraces from '../algorithms/uncategorized/rain-terraces/dpRainTerraces';
import dpUniquePaths from '../algorithms/uncategorized/unique-paths/dpUniquePaths';
import greedyJumpGame from '../algorithms/uncategorized/jump-game/greedyJumpGame';
import squareMatrixRotation from '../algorithms/uncategorized/square-matrix-rotation/squareMatrixRotation';
import hanoiTower from '../algorithms/uncategorized/hanoi-tower/hanoiTower';
import Stack from '../data-structures/stack/Stack';

export default function traceHanoi(values) {
  const n = values[0];
  if (values.length !== 1 || !Number.isInteger(n) || n < 1 || n > 6) {
    throw new Error('hanoi-input');
  }
  const poles = [new Stack(), new Stack(), new Stack()];
  const steps = [];
  let previous = [[], [], []];
  let moves = 0;
  hanoiTower({
    numberOfDiscs: n,
    fromPole: poles[0],
    withPole: poles[1],
    toPole: poles[2],
    moveCallback: () => {},
    stepCallback: (step) => {
      const current = poles.map((pole) => pole.toArray());
      const from = previous.findIndex((pole, index) => pole.length > current[index].length);
      const to = current.findIndex((pole, index) => pole.length > previous[index].length);
      if (step.type === 'move') moves += 1;
      steps.push({
        ...step,
        variables: {
          ...step.variables,
          mode: 'hanoi',
          n,
          moves,
          from,
          to,
          poles: JSON.stringify(current),
        },
      });
      previous = current;
    },
  });
  steps.push({
    type: 'done',
    array: [],
    indices: [],
    code: 'toPole.push(disc)',
    variables: {
      mode: 'hanoi', n, moves, poles: JSON.stringify(previous), result: moves,
    },
  });
  return steps;
}

export function traceRotation(values) {
  let matrix;
  try { matrix = JSON.parse(values[0]); } catch (_) { throw new Error('rotation-input'); }
  if (!Array.isArray(matrix) || !matrix.length || matrix.length > 6
    || !matrix.every((row) => Array.isArray(row) && row.length === matrix.length
      && row.every((value) => Number.isFinite(value) && Math.abs(value) <= 999))) {
    throw new Error('rotation-input');
  }
  const input = JSON.stringify(matrix);
  const steps = [];
  squareMatrixRotation(matrix, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables,
      mode: 'rotation',
      input,
      result: step.type === 'done' ? step.variables.matrix : '—',
    },
  }));
  return steps;
}

export function traceJump(values) {
  if (!values.length || values.length > 18
    || !values.every((value) => Number.isInteger(value) && value >= 0 && value <= 12)) {
    throw new Error('jump-input');
  }
  const steps = [];
  const good = [values.length - 1];
  greedyJumpGame(values, (step) => {
    if (step.type === 'good') good.push(step.variables.numberIndex);
    steps.push({
      ...step,
      array: step.array.map((value, id) => ({ value, id })),
      variables: { ...step.variables, mode: 'jump', matches: good.join(',') },
    });
  });
  return steps;
}

export function tracePaths(values, height) {
  const width = values[0];
  if (values.length !== 1 || ![width, height].every((value) => (
    Number.isInteger(value) && value >= 1 && value <= 10
  ))) throw new Error('paths-input');
  const steps = [];
  dpUniquePaths(width, height, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables,
      mode: 'paths',
      width,
      height,
      rows: JSON.stringify(Array.from({ length: height }, (_, i) => String(i))),
      columns: JSON.stringify(Array.from({ length: width }, (_, i) => String(i))),
    },
  }));
  return steps;
}

export function traceRain(values) {
  if (!values.length || values.length > 18
    || !values.every((value) => Number.isInteger(value) && value >= 0 && value <= 12)) {
    throw new Error('rain-input');
  }
  const steps = [];
  dpRainTerraces(values, (step) => steps.push({
    ...step,
    array: step.array.map((value, id) => ({ value, id })),
    variables: { ...step.variables, mode: 'rain' },
  }));
  return steps;
}

export function traceQueens(values) {
  const n = values[0];
  if (values.length !== 1 || !Number.isInteger(n) || n < 1 || n > 6) {
    throw new Error('queens-input');
  }
  const steps = [{
    type: 'start',
    array: [],
    indices: [],
    code: 'const queensPositions = Array(queensCount).fill(null)',
    variables: {
      mode: 'queens', n, count: 0, positions: '[]',
    },
  }];
  const solutions = nQueens(n, (step) => steps.push({
    ...step,
    variables: { ...step.variables, mode: 'queens', n },
  }));
  const coordinates = solutions.map((solution) => solution.map((queen) => (
    [queen.rowIndex, queen.columnIndex]
  )));
  steps.push({
    type: 'done',
    array: [],
    indices: [],
    code: 'return solutions',
    variables: {
      mode: 'queens',
      n,
      count: solutions.length,
      result: solutions.length,
      positions: JSON.stringify(coordinates[0] || []),
      solutions: JSON.stringify(coordinates),
    },
  });
  return steps;
}
