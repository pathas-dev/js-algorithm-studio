import { traceDeque } from '../structures';

it('preserves both-end ordering, node identities, empty results and capacity', () => {
  const steps = traceDeque([2, 3], 'addFront 1, addBack 4, removeFront, removeBack, peekFront, peekBack, size');
  expect(steps.at(-1).array.map((item) => item.value)).toEqual([2, 3]);
  expect(steps.find((step) => step.type === 'removeBack').variables.result).toBe(4);
  expect(steps.find((step) => step.type === 'peekFront').variables.result).toBe(2);
  expect(steps.find((step) => step.type === 'peekBack').variables.result).toBe(3);
  expect(steps.find((step) => step.type === 'size').variables.result).toBe(2);
  expect(steps[1].array[0].id).toBe(steps.at(-1).array[0].id);
  expect(traceDeque([], 'removeBack')[1].variables.result).toBe('null');
  expect(() => traceDeque(Array(32).fill(1), 'addFront 2')).toThrow('capacity');
});
