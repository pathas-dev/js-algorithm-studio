import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true }, appType: 'custom' });
try {
  const { initialBubblePlayback, bubblePlaybackReducer: reduce, advanceBubblePlayback: advance } = await server.ssrLoadModule('/bubble-playback.ts');
  const { bubble } = await server.ssrLoadModule('/algorithms.ts');
  let state = reduce(initialBubblePlayback(3), { type: 'toggle' });
  state = advance(state, 2799);
  assert.equal(state.index, 0);
  assert.equal(state.time, 2799);
  state = advance(state, 1);
  assert.equal(state.index, 1);
  state = reduce(state, { type: 'speed', speed: 2 });
  state = advance(state, 1400);
  assert.equal(state.index, 2);
  assert.equal(state.phase, 'hold');
  assert.equal(state.time, 5600, 'background time continues across steps and follows speed');
  state = reduce(state, { type: 'speed', speed: 1 });
  for (const phase of ['hold', 'erode', 'form']) {
    assert.equal(state.phase, phase);
    state = advance(state, 500);
    const paused = reduce(state, { type: 'toggle' });
    assert.deepEqual(advance(paused, 20000), paused, `${phase}: pause must freeze the whole scene`);
    state = reduce(paused, { type: 'toggle' });
    state = advance(state, phase === 'form' ? 2500 : 5500);
  }
  assert.equal(state.phase, 'sort');
  assert.equal(state.index, 0);
  assert.equal(state.playing, true);
  const sought = reduce({ ...state, phase: 'erode', elapsed: 2000 }, { type: 'seek', index: 1 });
  assert.equal(sought.phase, 'sort');
  assert.equal(sought.elapsed, 0);
  assert.equal(sought.time, 2800, 'seeking restores a deterministic background snapshot');
  assert.equal(sought.animate, false);
  assert.equal(sought.playing, false);
  const stopped = advance(reduce(initialBubblePlayback(2), { type: 'loop', loop: false }), 10000);
  assert.equal(stopped.index, 0); // Paused states never advance.
  const oneRun = advance(reduce(stopped, { type: 'toggle' }), 2800);
  assert.equal(oneRun.index, 1);
  assert.equal(oneRun.playing, false);
  assert.equal(oneRun.time, 2800);
  const overshot = advance(reduce(stopped, { type: 'toggle' }), 10000);
  assert.equal(overshot.time, 2800, 'finite playback stops its background at the final step');
  const loopOff = reduce({ ...state, phase: 'erode' }, { type: 'loop', loop: false });
  assert.equal(loopOff.index, 2);
  assert.equal(loopOff.phase, 'sort');
  assert.equal(loopOff.playing, false);
  const reduced = advance({ ...initialBubblePlayback(2), playing: true, reduced: true }, 8800);
  assert.equal(reduced.phase, 'sort');
  assert.equal(reduced.index, 0);
  for (const values of [[], [0], [-3, 2, -3, 0, 1.5], Array.from({ length: 32 }, (_, i) => 31 - i)]) {
    const source = [...values];
    const trace = bubble.run(values);
    assert.deepEqual(values, source);
    assert.equal(trace.at(-1).type, 'done');
    assert.deepEqual(trace.at(-1).array.map((item) => item.value), [...values].sort((a, b) => a - b));
    assert.equal(new Set(trace.at(-1).array.map((item) => item.id)).size, values.length);
    const total = (trace.length - 1) * 2800 + 15000;
    const cycled = advance({ ...initialBubblePlayback(trace.length), playing: true }, total);
    assert.equal(cycled.index, 0);
    assert.equal(cycled.phase, 'sort');
    assert.equal(cycled.playing, true);
    assert.equal(cycled.time, total, 'background time stays continuous through erosion and reformation');
  }
  console.log('Checked slow timing, all loop phases, pause/resume, speed, seeking, loop off, reduced motion, and four input shapes.');
} finally { await server.close(); }
