import { createContext, useContext, useEffect, type Dispatch, type SetStateAction, type ReactNode, type RefObject } from 'react';
import type { Step } from './algorithms';
import type { BubblePlayback } from './bubble-playback';
import SpaceSky from './SpaceSky';
import { useSceneVisibility } from './use-scene-visibility';
import { wheelZoom } from './scene-zoom';
import './bubble.css';
import './cosmos.css';

type Scene = { previous: Step; clock: RefObject<BubblePlayback>; reduced: boolean; view: '2d' | '3d'; zoom?: number; index?: number; numeralFont?: 'Manrope' };
const Context = createContext<Scene | null>(null);
export const useSpaceLesson = () => useContext(Context);

export default function SpaceLesson({ children, sky, onZoom, ...scene }: Scene & { children: ReactNode; sky: boolean; onZoom?: Dispatch<SetStateAction<number>> }) {
  const { sceneRef, visible } = useSceneVisibility(!scene.reduced);
  useEffect(() => {
    const element = sceneRef.current;
    if (!element || !onZoom || scene.reduced) return;
    const wheel = (event: WheelEvent) => {
      if (!event.deltaY || !(event.target instanceof Element) || !event.target.closest('.bubble-canvas, .graph-scene, .graph-map')) return;
      event.preventDefault();
      onZoom((zoom) => wheelZoom(zoom, event.deltaY, event.deltaMode));
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
  }, [onZoom, scene.reduced, sceneRef]);
  return <Context.Provider value={scene}><div ref={sceneRef} className="space-lesson" data-spinning={visible}>
    {sky && <SpaceSky active={visible} />}
    <div className="space-lesson-content">{children}</div>
  </div></Context.Provider>;
}
