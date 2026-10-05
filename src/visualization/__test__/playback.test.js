import fs from 'fs';
import path from 'path';
import BubbleSort from '../../algorithms/sorting/bubble-sort/BubbleSort';
import {
  MAX_VALUES, algorithmCode, parseValues, playbackReducer,
} from '../playback';

describe('visualizer execution and playback', () => {
  it('records sorting results without changing inputs or past snapshots', () => {
    const source = algorithmCode(fs.readFileSync(path.join(__dirname, '../../algorithms/sorting/bubble-sort/BubbleSort.js'), 'utf8'));
    expect(source).not.toContain('this.recordStep(');
    [[], [1], [1, 2, 3], [3, 2, 1], [0, -2, -2, 4], Array(MAX_VALUES).fill(2)].forEach((input) => {
      const original = [...input];
      const steps = [];
      const result = new BubbleSort({ stepCallback: (step) => steps.push(step) }).sort(input);
      expect(input).toEqual(original);
      expect(result).toEqual([...input].sort((a, b) => a - b));
      expect(steps[0].array).toEqual(original);
      expect(steps[steps.length - 1].array).toEqual(result);
      expect(steps[steps.length - 1].type).toBe('done');
      steps.forEach((step) => {
        expect(source).toContain(step.code);
        expect(step.indices.every((index) => index >= 0 && index < input.length)).toBe(true);
      });
      if (steps.length > 1) {
        steps[steps.length - 1].array.push(1000);
        expect(steps[0].array).toEqual(original);
      }
    });
    const items = [{ value: 2, id: 0 }, { value: 1, id: 1 }, { value: 2, id: 2 }];
    const result = new BubbleSort({ compareCallback: (a, b) => a.value - b.value }).sort(items);
    expect(result.map((item) => item.id)).toEqual([1, 0, 2]);
  });

  it('validates user values before recording bounded snapshots', () => {
    expect(parseValues('')).toEqual([]);
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
