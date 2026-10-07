import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ configFile: 'web/vite.config.mts', server: { middlewareMode: true }, appType: 'custom' });
try {
  const { initialBubblePlayback, bubblePlaybackReducer: reduce, advanceBubblePlayback: advance } = await server.ssrLoadModule('/bubble-playback.ts');
  const { bubble } = await server.ssrLoadModule('/algorithms.ts');
  const { springProgress, workStar, planetRadius, planetSpacing, orbitalSwap, axialAngle } = await server.ssrLoadModule('/bubble-motion.ts');
  for (const id of [0, 1, 6]) {
    assert.equal(axialAngle(0, id), id * 0.8);
    assert.equal(axialAngle(-100, id), axialAngle(0, id));
    const first = axialAngle(1000, id) - axialAngle(0, id);
    assert(Math.abs(axialAngle(2000, id) - axialAngle(1000, id) - first) < 1e-12, 'axial spin has constant speed');
    assert(Math.abs(axialAngle(2000, id, 0.12) - id * 0.8 - first * 2 * 0.12 / 0.22) < 1e-12);
  }
  assert.notEqual(axialAngle(1000, 0), axialAngle(1000, 1) - 0.8, 'individual bodies have different rates');
  assert(axialAngle(4000, 0) - axialAngle(0, 0) > 0.7, 'a paused planet has a visibly rotating surface within four seconds of its independent clock');
  assert.equal(planetRadius(0, 8), 0.13);
  assert.equal(planetRadius(-3, 8), planetRadius(3, 8));
  assert.equal(planetRadius(8, 8), 0.53);
  assert(planetRadius(3, 8) > planetRadius(1, 8));
  assert(Number.isFinite(planetRadius(0, 1)));
  for (const values of [[8, 8, 8], [-3, 0, 2.5, -3, 8], [0, 0], Array(32).fill(9)]) {
    const maximum = Math.max(1, ...values.map(Math.abs));
    const spacing = planetSpacing(values, maximum);
    const envelope = Math.max(...values.map((value) => planetRadius(value, maximum) * 1.7));
    let previousPoint = orbitalSwap(0, spacing, 0);
    let distance;
    for (let i = 1; i <= 100; i += 1) {
      const a = orbitalSwap(0, spacing, i / 100);
      const b = orbitalSwap(spacing, 0, i / 100);
      assert(Math.hypot(a[0] - b[0], a[1] - b[1]) > envelope * 2, 'ring envelopes never intersect during a swap');
      const traveled = Math.hypot(a[0] - previousPoint[0], a[1] - previousPoint[1]);
      if (distance !== undefined) assert(Math.abs(traveled - distance) < 1e-12, 'equal time slices travel equal distances');
      distance = traveled;
      previousPoint = a;
    }
    assert.deepEqual(orbitalSwap(0, spacing, 0), [0, 0]);
    assert.equal(orbitalSwap(0, spacing, 1)[0], spacing);
  }
  assert.equal(springProgress(0), 0);
  assert.equal(springProgress(1), 1);
  assert(springProgress(0.4) > 1, 'damped swaps have a small settling overshoot');
  for (const count of [1, 7, 128, 8128]) {
    const cells = Array.from({ length: count }, (_, index) => workStar(index));
    assert.equal(new Set(cells.map((cell) => cell.join(','))).size, count, 'one distinct star per operation');
    assert(cells.every((cell) => cell.every(Number.isFinite) && Math.hypot(...cell) < 3.2));
    assert.deepEqual(cells[0], [0, 0, 0]);
  }
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
