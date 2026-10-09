import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh, OrthographicCamera, Vector3 } from 'three';
import type { Language, Step } from './algorithms';
import SceneOrbit from './SceneOrbit';
import { SceneBoundary } from './BubbleScene';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import { traceTransitionTime } from './bubble-motion';
import { treeModel, treePosition, treeArmProgress, treeLabel, treeMotion, treeTransferText, type TreeUnit, type TreeArm } from './tree-scene';

const home = [-.4, 2.6, 12] as const;
const target = [0, 0, 0] as const;
type Model = ReturnType<typeof treeModel>;
type Labels = RefObject<Map<number, HTMLSpanElement>>;

function Camera({ width, height, reset, language }: { width: number; height: number; reset: number; language: Language }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / width, size.height / height);
    ortho.updateProjectionMatrix();
    invalidate();
  }, [camera, size, width, height, invalidate]);
  return <SceneOrbit home={home} target={target} reset={reset} minPolar={1.15} maxPolar={1.5} maxAzimuth={.22} scrollable
    label={language === 'ko' ? '3D 분기 구조 · 드래그·방향키로 회전 · Home으로 시점 초기화' : '3D branching structure · drag or arrow keys to orbit · Home to reset'} />;
}

function Arm({ arm, model, before }: { arm: TreeArm; model: Model; before: Model }) {
  const scene = useSpaceLesson()!;
  const beam = useRef<Mesh>(null);
  const current = model.arms.some((entry) => entry.id === arm.id);
  const previous = before.arms.some((entry) => entry.id === arm.id);
  useFrame(() => {
    const clock = scene.clock.current;
    const t = traceTransitionTime(clock, scene.index ?? clock.index, clock.animate);
    if (!beam.current || t === undefined) return;
    const progress = treeArmProgress(current, previous, t);
    beam.current.visible = progress > 0;
    if (!progress) return;
    const position = (id: number) => new Vector3(...treePosition(model.units.find((unit) => unit.id === id), before.units.find((unit) => unit.id === id), t));
    const from = position(arm.parent).add(new Vector3(arm.side === 'left' ? -.48 : .48, -.48, 0));
    const to = position(arm.child).add(new Vector3(0, .52, 0));
    const direction = to.sub(from).multiplyScalar(progress);
    beam.current.position.copy(from.addScaledVector(direction, .5));
    beam.current.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize());
    beam.current.scale.set(1, Math.max(.001, direction.length()), 1);
  });
  return <mesh ref={beam}><cylinderGeometry args={[.035, .035, 1, 8]} /><meshStandardMaterial color={arm.side === 'left' ? '#8faf9d' : '#9d8da7'} metalness={.65} roughness={.45} /></mesh>;
}

function Joint({ unit, previous, labels, moving, language }: { unit?: TreeUnit; previous?: TreeUnit; labels: Labels; moving: boolean; language: Language }) {
  const scene = useSpaceLesson()!;
  const item = unit ?? previous!;
  const group = useRef<Group>(null);
  const { camera, size } = useThree();
  const point = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const clock = scene.clock.current;
    const t = traceTransitionTime(clock, scene.index ?? clock.index, clock.animate);
    if (!group.current || t === undefined) return;
    group.current.position.set(...treePosition(unit, previous, t));
    group.current.visible = unit ? Boolean(previous) || t >= .22 : t < .78;
    const label = labels.current.get(item.id);
    if (!label) return;
    const shown = t < 1 && previous ? previous : item;
    const text = treeLabel(shown, moving && t < 1 && Boolean(previous), language);
    if (label.textContent !== text) label.textContent = text;
    label.dataset.root = String(shown.depth === 0);
    label.dataset.unbalanced = String(Math.abs(shown.balance ?? 0) > 1);
    group.current.getWorldPosition(point).add(new Vector3(0, 0, .65)).project(camera);
    label.style.transform = `translate(${(point.x + 1) * size.width / 2}px,${(1 - point.y) * size.height / 2}px) translate(-50%,-50%) scale(${Math.min(1, (camera as OrthographicCamera).zoom / 64)})`;
    label.style.visibility = group.current.visible && point.z >= -1 && point.z <= 1 ? 'visible' : 'hidden';
  });
  return <group ref={group}>
    <mesh rotation={[Math.PI / 2, Math.PI / 8, 0]}><cylinderGeometry args={[.66, .66, .5, 8]} /><meshStandardMaterial color={unit?.active ? '#bc9c64' : '#536b60'} metalness={.7} roughness={.4} /></mesh>
    <mesh position={[0, 0, .28]}><boxGeometry args={[1.08, .78, .08]} /><meshStandardMaterial color="#14201e" /></mesh>
    <mesh position={[0, .52, 0]}><sphereGeometry args={[.1, 12, 8]} /><meshStandardMaterial color="#c9d2c6" metalness={.8} roughness={.4} /></mesh>
    {[-1, 1].map((side) => <group key={side} position={[side * .48, -.48, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.12, .04, 6, 16]} /><meshStandardMaterial color={side < 0 ? '#8faf9d' : '#9d8da7'} metalness={.7} roughness={.4} /></mesh>
    </group>)}
  </group>;
}

function TransferState({ moving, avl, language, status }: { moving: boolean; avl: boolean; language: Language; status: RefObject<HTMLParagraphElement | null> }) {
  const scene = useSpaceLesson()!;
  useFrame(() => {
    const clock = scene.clock.current;
    const t = traceTransitionTime(clock, scene.index ?? clock.index, clock.animate);
    if (t === undefined || !status.current) return;
    const text = treeTransferText(moving && t < 1, avl, language);
    if (status.current.textContent !== text) status.current.textContent = text;
  });
  return null;
}
function Focus({ step, model, width, height, scroll }: { step: Step; model: Model; width: number; height: number; scroll: RefObject<HTMLDivElement | null> }) {
  const scene = useSpaceLesson()!;
  const last = useRef<Step | null>(null);
  const extent = useRef({ width: 0, height: 0, viewportWidth: 0, viewportHeight: 0 });
  const { camera, size } = useThree();
  useFrame(() => {
    if (!scroll.current || scene.clock.current.index !== scene.index
      || Math.abs(size.width - scroll.current.scrollWidth) > 1 || Math.abs(size.height - scroll.current.scrollHeight) > 1
      || Math.abs((camera as OrthographicCamera).zoom - Math.min(size.width / width, size.height / height)) > .01) return;
    if (last.current === step) {
      if (extent.current.width && (extent.current.width !== size.width || extent.current.height !== size.height)) {
        scroll.current.scrollLeft = (scroll.current.scrollLeft + extent.current.viewportWidth / 2) * size.width / extent.current.width - scroll.current.clientWidth / 2;
        scroll.current.scrollTop = (scroll.current.scrollTop + extent.current.viewportHeight / 2) * size.height / extent.current.height - scroll.current.clientHeight / 2;
      }
      extent.current = { width: size.width, height: size.height, viewportWidth: scroll.current.clientWidth, viewportHeight: scroll.current.clientHeight };
      return;
    }
    const unit = model.units.find((entry) => entry.active) ?? model.units.find((entry) => entry.depth === 0);
    const position = unit?.position;
    if (position) {
      const point = new Vector3(...position).project(camera);
      scroll.current.scrollLeft = Math.max(0, (point.x + 1) * size.width / 2 - scroll.current.clientWidth / 2);
      scroll.current.scrollTop = Math.max(0, (1 - point.y) * size.height / 2 - scroll.current.clientHeight / 2);
    } else { scroll.current.scrollLeft = 0; scroll.current.scrollTop = 0; }
    last.current = step;
    extent.current = { width: size.width, height: size.height, viewportWidth: scroll.current.clientWidth, viewportHeight: scroll.current.clientHeight };
  }, -.5);
  return null;
}

export default function TreeScene({ step, language, fallback }: { step: Step; language: Language; fallback: ReactNode }) {
  const scene = useSpaceLesson()!;
  const model = useMemo(() => treeModel(step, scene.capacity), [step, scene.capacity]);
  const before = useMemo(() => treeModel(scene.previous, scene.capacity), [scene.previous, scene.capacity]);
  const units = [...model.units, ...before.units.filter((entry) => !model.units.some((unit) => unit.id === entry.id))];
  const arms = [...model.arms, ...before.arms.filter((entry) => !model.arms.some((arm) => arm.id === entry.id))];
  const labels = useRef(new Map<number, HTMLSpanElement>());
  const scroll = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const [lost, setLost] = useState(false);
  const [reset, setReset] = useState(0);
  const { sceneRef, visible } = useSceneVisibility(!lost);
  const width = Math.max(model.width, before.width);
  const height = Math.max(model.height, before.height);
  const ko = language === 'ko';
  const moving = treeMotion(step, scene.previous);
  const avl = step.variables.structure === 'avl-tree';
  const labelRef = (id: number) => (node: HTMLSpanElement | null) => { if (node) labels.current.set(id, node); else labels.current.delete(id); };
  if (lost) return <>{fallback}<p role="status" className="graph-help">{ko ? '3D를 표시할 수 없어 2D로 보여드립니다.' : '3D is unavailable. Showing the 2D view.'}</p></>;
  return <div ref={sceneRef} className="tree-observatory" data-testid="tree-3d">
    <div ref={scroll} className="sequence-scroll" tabIndex={0} role="region" aria-label={ko ? '3D 분기 구조 · 스크롤로 노드와 가지 탐색' : '3D branching structure · scroll to inspect nodes and branches'}>
      <div className="sequence-stage" style={{ minWidth: width * 64 * (scene.zoom ?? 1), height: Math.max(350, height * 64) * (scene.zoom ?? 1) }}>
        <SceneBoundary fallback={fallback} onError={() => setLost(true)}><div className="graph-canvas"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [...home], zoom: 64 }} onCreated={({ gl }) => {
          gl.setClearColor('#0b1012', 0);
          gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
        }}>
          <Camera width={width} height={height} reset={reset} language={language} /><Focus step={step} model={model} scroll={scroll} width={width} height={height} />
          <TransferState moving={moving} avl={avl} language={language} status={status} />
          <ambientLight intensity={.7} color="#b9c9b5" /><directionalLight position={[-4, 7, 5]} intensity={3.2} color="#fff6e6" /><directionalLight position={[4, 1, -4]} intensity={1.4} color="#9bb7a5" />
          {arms.map((arm) => <Arm key={arm.id} arm={arm} model={model} before={before} />)}
          {units.map((item) => <Joint key={item.id} unit={model.units.find((unit) => unit.id === item.id)} previous={before.units.find((unit) => unit.id === item.id)} labels={labels} moving={moving} language={language} />)}
        </Canvas></div></SceneBoundary>
        <div className="tree-labels" aria-hidden="true">{units.map((item) => <span key={item.id} ref={labelRef(item.id)} data-active={model.units.find((unit) => unit.id === item.id)?.active}>{treeLabel(item)}</span>)}</div>
        {!model.units.length && <p className="sequence-empty">{ko ? '빈 트리 · ROOT = ∅' : 'Empty tree · ROOT = ∅'}</p>}
      </div>
    </div>
    <p ref={status} className="graph-help storage-guide tree-transfer-state">{treeTransferText(false, avl, language)}</p>
    <p className="graph-help">{ko ? '왼쪽 L: 초록 · 오른쪽 R: 보라 · 값은 중위 순서 · ROOT는 라벨이 나타내는 스냅샷의 루트' : 'Left L: sage · right R: mauve · values in inorder · ROOT belongs to the labeled snapshot'}</p>
    {step.variables.structure === 'avl-tree' && <p className="graph-help">{ko ? 'b = 왼쪽 높이 − 오른쪽 높이 · h = 높이 · 회전이 끝나면 새 값으로 표시' : 'b = left height − right height · h = height · labels update when the transfer completes'}</p>}
    <div className="graph-scene-footer"><p className="graph-help">{ko ? '이전 가지 분리 → 노드 이동 → 새 가지 연결 · 일시정지로 멈추기' : 'Detach old arms → move nodes → connect new arms · pause to freeze'}</p><button className="bubble-size-button" onClick={() => setReset((value) => value + 1)}>{ko ? '시점 초기화' : 'Reset view'}</button></div>
    <details className="sequence-records"><summary>{ko ? '정확한 트리 상태 보기' : 'Inspect exact tree state'}</summary>{fallback}</details>
    <span className="sr-only">{model.units.map((unit) => `${treeLabel(unit)} · L: ${unit.left < 0 ? '∅' : `N${unit.left}`} · R: ${unit.right < 0 ? '∅' : `N${unit.right}`}`).join('; ')}</span>
  </div>;
}
