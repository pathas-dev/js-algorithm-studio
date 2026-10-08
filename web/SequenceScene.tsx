import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Group, Mesh, OrthographicCamera, Vector3 } from 'three';
import type { Language, Step } from './algorithms';
import SceneOrbit from './SceneOrbit';
import { SceneBoundary } from './BubbleScene';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import { traceTransitionTime } from './bubble-motion';
import { planetMaterial, atmosphereMaterial } from './planet-material';
import { sequenceModel, sequencePosition, type SequenceToken } from './sequence-scene';

const home = [-1.2, 2.4, 10] as const;
const target = [0, 0, 0] as const;
type Labels = RefObject<Map<string, HTMLSpanElement>>;

function Camera({ width, height, reset, language }: { width: number; height: number; reset: number; language: Language }) {
  const scene = useSpaceLesson()!;
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / width, size.height / height) * (scene.zoom ?? 1);
    ortho.updateProjectionMatrix();
    invalidate();
  }, [camera, size, width, height, scene.zoom, invalidate]);
  return <SceneOrbit home={home} target={target} reset={reset} minPolar={1.05} maxPolar={1.55} maxAzimuth={.6} scrollable
    label={language === 'ko' ? '3D 순서 보기 · 드래그 또는 방향키로 회전 · Home으로 시점 초기화' : '3D sequence · drag or use arrow keys to orbit · Home to reset'} />;
}

function Token({ token, previous, labels, visible, linear }: { token?: SequenceToken; previous?: SequenceToken; labels: Labels; visible: boolean; linear: boolean }) {
  const scene = useSpaceLesson()!;
  const item = token ?? previous!;
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  const material = useMemo(() => planetMaterial(Number(item.id.split('-').at(-1))), [item.id]);
  const atmosphere = useMemo(() => atmosphereMaterial(), []);
  const color = useMemo(() => new Color(item.color), [item.color]);
  useEffect(() => () => { material.dispose(); atmosphere.dispose(); }, [material, atmosphere]);
  useFrame((_, delta) => {
    if (!group.current) return;
    const state = scene.clock.current;
    const t = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (t === undefined) return;
    group.current.position.set(...sequencePosition(token, previous, t));
    const scale = token ? previous ? 1 : .65 + .35 * t : 1 - t;
    group.current.scale.setScalar(scale);
    if (mesh.current && visible && linear) mesh.current.rotation.y += Math.min(delta, .1) * Math.PI / 5;
    material.color.copy(color);
    atmosphere.uniforms.uColor.value.copy(color);
    atmosphere.uniforms.uOpacity.value = item.active ? .6 : .24;
    const label = labels.current.get(item.id);
    if (label) {
      group.current.getWorldPosition(anchor).project(camera);
      const labelScale = Math.min(1, (camera as OrthographicCamera).zoom / (linear ? 60 : 48));
      label.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px,${(1 - anchor.y) * size.height / 2}px) translate(-50%,-50%) scale(${labelScale})`;
      label.style.visibility = scale > .01 && anchor.z >= -1 && anchor.z <= 1 ? 'visible' : 'hidden';
      label.style.opacity = String(scale);
    }
  });
  return <group ref={group}>
    <mesh ref={mesh} material={material}>{linear ? <sphereGeometry args={[.34, 32, 24]} /> : <boxGeometry args={[.68, .76, .25]} />}</mesh>
    {linear ? <mesh material={atmosphere}><sphereGeometry args={[.365, 24, 16]} /></mesh>
      : <mesh position={[0, 0, -.15]}><boxGeometry args={[.73, .81, .05]} /><meshBasicMaterial color={item.color} /></mesh>}
  </group>;
}

function Arrangement({ center, previous, children }: { center: [number, number, number]; previous: [number, number, number]; children: ReactNode }) {
  const scene = useSpaceLesson()!;
  const group = useRef<Group>(null);
  useFrame(() => {
    const state = scene.clock.current;
    const t = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (group.current && t !== undefined) group.current.position.set(...center.map((value, axis) => -(previous[axis] + (value - previous[axis]) * t)) as [number, number, number]);
  }, -1);
  return <group ref={group}>{children}</group>;
}

export default function SequenceScene({ step, language, fallback }: { step: Step; language: Language; fallback: ReactNode }) {
  const scene = useSpaceLesson()!;
  const [lost, setLost] = useState(false);
  const [reset, setReset] = useState(0);
  const { sceneRef, visible } = useSceneVisibility(!lost);
  const scroll = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<string, HTMLSpanElement>());
  const model = sequenceModel(step);
  const previous = sequenceModel(scene.previous);
  const tokens = [...model.tokens, ...previous.tokens.filter((token) => !model.tokens.some((item) => item.id === token.id))];
  const width = Math.max(model.width, previous.width);
  const height = Math.max(model.height, previous.height);
  const ko = language === 'ko';
  const text = !model.linear;
  useEffect(() => {
    const element = scroll.current;
    if (!element) return;
    const active = model.tokens.find((token) => token.row === 'text' && token.active)
      ?? model.tokens.find((token) => token.row === 'queue' && (token.active || step.type === 'dequeue' && token.index === 0))
      ?? model.tokens.find((token) => token.row === 'pattern' && token.index === step.variables.suffixIndex);
    if (active) element.scrollLeft = Math.max(0, (active.position[0] + 1.5) / width * element.scrollWidth - element.clientWidth / 2);
    else if (scene.index === 0) element.scrollLeft = 0;
    if (model.stack) element.scrollTop = 0;
  }, [scene.index, step]);
  if (lost) return <>{fallback}<p role="status" className="graph-help">{ko ? '3D를 표시할 수 없어 2D로 보여드립니다.' : '3D is unavailable. Showing the 2D view.'}</p></>;
  return <div ref={sceneRef} className="sequence-observatory" data-testid="sequence-3d" data-kind={text ? 'string' : model.stack ? 'stack' : 'queue'}>
    {text && <p className="graph-help">{ko ? '윗줄: 텍스트 · 아랫줄: 패턴 · 각 문자열의 인덱스 표시' : 'Top: text · bottom: pattern · indices belong to each string'}</p>}
    <div ref={scroll} className="sequence-scroll" tabIndex={0} role="region" aria-label={ko ? '3D 관측 화면 · 긴 입력은 스크롤로 이동' : '3D observation · scroll to inspect long inputs'}>
      <div className="sequence-stage" style={{ minWidth: text ? width * 48 : model.stack ? 320 : width * 58, height: Math.max(330, height * (model.stack ? 48 : 58)) }}>
        <SceneBoundary fallback={fallback} onError={() => setLost(true)}><div className="graph-canvas"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [...home], zoom: 50 }} onCreated={({ gl }) => {
          gl.setClearColor('#0b1012', 0);
          gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
        }}>
          <Camera width={width} height={height} reset={reset} language={language} />
          <ambientLight intensity={.65} color="#b9c9b5" /><directionalLight position={[-4, 7, 5]} intensity={3.2} color="#fff6e6" /><directionalLight position={[4, 1, -4]} intensity={1.4} color="#9bb7a5" />
          <Arrangement center={model.center} previous={previous.center}>
            {tokens.map((item) => <Token key={item.id} token={model.tokens.find((token) => token.id === item.id)} previous={previous.tokens.find((token) => token.id === item.id)} labels={labels} visible={visible} linear={model.linear} />)}
          </Arrangement>
        </Canvas></div></SceneBoundary>
        <div className="sequence-labels" aria-hidden="true">{tokens.map((item) => <span key={item.id} data-active={item.active} data-wide={item.label.length > 3} ref={(node) => { if (node) labels.current.set(item.id, node); else labels.current.delete(item.id); }}>
          <strong>{item.label}</strong><small>{item.row === 'stack' ? item.index === 0 ? 'TOP' : `[${item.index}]` : item.row === 'queue' ? item.index === 0 ? model.tokens.length === 1 ? 'FRONT / REAR' : 'FRONT' : item.index === model.tokens.length - 1 ? 'REAR' : `[${item.index}]` : `[${item.index}]`}</small>
        </span>)}</div>
        {!model.tokens.length && <p className="sequence-empty">{ko ? '비어 있음 · ∅' : 'Empty · ∅'}</p>}
      </div>
    </div>
    <div className="graph-scene-footer"><p className="graph-help">{ko ? '마우스·방향키로 회전 · 긴 입력은 스크롤·스와이프 · 일시정지로 이동 멈추기' : 'Mouse or arrow keys to orbit · scroll or swipe long inputs · pause freezes transfers'}</p><button className="bubble-size-button" onClick={() => setReset((value) => value + 1)}>{ko ? '시점 초기화' : 'Reset view'}</button></div>
    <details className="sequence-records"><summary>{ko ? '정확한 값·인덱스 보기' : 'Inspect exact values and indices'}</summary>{fallback}</details>
  </div>;
}
