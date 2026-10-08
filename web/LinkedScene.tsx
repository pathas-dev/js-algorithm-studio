import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CubicBezierCurve3, Group, InstancedMesh, Mesh, Object3D, OrthographicCamera, Vector3 } from 'three';
import type { Language, Step } from './algorithms';
import SceneOrbit from './SceneOrbit';
import { SceneBoundary } from './BubbleScene';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import { traceTransitionTime } from './bubble-motion';
import { cableKey, cableProgress, linkedCablePoints, linkedModel, linkedPosition, type LinkedCable, type LinkedNode } from './linked-scene';

const home = [-.6, 3, 10] as const;
const target = [0, -.4, 0] as const;
type Labels = RefObject<Map<string, HTMLSpanElement>>;
type Model = ReturnType<typeof linkedModel>;

function placeLabel(labels: Labels, key: string, position: Vector3, camera: OrthographicCamera, width: number, height: number) {
  const label = labels.current.get(key);
  if (!label) return;
  position.project(camera);
  label.style.transform = `translate(${(position.x + 1) * width / 2}px,${(1 - position.y) * height / 2}px) translate(-50%,-50%) scale(${Math.min(1, camera.zoom / 50)})`;
  label.style.visibility = position.z >= -1 && position.z <= 1 ? 'visible' : 'hidden';
}

function Camera({ width, reset, language }: { width: number; reset: number; language: Language }) {
  const scene = useSpaceLesson()!;
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / width, size.height / 5.8) * (scene.zoom ?? 1);
    ortho.updateProjectionMatrix();
    invalidate();
  }, [camera, size, width, scene.zoom, invalidate]);
  return <SceneOrbit home={home} target={target} reset={reset} minPolar={1.05} maxPolar={1.55} maxAzimuth={.35} scrollable
    label={language === 'ko' ? '3D 연결 리스트 · 드래그 또는 방향키로 회전 · Home으로 시점 초기화' : '3D linked list · drag or use arrow keys to orbit · Home to reset'} />;
}

function Panel({ x }: { x: number }) {
  return <group position={[x, .03, -.04]}>
    <mesh><boxGeometry args={[.32, .56, .045]} /><meshStandardMaterial color="#283e43" metalness={.55} roughness={.4} /></mesh>
    {[-.18, 0, .18].map((y) => <mesh key={y} position={[0, y, .026]}><boxGeometry args={[.29, .018, .012]} /><meshBasicMaterial color="#65878a" /></mesh>)}
  </group>;
}

function Module({ node, previous, labels, doubly }: { node?: LinkedNode; previous?: LinkedNode; labels: Labels; doubly: boolean }) {
  const scene = useSpaceLesson()!;
  const item = node ?? previous!;
  const group = useRef<Group>(null);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const state = scene.clock.current;
    const t = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (!group.current || t === undefined) return;
    group.current.position.set(...linkedPosition(node, previous, t));
    group.current.visible = Boolean(node) || t < 1;
    group.current.getWorldPosition(anchor).add(new Vector3(0, .04, .3));
    placeLabel(labels, `node-${item.id}`, anchor, camera as OrthographicCamera, size.width, size.height);
    if (!group.current.visible) { const label = labels.current.get(`node-${item.id}`); if (label) label.style.visibility = 'hidden'; }
  });
  return <group ref={group}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.39, .39, .52, 8]} /><meshStandardMaterial color={node?.active ? '#bc9c64' : '#81988a'} metalness={.6} roughness={.4} /></mesh>
    <mesh position={[0, .03, .27]}><boxGeometry args={[.54, .36, .03]} /><meshStandardMaterial color="#14201e" /></mesh>
    <Panel x={-.58} /><Panel x={.58} />
    <mesh position={[0, .53, -.1]}><cylinderGeometry args={[.018, .018, .36, 6]} /><meshStandardMaterial color="#a3b0a7" metalness={.7} roughness={.3} /></mesh>
    <mesh position={[0, .73, -.1]} rotation={[.5, 0, 0]}><coneGeometry args={[.16, .08, 16, 1, true]} /><meshStandardMaterial color="#c0cabc" side={2} metalness={.65} roughness={.4} /></mesh>
    {[-.34, .34].map((x) => <mesh key={x} position={[x, -.24, .38]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.055, .018, 5, 12]} /><meshBasicMaterial color="#8faf9d" /></mesh>)}
    {doubly && [-.34, .34].map((x) => <mesh key={x} position={[x, -.24, -.38]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.055, .018, 5, 12]} /><meshBasicMaterial color="#afa0be" /></mesh>)}
  </group>;
}

function Cable({ edge, model, before, labels }: { edge: LinkedCable; model: Model; before: Model; labels: Labels }) {
  const scene = useSpaceLesson()!;
  const tube = useRef<InstancedMesh>(null);
  const arrow = useRef<Mesh>(null);
  const terminal = useRef<Mesh>(null);
  const last = useRef(-1);
  const { camera, size } = useThree();
  const scratch = useMemo(() => ({ part: new Object3D(), a: new Vector3(), b: new Vector3(), direction: new Vector3(), up: new Vector3(0, 1, 0), anchor: new Vector3() }), []);
  const key = cableKey(edge);
  const current = model.cables.some((item) => cableKey(item) === key);
  const retained = current && before.cables.some((item) => cableKey(item) === key);
  const color = edge.channel === 'next' ? '#8faf9d' : '#afa0be';
  useEffect(() => { last.current = -1; }, [model, before, edge]);
  useFrame(() => {
    const state = scene.clock.current;
    const t = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (t === undefined || !tube.current) return;
    const amount = cableProgress(current, retained, t);
    const point = (id: number) => linkedPosition(model.nodes.find((node) => node.id === id), before.nodes.find((node) => node.id === id), t);
    const source = point(edge.from);
    const destination = edge.to === -1 ? undefined : point(edge.to);
    const [start, controlA, controlB, end] = linkedCablePoints(edge, source, destination).map((point) => new Vector3(...point));
    const curve = new CubicBezierCurve3(start, controlA, controlB, end);
    if (last.current !== t) {
      for (let index = 0; index < 24; index++) {
        curve.getPoint(index / 24 * amount, scratch.a);
        curve.getPoint((index + 1) / 24 * amount, scratch.b);
        scratch.part.position.copy(scratch.a).add(scratch.b).multiplyScalar(.5);
        scratch.direction.copy(scratch.b).sub(scratch.a);
        scratch.part.quaternion.setFromUnitVectors(scratch.up, scratch.direction.clone().normalize());
        scratch.part.scale.set(1, scratch.direction.length(), 1);
        scratch.part.updateMatrix();
        tube.current.setMatrixAt(index, scratch.part.matrix);
      }
      tube.current.instanceMatrix.needsUpdate = true;
      last.current = t;
    }
    tube.current.visible = amount > 0;
    if (arrow.current) {
      arrow.current.visible = edge.to !== -1 && amount > .05;
      arrow.current.position.copy(curve.getPoint(Math.max(0, amount - .035)));
      arrow.current.quaternion.setFromUnitVectors(scratch.up, curve.getTangent(Math.max(0, amount - .035)).normalize());
    }
    if (terminal.current) { terminal.current.visible = edge.to === -1 && amount === 1; terminal.current.position.copy(end); }
    if (edge.to === -1) {
      scratch.anchor.copy(end).add(new Vector3(.17, -.05, 0));
      placeLabel(labels, key, scratch.anchor, camera as OrthographicCamera, size.width, size.height);
      const label = labels.current.get(key);
      if (label && (!current || amount !== 1)) label.style.visibility = 'hidden';
    }
  });
  return <>
    <instancedMesh ref={tube} args={[undefined, undefined, 24]} frustumCulled={false}><cylinderGeometry args={[.016, .016, 1, 6]} /><meshBasicMaterial color={color} /></instancedMesh>
    <mesh ref={arrow}><coneGeometry args={[.075, .18, 8]} /><meshBasicMaterial color={color} /></mesh>
    <mesh ref={terminal} rotation={[0, 0, 0]}><torusGeometry args={[.065, .015, 5, 16]} /><meshBasicMaterial color={color} /></mesh>
  </>;
}

function Focus({ step, model, scroll, width }: { step: Step; model: Model; scroll: RefObject<HTMLDivElement | null>; width: number }) {
  const scene = useSpaceLesson()!;
  const last = useRef<Step | null>(null);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  useFrame(() => {
    if (!scroll.current || last.current === step) return;
    // Input edits can commit before ResizeObserver and the camera catch up.
    if (scene.clock.current.index !== scene.index || Math.abs(size.width - scroll.current.scrollWidth) > 1
      || Math.abs((camera as OrthographicCamera).zoom - Math.min(size.width / width, size.height / 5.8) * (scene.zoom ?? 1)) > .01) return;
    const node = model.nodes.find((item) => item.active) ?? model.nodes.find((item) => item.id === step.variables.head);
    if (node) {
      anchor.set(...node.position).project(camera);
      scroll.current.scrollLeft = Math.max(0, (anchor.x + 1) * size.width / 2 - scroll.current.clientWidth / 2);
    } else if (!model.nodes.length) scroll.current.scrollLeft = 0;
    last.current = step;
  }, -.5);
  return null;
}

export default function LinkedScene({ step, language, fallback }: { step: Step; language: Language; fallback: ReactNode }) {
  const scene = useSpaceLesson()!;
  const model = useMemo(() => linkedModel(step), [step]);
  const before = useMemo(() => linkedModel(scene.previous), [scene.previous]);
  const nodes = [...model.nodes, ...before.nodes.filter((node) => !model.nodes.some((item) => item.id === node.id))];
  const cables = [...model.cables, ...before.cables.filter((edge) => !model.cables.some((item) => cableKey(item) === cableKey(edge)))];
  const [lost, setLost] = useState(false);
  const [reset, setReset] = useState(0);
  const { sceneRef, visible } = useSceneVisibility(!lost);
  const labels = useRef(new Map<string, HTMLSpanElement>());
  const scroll = useRef<HTMLDivElement>(null);
  const ko = language === 'ko';
  const doubly = 'previousLinks' in step.variables;
  const width = Math.max(7, Math.max(model.nodes.length, before.nodes.length) * 2.35 + 1.8);
  const labelRef = (key: string) => (node: HTMLSpanElement | null) => { if (node) labels.current.set(key, node); else labels.current.delete(key); };
  const pointer = (id: unknown) => id === -1 ? '∅' : `N${id}`;
  if (lost) return <>{fallback}<p role="status" className="graph-help">{ko ? '3D를 표시할 수 없어 2D로 보여드립니다.' : '3D is unavailable. Showing the 2D view.'}</p></>;
  return <div ref={sceneRef} className="linked-observatory" data-testid="linked-3d">
    <div ref={scroll} className="sequence-scroll" tabIndex={0} role="region" aria-label={ko ? '3D 연결 리스트 · 긴 입력은 스크롤로 이동' : '3D linked list · scroll to inspect long inputs'}>
      <div className="sequence-stage linked-stage" style={{ minWidth: width * 55, height: 350 }}>
        <SceneBoundary fallback={fallback} onError={() => setLost(true)}><div className="graph-canvas"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [...home], zoom: 50 }} onCreated={({ gl }) => {
          gl.setClearColor('#0b1012', 0);
          gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
        }}>
          <Camera width={width} reset={reset} language={language} /><Focus step={step} model={model} scroll={scroll} width={width} />
          <ambientLight intensity={.7} color="#b9c9b5" /><directionalLight position={[-4, 7, 5]} intensity={3.2} color="#fff6e6" /><directionalLight position={[4, 1, -4]} intensity={1.4} color="#9bb7a5" />
          {nodes.map((item) => <Module key={item.id} node={model.nodes.find((node) => node.id === item.id)} previous={before.nodes.find((node) => node.id === item.id)} labels={labels} doubly={doubly} />)}
          {cables.map((edge) => <Cable key={`${scene.index}-${cableKey(edge)}`} edge={edge} model={model} before={before} labels={labels} />)}
        </Canvas></div></SceneBoundary>
        <div className="linked-labels" aria-hidden="true">{nodes.map((item) => {
          const node = model.nodes.find((entry) => entry.id === item.id);
          return <span key={item.id} ref={labelRef(`node-${item.id}`)} data-active={node?.active}>
            <small>{node?.tag || (!node ? ko ? '제거됨' : 'REMOVED' : '')}</small><em>N{item.id}</em><strong>{item.value}</strong>
          </span>;
        })}{model.cables.filter((edge) => edge.to === -1).map((edge) => <span className="linked-null" key={cableKey(edge)} ref={labelRef(cableKey(edge))} data-channel={edge.channel}>∅</span>)}</div>
        {!model.nodes.length && <p className="sequence-empty">HEAD = TAIL = ∅</p>}
      </div>
    </div>
    <div className="linked-pointers" role="status"><span>HEAD {pointer(step.variables.head)} · TAIL {pointer(step.variables.tail)}</span>
      {typeof step.variables.current === 'number' && <span>current {pointer(step.variables.current)} · previous {pointer(step.variables.previous)} · next {pointer(step.variables.next)}</span>}
    </div>
    <div className="graph-scene-footer"><p className="graph-help">{ko ? '드래그·방향키로 회전 · 긴 입력은 스크롤·스와이프 · 일시정지로 연결 멈추기' : 'Drag or arrow keys to orbit · scroll or swipe long inputs · pause freezes rewiring'}</p><button className="bubble-size-button" onClick={() => setReset((value) => value + 1)}>{ko ? '시점 초기화' : 'Reset view'}</button></div>
    <details className="sequence-records"><summary>{ko ? '정확한 노드·연결 보기' : 'Inspect exact nodes and links'}</summary>{fallback}
      <ul className="linked-records">{model.nodes.map((node) => <li key={node.id}>N{node.id}: {node.value}{model.cables.filter((edge) => edge.from === node.id).map((edge) => <span key={edge.channel} data-channel={edge.channel}> · {edge.channel} → {pointer(edge.to)}</span>)}</li>)}</ul>
    </details>
    <span className="sr-only">{model.nodes.map((node) => `N${node.id}: ${node.value} ${node.tag}`).join('; ')}. {model.cables.map((edge) => `N${edge.from} ${edge.channel} → ${pointer(edge.to)}`).join('; ')}</span>
  </div>;
}
