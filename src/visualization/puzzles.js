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
