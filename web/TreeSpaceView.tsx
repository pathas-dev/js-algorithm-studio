import { lazy, Suspense, type ReactNode } from 'react';
import type { Language, Step } from './algorithms';
import { useSpaceLesson } from './SpaceLesson';
import { treeSceneSupported } from './tree-scene';

const TreeScene = lazy(() => import('./TreeScene'));
export default function TreeSpaceView({ step, language, children }: { step: Step; language: Language; children: ReactNode }) {
  const scene = useSpaceLesson();
  if (!scene || scene.view === '2d' || !treeSceneSupported(step)) return <>{children}</>;
  if (scene.reduced) return <>{children}<p role="status" className="graph-help">{language === 'ko' ? '움직임 줄이기 설정에 따라 2D로 보여드립니다.' : 'Showing the 2D view to respect reduced motion.'}</p></>;
  return <Suspense fallback={<>{children}<p role="status" className="graph-help">{language === 'ko' ? '3D 보기를 불러오는 중' : 'Loading the 3D view'}</p></>}><TreeScene step={step} language={language} fallback={children} /></Suspense>;
}
