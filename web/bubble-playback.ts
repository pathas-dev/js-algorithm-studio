export const BUBBLE_STEP_MS = 2800;
export const BUBBLE_PHASE_MS = { hold: 6000, erode: 6000, form: 3000 };
export type BubblePhase = 'sort' | keyof typeof BUBBLE_PHASE_MS;
export type BubblePlayback = {
  index: number; length: number; speed: number; playing: boolean;
  phase: BubblePhase; elapsed: number; time: number; loop: boolean; animate: boolean; reduced: boolean;
};
export type BubbleAction =
  | { type: 'reset'; length: number }
  | { type: 'seek'; index: number }
  | { type: 'toggle' }
  | { type: 'speed'; speed: number }
  | { type: 'loop'; loop: boolean }
  | { type: 'reduced'; reduced: boolean };

export function initialBubblePlayback(length: number): BubblePlayback {
  return { index: 0, length, speed: 1, playing: false, phase: 'sort', elapsed: 0, time: 0, loop: true, animate: false, reduced: false };
}

export function bubblePlaybackReducer(state: BubblePlayback, action: BubbleAction): BubblePlayback {
  switch (action.type) {
    case 'reset': return { ...state, index: 0, length: action.length, playing: false, phase: 'sort', elapsed: 0, time: 0, animate: false };
    case 'seek': {
      const index = Math.max(0, Math.min(state.length - 1, action.index));
      return { ...state, index, playing: false, phase: 'sort', elapsed: 0, time: index * BUBBLE_STEP_MS, animate: false };
    }
    case 'toggle':
      if (!state.playing && state.phase === 'sort' && state.index === state.length - 1) {
        return { ...state, index: 0, elapsed: 0, time: 0, playing: true, animate: false };
      }
      return { ...state, playing: !state.playing };
    case 'speed': return { ...state, speed: action.speed };
    case 'loop': return !action.loop && state.phase !== 'sort'
      ? { ...state, loop: false, index: state.length - 1, phase: 'sort', playing: false, elapsed: 0, time: (state.length - 1) * BUBBLE_STEP_MS, animate: false }
      : { ...state, loop: action.loop };
    case 'reduced': return { ...state, reduced: action.reduced, phase: 'sort', elapsed: 0, animate: false };
  }
}

// One clock drives both the trace and its visual epilogue. Seeking bypasses the epilogue.
export function advanceBubblePlayback(state: BubblePlayback, delta: number): BubblePlayback {
  if (!state.playing) return state;
  let next = { ...state, elapsed: state.elapsed + delta * state.speed, time: state.time + delta * state.speed };
  let duration = next.phase === 'sort' ? BUBBLE_STEP_MS : BUBBLE_PHASE_MS[next.phase];
  while (next.elapsed >= duration && next.playing) {
    next.elapsed -= duration;
    if (next.phase === 'sort') {
      if (next.index < next.length - 1) next.index += 1;
      if (next.index === next.length - 1) {
        next.phase = next.loop ? 'hold' : 'sort';
        next.playing = next.loop;
      }
      next.animate = true;
    } else if (next.phase === 'hold') {
      next.playing = next.loop;
      next.phase = next.loop && !next.reduced ? 'erode' : 'sort';
      if (next.loop && next.reduced) next.index = 0;
    } else if (next.phase === 'erode') {
      next.phase = 'form';
      next.index = 0;
    } else next.phase = 'sort';
    duration = next.phase === 'sort' ? BUBBLE_STEP_MS : BUBBLE_PHASE_MS[next.phase];
  }
  if (!next.playing) { next.time -= next.elapsed; next.elapsed = 0; }
  return next;
}
