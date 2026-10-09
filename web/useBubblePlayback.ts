import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Step } from './algorithms';
import { advanceBubblePlayback, bubblePlaybackReducer, initialBubblePlayback, type BubbleAction } from './bubble-playback';
import { graphTravel } from './graph-scene';
import { sequenceMotion } from './sequence-scene';
import { storageMotion } from './storage-scene';
import { treeMotion } from './tree-scene';
import { linkedMotion } from './linked-scene';

export default function useBubblePlayback(steps: Step[], active: boolean, autoplay = false, loop = true) {
  const [playback, setPlayback] = useState(() => {
    const initial = { ...initialBubblePlayback(steps.length), loop };
    return autoplay ? bubblePlaybackReducer(initial, { type: 'toggle' }) : initial;
  });
  const clock = useRef(playback);
  const reduced = Boolean(useReducedMotion());
  const dispatch = (action: BubbleAction) => {
    const step = steps[clock.current.index];
    const previous = steps[Math.max(0, clock.current.index - 1)];
    const graphMotion = Boolean(step.edges?.length && (graphTravel(step, previous) || typeof step.variables.via === 'number'));
    clock.current = bubblePlaybackReducer(clock.current, action.type === 'toggle'
      ? { ...action, swap: graphMotion || sequenceMotion(step, previous) || linkedMotion(step, previous) || storageMotion(step, previous) || treeMotion(step, previous) || ['swap', 'move'].includes(step.type) || step.array.some((item, index) => previous.array[index]?.id !== item.id) }
      : action);
    setPlayback(clock.current);
  };
  useEffect(() => {
    clock.current = bubblePlaybackReducer(clock.current, { type: 'loop', loop });
    setPlayback(clock.current);
  }, [loop]);
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
