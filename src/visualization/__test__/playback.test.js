import fs from 'fs';
import path from 'path';
import binarySearch from '../../algorithms/search/binary-search/binarySearch';
import linearSearch from '../../algorithms/search/linear-search/linearSearch';
import QuickSortInPlace from '../../algorithms/sorting/quick-sort/QuickSortInPlace';
import MergeSort from '../../algorithms/sorting/merge-sort/MergeSort';
import InsertionSort from '../../algorithms/sorting/insertion-sort/InsertionSort';
import SelectionSort from '../../algorithms/sorting/selection-sort/SelectionSort';
import ShellSort from '../../algorithms/sorting/shell-sort/ShellSort';
import BubbleSort from '../../algorithms/sorting/bubble-sort/BubbleSort';
import {
  MAX_VALUES, algorithmCode, parseTarget, parseValues, playbackReducer, requireSorted,
} from '../playback';

describe('visualizer execution and playback', () => {
  it.each([[ShellSort, 'shell-sort/ShellSort'], [BubbleSort, 'bubble-sort/BubbleSort'], [SelectionSort, 'selection-sort/SelectionSort'], [InsertionSort, 'insertion-sort/InsertionSort'], [MergeSort, 'merge-sort/MergeSort'], [QuickSortInPlace, 'quick-sort/QuickSortInPlace']])('records %s results without changing inputs or past snapshots', (Sorter, file) => {
    const source = algorithmCode(fs.readFileSync(path.join(__dirname, `../../algorithms/sorting/${file}.js`), 'utf8'));
    expect(source).not.toContain('this.recordStep(');
    [[], [1], [1, 2, 3], [3, 2, 1], [0, -2, -2, 4], Array(MAX_VALUES).fill(2)].forEach((input) => {
      const original = [...input];
      const steps = [];
      const result = new Sorter({ stepCallback: (step) => steps.push(step) }).sort(input);
      expect(input).toEqual(original);
      expect(result).toEqual([...input].sort((a, b) => a - b));
      expect(steps[0].array).toEqual(original);
      expect(steps[steps.length - 1].array).toEqual(result);
      expect(steps[steps.length - 1].type).toBe('done');
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((index) => index >= 0 && index < step.array.length)).toBe(true);
      });
      if (steps.length > 1) {
        steps[steps.length - 1].array.push(1000);
        expect(steps[0].array).toEqual(original);
      }
    });
    const objectSteps = [];
    const objects = [2, 1, 2, -3].map((value, id) => ({ value, id }));
    const objectResult = new Sorter({
      compareCallback: (a, b) => a.value - b.value,
      stepCallback: (step) => objectSteps.push(step),
    }).sort(objects);
    expect(objectResult.map((item) => item.value)).toEqual([-3, 1, 2, 2]);
    objectSteps.forEach((step) => {
      expect(new Set(step.array.map((item) => item.id)).size).toBe(step.array.length);
    });
    const items = [{ value: 2, id: 0 }, { value: 1, id: 1 }, { value: 2, id: 2 }];
    const result = new BubbleSort({ compareCallback: (a, b) => a.value - b.value }).sort(items);
    expect(result.map((item) => item.id)).toEqual([1, 0, 2]);
  });

  it('records linear search matches, misses and empty arrays without mutating input', () => {
    const source = algorithmCode(fs.readFileSync(path.join(__dirname, '../../algorithms/search/linear-search/linearSearch.js'), 'utf8'));
    [[], [1], [2, 1, 2, -1], [1, 1, 1]].forEach((input) => {
      [-1, 1, 2, 10].forEach((target) => {
        const steps = [];
        const original = [...input];
        const result = linearSearch(input, target, undefined, (step) => steps.push(step));
        expect(result).toEqual(linearSearch(input, target));
        expect(input).toEqual(original);
        expect(steps[0].type).toBe('start');
        expect(steps[steps.length - 1].type).toBe('done');
        expect(steps[steps.length - 1].indices).toEqual(result);
        steps.forEach((step) => {
          expect(source).toContain(step.code);
          expect(step.array).toEqual(original);
          expect(step.indices.every((index) => index >= 0 && index < input.length)).toBe(true);
        });
      });
    });
  });

  it('records binary search boundaries, matches and misses', () => {
    const source = algorithmCode(fs.readFileSync(path.join(__dirname, '../../algorithms/search/binary-search/binarySearch.js'), 'utf8'));
    [[], [1], [-2, 0, 1, 1, 3, 5], [1, 1, 1]].forEach((input) => {
      [-3, -2, 0, 1, 2, 3, 5, 10].forEach((target) => {
        const steps = [];
        const result = binarySearch(input, target, undefined, (step) => steps.push(step));
        expect(result).toBe(binarySearch(input, target));
        const last = steps[steps.length - 1];
        expect(last.type).toBe('done');
        expect(last.indices).toEqual(result === -1 ? [] : [result]);
        steps.forEach((step) => {
          expect(source).toContain(step.code);
          expect(step.array).toEqual(input);
          expect(step.indices.every((index) => index >= 0 && index < input.length)).toBe(true);
        });
      });
    });
  });

  it('validates user values before recording bounded snapshots', () => {
    expect(parseValues('')).toEqual([]);
    expect(parseTarget('-2.5')).toBe(-2.5);
    expect(() => requireSorted([3, 1])).toThrow('sorted');
    expect(() => requireSorted([-2, -2, 0, 3])).not.toThrow();
    expect(() => requireSorted([])).not.toThrow();
    expect(() => parseTarget('')).toThrow('target');
    expect(() => parseTarget('1,2')).toThrow('target');
    expect(parseValues(' 1, -2  3.5, .5 ')).toEqual([1, -2, 3.5, 0.5]);
    ['1,,2', ',1', '1,', 'NaN', 'Infinity', '0x10', '1e2', '1+2'].forEach((text) => {
      expect(() => parseValues(text)).toThrow('invalid');
    });
    expect(() => parseValues('1000')).toThrow('range');
    expect(() => parseValues('-1000')).toThrow('range');
    expect(() => parseValues(Array(MAX_VALUES + 1).fill(1).join(','))).toThrow('limit');
    expect(parseValues(Array(MAX_VALUES).fill(999).join(','))).toHaveLength(MAX_VALUES);
  });

  it('seeks reversibly, pauses on seek/reset, ignores stale ticks, and stops at the end', () => {
    const initial = {
      index: 0, playing: false, length: 3, speed: 1,
    };
    let state = playbackReducer(initial, { type: 'toggle' });
    state = playbackReducer(state, { type: 'tick' });
    expect(state.index).toBe(1);
    state = playbackReducer(state, { type: 'seek', index: 0 });
    expect(state).toEqual(initial);
    expect(playbackReducer(state, { type: 'tick' })).toEqual(initial);
    state = playbackReducer(state, { type: 'seek', index: 99 });
    expect(state.index).toBe(2);
    state = playbackReducer(state, { type: 'toggle' });
    expect(state.index).toBe(0);
    state = playbackReducer(state, { type: 'tick' });
    state = playbackReducer(state, { type: 'tick' });
    expect(state.playing).toBe(false);
    expect(playbackReducer(state, { type: 'tick' })).toEqual(state);
    state = playbackReducer(state, { type: 'speed', speed: 2 });
    state = playbackReducer(state, { type: 'reset', length: 2 });
    expect(state).toEqual({
      index: 0, playing: false, length: 2, speed: 2,
    });
    expect(playbackReducer(state, { type: 'seek', index: -1 }).index).toBe(0);
    expect(playbackReducer(state, { type: 'unknown' })).toBe(state);
  });
});
