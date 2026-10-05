import fs from 'fs';
import path from 'path';
import Stack from '../../data-structures/stack/Stack';
import { parseOperations, traceStack, traceQueue } from '../structures';

describe('structure lessons', () => {
  it('validates operation names, arguments and bounds before execution', () => {
    const commands = { push: 1, pop: 0, peek: 0 };
    expect(parseOperations('', commands)).toEqual([]);
    expect(parseOperations('push -2.5; peek\npop', commands)).toEqual([
      { name: 'push', value: -2.5 }, { name: 'peek', value: undefined }, { name: 'pop', value: undefined },
    ]);
    ['wat', 'toString', 'push', 'push 1 2', 'pop 1', 'push NaN', 'push 1000', 'pop,'].forEach((text) => {
      expect(() => parseOperations(text, commands)).toThrow('operations');
    });
    expect(() => parseOperations(Array(65).fill('pop').join(','), commands)).toThrow('operations-limit');
  });

  it('executes the real stack with immutable states and stable node identities', () => {
    const values = [3, -2.5, 3];
    const steps = traceStack(values, 'peek, pop, push 7, pop, pop, pop, peek, pop');
    const real = new Stack();
    values.forEach((value) => real.push(value));
    const expected = [real.peek(), real.pop()];
    real.push(7);
    expected.push(real.pop(), real.pop(), real.pop(), real.peek(), real.pop());
    expect(steps.filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual(expected.map((value) => (value === null ? 'null' : value)));
    expect(steps[0].array).toEqual([]);
    expect(steps[3].array.map((item) => item.value)).toEqual([3, -2.5, 3]);
    expect(steps[4].array[0].id).toBe(steps[3].array[0].id);
    expect(steps[5].array[0].id).toBe(steps[3].array[1].id);
    expect(steps[6].array[0].id).not.toBe(steps[3].array[0].id);
    expect(steps.at(-1).array).toEqual(real.toArray());
    expect(values).toEqual([3, -2.5, 3]);
    const source = fs.readFileSync(path.resolve(__dirname, '../../data-structures/stack/Stack.js'), 'utf8');
    steps.forEach((step) => {
      expect(source).toContain(step.code);
      expect(new Set(step.array.map((item) => item.id)).size).toBe(step.array.length);
      expect(step.indices.every((index) => index >= 0 && index < step.array.length)).toBe(true);
    });
    expect(traceStack([])).toHaveLength(2);
    expect(() => traceStack(Array(33).fill(1))).toThrow('limit');
    expect(() => traceStack(Array(32).fill(1), 'push 2')).toThrow('capacity');
    expect(traceStack(Array(32).fill(1), 'pop, push 2').at(-1).array[0].value).toBe(2);
  });
  it('enqueues at the rear and dequeues at the front without changing older snapshots', () => {
    const steps = traceQueue([3, 3, -1.5], 'peek, enqueue 9, dequeue, dequeue, peek, dequeue, dequeue, dequeue, peek');
    expect(steps[3].array.map((item) => item.value)).toEqual([3, 3, -1.5]);
    expect(steps[5].array.map((item) => item.value)).toEqual([3, 3, -1.5, 9]);
    expect(steps[6].array[0].id).toBe(steps[3].array[1].id);
    expect(steps.filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual([3, 3, 3, -1.5, -1.5, 9, 'null', 'null']);
    expect(steps.at(-1).array).toEqual([]);
    const source = fs.readFileSync(path.resolve(__dirname, '../../data-structures/queue/Queue.js'), 'utf8');
    steps.forEach((step) => expect(source).toContain(step.code));
    expect(traceQueue([])).toHaveLength(2);
    expect(() => traceQueue(Array(32).fill(1), 'enqueue 2')).toThrow('capacity');
  });
});
