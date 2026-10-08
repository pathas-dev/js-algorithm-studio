import { createContext, useContext, type ReactNode, type RefObject } from 'react';
import type { Step } from './algorithms';
import type { BubblePlayback } from './bubble-playback';
import SpaceSky from './SpaceSky';
import { useSceneVisibility } from './use-scene-visibility';
import './bubble.css';
import './cosmos.css';

type Scene = { previous: Step; clock: RefObject<BubblePlayback>; reduced: boolean; view: '2d' | '3d'; zoom?: number; index?: number };
const Context = createContext<Scene | null>(null);
export const useSpaceLesson = () => useContext(Context);

export default function SpaceLesson({ children, sky, ...scene }: Scene & { children: ReactNode; sky: boolean }) {
  const { sceneRef, visible } = useSceneVisibility(!scene.reduced);
  return <Context.Provider value={scene}><div ref={sceneRef} className="space-lesson" data-spinning={visible}>
    {sky && <SpaceSky active={visible} />}
    <div className="space-lesson-content">{children}</div>
  </div></Context.Provider>;
}
