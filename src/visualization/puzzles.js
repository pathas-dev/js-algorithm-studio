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
