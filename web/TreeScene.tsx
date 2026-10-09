import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial, OrthographicCamera, Vector3 } from 'three';
import type { Language, Step } from './algorithms';
import SceneOrbit from './SceneOrbit';
import { SceneBoundary } from './BubbleScene';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import { traceTransitionTime } from './bubble-motion';
import { treeModel, treePosition, treeArmProgress, treeLabel, treeTransferText, type TreeUnit, type TreeArm } from './tree-scene';
import { treeJourney, treeJourneyText, treeProbePosition, treeJourneyBounds } from './tree-journey';

const home = [-.4, 2.6, 12] as const;
const target = [0, 0, 0] as const;
type Model = ReturnType<typeof treeModel>;
type Labels = RefObject<Map<number, HTMLSpanElement>>;
type Journey = ReturnType<typeof treeJourney>;

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

function Arm({ arm, model, before, journey }: { arm: TreeArm; model: Model; before: Model; journey: Journey }) {
  const scene = useSpaceLesson()!;
  const beam = useRef<Mesh>(null);
  const current = model.arms.some((entry) => entry.id === arm.id);
  const previous = before.arms.some((entry) => entry.id === arm.id);
  const route = (journey.rotation?.after ?? journey.path).map((unit) => unit.id);
  const selected = route.some((id, index) => id === arm.parent && route[index + 1] === arm.child);
  const excluded = journey.excluded.includes(arm.child);
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
    const material = beam.current.material as MeshStandardMaterial;
    material.opacity = excluded && t >= .65 ? .2 : selected ? 1 : .55;
    beam.current.scale.x = beam.current.scale.z = selected ? 1.8 : 1;
  });
  return <mesh ref={beam}><cylinderGeometry args={[.035, .035, 1, 8]} /><meshStandardMaterial transparent color={selected ? '#d7b578' : arm.side === 'left' ? '#8faf9d' : '#9d8da7'} emissive={selected ? '#bc9c64' : '#0b1012'} emissiveIntensity={selected ? .35 : 0} metalness={.45} roughness={.5} /></mesh>;
}

function Gate({ unit, previous, labels, moving, language, journey }: { unit?: TreeUnit; previous?: TreeUnit; labels: Labels; moving: boolean; language: Language; journey: Journey }) {
  const scene = useSpaceLesson()!;
  const item = unit ?? previous!;
  const group = useRef<Group>(null);
  const rim = useRef<Mesh>(null);
  const sector = useRef<Mesh>(null);
  const apertures = useRef<Group>(null);
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
    label.dataset.sector = journey.excluded.includes(item.id) && t >= .65 ? language === 'ko' ? '탐색 제외' : 'Excluded' : '';
    const material = rim.current?.material as MeshStandardMaterial | undefined;
    if (material) material.opacity = journey.excluded.includes(item.id) && t >= .65 ? .25 : 1;
    if (sector.current) sector.current.visible = journey.candidates.includes(item.id) && t >= .65;
    apertures.current?.children.forEach((port, index) => {
      const open = journey.inspecting && journey.active?.id === item.id && journey.side === (index === 0 ? 'left' : 'right') && t >= .65;
      port.scale.setScalar(open ? 1 + .65 * Math.min(1, (t - .65) / .35) : 1);
      port.rotation.z = open ? t * Math.PI / 2 : 0;
    });
    group.current.getWorldPosition(point).add(new Vector3(0, 0, .65)).project(camera);
    label.style.transform = `translate(${(point.x + 1) * size.width / 2}px,${(1 - point.y) * size.height / 2}px) translate(-50%,-50%) scale(${Math.min(1, Math.max(.9, (camera as OrthographicCamera).zoom / 64))})`;
    label.style.visibility = group.current.visible && point.z >= -1 && point.z <= 1 ? 'visible' : 'hidden';
  });
  return <group ref={group}>
    <mesh ref={sector} position={[0, 0, -.2]} visible={false}><ringGeometry args={[.82, .95, 32]} /><meshBasicMaterial color="#8faf9d" transparent opacity={.35} /></mesh>
    <mesh ref={rim}><torusGeometry args={[.69, .085, 8, 32]} /><meshStandardMaterial transparent color={unit?.active ? '#d7b578' : '#8faf9d'} emissive={unit?.active ? '#bc9c64' : '#34483e'} emissiveIntensity={.25} metalness={.7} roughness={.4} /></mesh>
    <mesh position={[0, 0, -.12]}><torusGeometry args={[.79, .025, 6, 32]} /><meshStandardMaterial color="#536b60" metalness={.8} roughness={.4} /></mesh>
    <group ref={apertures}>{[-1, 1].map((side) => <group key={side} position={[side * .48, -.48, .1]}>
      <mesh><torusGeometry args={[.14, .04, 6, 16]} /><meshStandardMaterial color={side < 0 ? '#8faf9d' : '#9d8da7'} emissive={side < 0 ? '#8faf9d' : '#9d8da7'} emissiveIntensity={.35} metalness={.5} roughness={.4} /></mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[.17, .17, .035]} /><meshStandardMaterial color={side < 0 ? '#8faf9d' : '#9d8da7'} transparent opacity={.4} /></mesh>
    </group>)}</group>
  </group>;
}

function Probe({ journey, model, before, label, language }: { journey: Journey; model: Model; before: Model; label: RefObject<HTMLSpanElement | null>; language: Language }) {
  const scene = useSpaceLesson()!;
  const craft = useRef<Group>(null);
  const { camera, size } = useThree();
  const point = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const clock = scene.clock.current;
    const t = traceTransitionTime(clock, scene.index ?? clock.index, clock.animate);
    if (!craft.current || t === undefined) return;
    craft.current.visible = Boolean(journey.rotation) || journey.travelling && journey.target !== undefined;
    point.set(...treeProbePosition(journey, t));
    if (journey.active && !journey.rotation) {
      const unit = model.units.find((entry) => entry.id === journey.active!.id);
      const old = before.units.find((entry) => entry.id === journey.active!.id);
      point.add(new Vector3(...treePosition(unit, old, t)).sub(new Vector3(...journey.active.position)).multiplyScalar(Math.min(1, t / .65)));
    }
    craft.current.position.copy(point).add(new Vector3(.85, .12, 0));
    craft.current.rotation.z = -Math.atan2(journey.to[0] - journey.from[0], journey.to[1] - journey.from[1]);
    if (!label.current) return;
    const text = `${language === 'ko' ? '목적지' : 'DEST'} ${journey.rotation?.value ?? journey.target}`;
    if (label.current.textContent !== text) label.current.textContent = text;
    craft.current.getWorldPosition(point).add(new Vector3(0, .5, 0)).project(camera);
    label.current.style.transform = `translate(${(point.x + 1) * size.width / 2}px,${(1 - point.y) * size.height / 2}px) translate(-50%,-50%)`;
    label.current.style.visibility = craft.current.visible && point.z >= -1 && point.z <= 1 ? 'visible' : 'hidden';
  });
  return <group ref={craft}>
    <mesh><coneGeometry args={[.13, .45, 4]} /><meshStandardMaterial color="#f0e8d5" metalness={.4} roughness={.35} /></mesh>
    <mesh position={[0, -.09, 0]}><boxGeometry args={[.48, .045, .15]} /><meshStandardMaterial color="#8faf9d" metalness={.7} roughness={.4} /></mesh>
    <mesh position={[0, -.35, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[.07, .24, 8]} /><meshBasicMaterial color="#d7b578" transparent opacity={.7} /></mesh>
  </group>;
}

function FormerRoute({ journey }: { journey: Journey }) {
  const path = journey.rotation?.before ?? [];
  return <group>{path.flatMap((gate, index) => index === 0 ? [] : Array.from({ length: 9 }, (_, dot) => {
    const from = new Vector3(...path[index - 1].position);
    const to = new Vector3(...gate.position);
    const position = from.lerp(to, dot / 8).add(new Vector3(0, 0, -.3));
    return <mesh key={`${index}-${dot}`} position={position}><sphereGeometry args={[.035, 6, 6]} /><meshBasicMaterial color="#9d8da7" transparent opacity={.4} /></mesh>;
  }))}</group>;
}

function EmptyArrival({ position, label, language }: { position: [number, number, number]; label: RefObject<HTMLSpanElement | null>; language: Language }) {
  const scene = useSpaceLesson()!;
  const { camera, size } = useThree();
  const point = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const clock = scene.clock.current;
    if (clock.index !== scene.index || !label.current) return;
    point.set(...position).add(new Vector3(0, -.45, 0)).project(camera);
    label.current.style.transform = `translate(${(point.x + 1) * size.width / 2}px,${(1 - point.y) * size.height / 2}px) translate(-50%,-50%)`;
    label.current.style.visibility = point.z >= -1 && point.z <= 1 ? 'visible' : 'hidden';
    label.current.textContent = language === 'ko' ? '∅ · 빈 항로' : '∅ · Empty branch';
  });
  return <mesh position={position}><torusGeometry args={[.22, .025, 6, 20]} /><meshBasicMaterial color="#c9d2c6" transparent opacity={.6} /></mesh>;
}

function Mission({ step, journey, language }: { step: Step; journey: Journey; language: Language }) {
  const ko = language === 'ko';
  const route = (path: TreeUnit[], name: string) => <div className="tree-route"><span>{name}</span><ol aria-label={name}>{path.map((gate) => <li key={gate.id}>{gate.value}</li>)}</ol><span>{ko ? `${path.length}개 관문` : `${path.length} gates`}</span></div>;
  return <div className="tree-mission" data-testid="tree-mission">
    <strong>{journey.rotation ? ko ? `항로 재편 · ${step.variables.rotation}` : `Route reassignment · ${step.variables.rotation}` : journey.target !== undefined ? ko
      ? `목적지 ${journey.target} · ${journey.operation === 'insert' ? '관문 등록' : journey.operation === 'remove' ? '관문 제거' : '탐색'}`
      : `Destination ${journey.target} · ${journey.operation === 'insert' ? 'register gate' : journey.operation === 'remove' ? 'remove gate' : 'search'}` : ko ? '좌표를 따라가는 탐사' : 'An expedition by coordinates'}</strong>
    <p>{treeJourneyText(step, journey, language)}</p>
    {journey.rotation ? <div className="tree-route-comparison">
      {route(journey.rotation.before, ko ? '재편 전' : 'Before')}{route(journey.rotation.after, ko ? '재편 후' : 'After')}
      <p>{ko ? '좌표 순서 유지' : 'Coordinate order preserved'} · <output>{journey.rotation.inorder.join(' < ')}</output></p>
      <p className="graph-help">{ko ? '이 목적지의 실제 경로 비교입니다. 모든 경로가 짧아지는 것은 아닙니다.' : 'Actual routes to this destination. Other routes may grow; balancing limits depth.'}</p>
    </div> : journey.path.length > 0 ? <>{route(journey.path, ko ? '도착 항로' : 'Arrival route')}
      {journey.inspecting && <p className="tree-candidates">{ko ? '다음 후보 구역' : 'Next candidate sector'} · {journey.candidates.map((id) => treeModel(step).units.find((unit) => unit.id === id)!.value).sort((a,b) => a-b).join(', ') || '∅'}</p>}
    </> : null}
  </div>;
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
function Focus({ step, model, journey, width, height, scroll }: { step: Step; model: Model; journey: Journey; width: number; height: number; scroll: RefObject<HTMLDivElement | null> }) {
  const scene = useSpaceLesson()!;
  const last = useRef<Step | null>(null);
  const extent = useRef({ width: 0, height: 0, viewportWidth: 0, viewportHeight: 0 });
  const { camera, size } = useThree();
  useFrame(() => {
    if (!scroll.current || scene.clock.current.index !== scene.index
      || Math.abs(size.width - scroll.current.scrollWidth) > 1 || Math.abs(size.height - scroll.current.scrollHeight) > 1
      || Math.abs((camera as OrthographicCamera).zoom - Math.min(size.width / width, size.height / height)) > .01) return;
    const resized = extent.current.viewportWidth && (extent.current.viewportWidth !== scroll.current.clientWidth || extent.current.viewportHeight !== scroll.current.clientHeight);
    if (last.current === step && !resized) {
      if (extent.current.width && (extent.current.width !== size.width || extent.current.height !== size.height)) {
        scroll.current.scrollLeft = (scroll.current.scrollLeft + extent.current.viewportWidth / 2) * size.width / extent.current.width - scroll.current.clientWidth / 2;
        scroll.current.scrollTop = (scroll.current.scrollTop + extent.current.viewportHeight / 2) * size.height / extent.current.height - scroll.current.clientHeight / 2;
      }
      extent.current = { width: size.width, height: size.height, viewportWidth: scroll.current.clientWidth, viewportHeight: scroll.current.clientHeight };
      return;
    }
    const unit = model.units.find((entry) => entry.active) ?? model.units.find((entry) => entry.depth === 0);
    const position = step.type === 'find' && step.variables.result === 'null' ? journey.vacancy : unit?.position;
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
  const journey = useMemo(() => treeJourney(step, scene.previous), [step, scene.previous]);
  const units = [...model.units, ...before.units.filter((entry) => !model.units.some((unit) => unit.id === entry.id))];
  const arms = [...model.arms, ...before.arms.filter((entry) => !model.arms.some((arm) => arm.id === entry.id))];
  const labels = useRef(new Map<number, HTMLSpanElement>());
  const scroll = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const probeLabel = useRef<HTMLSpanElement>(null);
  const arrivalLabel = useRef<HTMLSpanElement>(null);
  const [lost, setLost] = useState(false);
  const [reset, setReset] = useState(0);
  const { sceneRef, visible } = useSceneVisibility(!lost);
  const { compact, width, height } = treeJourneyBounds(journey, model, before);
  const ko = language === 'ko';
  const moving = step.variables.tree !== scene.previous.variables.tree;
  const avl = step.variables.structure === 'avl-tree';
  const labelRef = (id: number) => (node: HTMLSpanElement | null) => { if (node) labels.current.set(id, node); else labels.current.delete(id); };
  if (lost) return <>{fallback}<p role="status" className="graph-help">{ko ? '3D를 표시할 수 없어 2D로 보여드립니다.' : '3D is unavailable. Showing the 2D view.'}</p></>;
  return <div ref={sceneRef} className="tree-observatory" data-testid="tree-3d">
    <Mission step={step} journey={journey} language={language} />
    <div ref={scroll} className="sequence-scroll" tabIndex={0} role="region" aria-label={ko ? '3D 분기 구조 · 스크롤로 노드와 가지 탐색' : '3D branching structure · scroll to inspect nodes and branches'}>
      <div className="sequence-stage" style={{ minWidth: compact ? `${100 * (scene.zoom ?? 1)}%` : width * 64 * (scene.zoom ?? 1), height: Math.max(350, height * 64) * (scene.zoom ?? 1) }}>
        <SceneBoundary fallback={fallback} onError={() => setLost(true)}><div className="graph-canvas"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [...home], zoom: 64 }} onCreated={({ gl }) => {
          gl.setClearColor('#0b1012', 0);
          gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
        }}>
          <Camera width={width} height={height} reset={reset} language={language} /><Focus step={step} model={model} journey={journey} scroll={scroll} width={width} height={height} />
          <TransferState moving={moving} avl={avl} language={language} status={status} />
          <ambientLight intensity={.7} color="#b9c9b5" /><directionalLight position={[-4, 7, 5]} intensity={3.2} color="#fff6e6" /><directionalLight position={[4, 1, -4]} intensity={1.4} color="#9bb7a5" />
          <FormerRoute journey={journey} />
          {journey.vacancy && <EmptyArrival position={journey.vacancy} label={arrivalLabel} language={language} />}
          {arms.map((arm) => <Arm key={arm.id} arm={arm} model={model} before={before} journey={journey} />)}
          {units.map((item) => <Gate key={item.id} unit={model.units.find((unit) => unit.id === item.id)} previous={before.units.find((unit) => unit.id === item.id)} labels={labels} moving={moving} language={language} journey={journey} />)}
          <Probe journey={journey} model={model} before={before} label={probeLabel} language={language} />
        </Canvas></div></SceneBoundary>
        <div className="tree-labels" aria-hidden="true">{units.map((item) => <span key={item.id} ref={labelRef(item.id)} data-active={model.units.find((unit) => unit.id === item.id)?.active}>{treeLabel(item)}</span>)}</div>
        <div className="tree-probe-label" aria-hidden="true"><span ref={probeLabel} /></div>
        {journey.vacancy && <div className="tree-probe-label tree-arrival-label" aria-hidden="true"><span ref={arrivalLabel} /></div>}
        {!model.units.length && <p className="sequence-empty">{ko ? '빈 트리 · ROOT = ∅' : 'Empty tree · ROOT = ∅'}</p>}
      </div>
    </div>
    <p ref={status} className="graph-help storage-guide tree-transfer-state">{treeTransferText(false, avl, language)}</p>
    <p className="graph-help">{ko ? '초록 L: 작은 좌표 · 보라 R: 큰 좌표 · 금빛: 탐사 항로 · 흐린 구역: 이번 탐색에서 제외' : 'Sage L: smaller coordinates · mauve R: larger · gold: probe route · dim sectors: excluded from this search'}</p>
    {step.variables.structure === 'avl-tree' && <p className="graph-help">{ko ? 'b = 왼쪽 높이 − 오른쪽 높이 · h = 높이 · 회전이 끝나면 새 값으로 표시' : 'b = left height − right height · h = height · labels update when the transfer completes'}</p>}
    <div className="graph-scene-footer"><p className="graph-help">{ko ? '관문 = 비교할 값 · 항로 = 실제 자식 연결 · 깊이 = 거치는 관문 층수' : 'Gate = compared value · route = actual child link · depth = gate levels'}</p><button className="bubble-size-button" onClick={() => setReset((value) => value + 1)}>{ko ? '시점 초기화' : 'Reset view'}</button></div>
    <details className="sequence-records"><summary>{ko ? '정확한 트리 상태 보기' : 'Inspect exact tree state'}</summary>{fallback}</details>
    <span className="sr-only">{model.units.map((unit) => `${treeLabel(unit)} · L: ${unit.left < 0 ? '∅' : `N${unit.left}`} · R: ${unit.right < 0 ? '∅' : `N${unit.right}`}`).join('; ')}</span>
  </div>;
}
