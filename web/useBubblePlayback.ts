import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Step } from './algorithms';
import { advanceBubblePlayback, bubblePlaybackReducer, initialBubblePlayback, type BubbleAction } from './bubble-playback';

export default function useBubblePlayback(steps: Step[], active: boolean, autoplay = false) {
  const [playback, setPlayback] = useState(() => autoplay
    ? bubblePlaybackReducer(initialBubblePlayback(steps.length), { type: 'toggle' })
    : initialBubblePlayback(steps.length));
  const clock = useRef(playback);
  const reduced = Boolean(useReducedMotion());
  const dispatch = (action: BubbleAction) => {
    clock.current = bubblePlaybackReducer(clock.current, action.type === 'toggle'
      ? { ...action, swap: steps[clock.current.index]?.type === 'swap' }
      : action);
    setPlayback(clock.current);
  };
  useEffect(() => {
    if (clock.current.reduced === reduced) return;
    clock.current = bubblePlaybackReducer(clock.current, { type: 'reduced', reduced });
    setPlayback(clock.current);
  }, [reduced]);
  useEffect(() => {
    if (!active || !playback.playing) return;
    let previous: number | undefined;
    let frame: number;
    const tick = (time: number) => {
      // A background tab must not fast-forward or skip the quiet moments on return.
      const delta = previous === undefined ? 0 : Math.min(100, time - previous);
      previous = time;
      const current = clock.current;
      const next = advanceBubblePlayback(current, document.hidden ? 0 : delta);
      clock.current = next;
      if (next.index !== current.index || next.phase !== current.phase || next.playing !== current.playing) setPlayback(next);
      if (next.playing) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, playback.playing]);
  return { playback, dispatch, clock, reduced };
}
