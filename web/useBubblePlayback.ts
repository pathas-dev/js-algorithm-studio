import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { advanceBubblePlayback, bubblePlaybackReducer, initialBubblePlayback, type BubbleAction } from './bubble-playback';

export default function useBubblePlayback(length: number, active: boolean) {
  const [playback, setPlayback] = useState(() => initialBubblePlayback(length));
  const clock = useRef(playback);
  const reduced = Boolean(useReducedMotion());
  const dispatch = (action: BubbleAction) => {
    clock.current = bubblePlaybackReducer(clock.current, action);
    setPlayback(clock.current);
  };
  useEffect(() => {
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
