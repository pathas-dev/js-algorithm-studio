import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, OrthographicCamera, Vector3 } from 'three';
import type { Language, Step } from './algorithms';
import SceneOrbit from './SceneOrbit';
import { SceneBoundary } from './BubbleScene';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import { traceTransitionTime } from './bubble-motion';
import { storageModel, storagePosition, storageSlotPosition, type StorageUnit } from './storage-scene';

const home = [-.4, 2.6, 12] as const;
const target = [0, 0, 0] as const;
type Model = ReturnType<typeof storageModel>;
type Labels = RefObject<Map<string, HTMLSpanElement>>;

function project(labels: Labels, id: string, point: Vector3, camera: OrthographicCamera, width: number, height: number) {
  const label = labels.current.get(id);
  if (!label) return;
  point.project(camera);
  label.style.transform = `translate(${(point.x + 1) * width / 2}px,${(1 - point.y) * height / 2}px) translate(-50%,-50%) scale(${Math.min(1, camera.zoom / 64)})`;
  label.style.visibility = point.z >= -1 && point.z <= 1 ? 'visible' : 'hidden';
}

function Camera({ width, height, reset, language }: { width: number; height: number; reset: number; language: Language }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / width, size.height / height);
    ortho.updateProjectionMatrix();
    invalidate();
  }, [camera, size, width, height, invalidate]);
  return <SceneOrbit home={home} target={target} reset={reset} minPolar={1.15} maxPolar={1.5} maxAzimuth={.22} scrollable
    label={language === 'ko' ? '3D 관제 구조 · 드래그·방향키로 회전 · Home으로 시점 초기화' : '3D control structure · drag or arrow keys to orbit · Home to reset'} />;
}

function Beam({ from, to }: { from: readonly number[]; to: readonly number[] }) {
  const direction = new Vector3(...to).sub(new Vector3(...from));
  const center = new Vector3(...from).add(new Vector3(...to)).multiplyScalar(.5);
  const rotation = new Group().quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize());
  return <mesh position={center} quaternion={rotation}><cylinderGeometry args={[.027, .027, direction.length(), 6]} /><meshStandardMaterial color="#526b60" metalness={.6} roughness={.5} /></mesh>;
}

function Structure({ model, step, labels }: { model: Model; step: Step; labels: Labels }) {
  const { camera, size } = useThree();
  useFrame(() => {
    model.slots.forEach((_, index) => project(labels, `slot-${index}`, new Vector3(...storageSlotPosition(model, index)), camera as OrthographicCamera, size.width, size.height));
  });
  return <>
    {model.links.map(([parent, child]) => <Beam key={child} from={model.slots[parent]} to={model.slots[child]} />)}
    {model.slots.map((slot, index) => <group key={index} position={slot}>
      {model.hash ? <>
        <mesh position={[(model.width - 1.5) / 2, -.45, -.3]}><boxGeometry args={[model.width - 1.5, .07, .5]} /><meshStandardMaterial color="#42534e" metalness={.7} roughness={.4} /></mesh>
        <mesh><boxGeometry args={[.75, .85, .5]} /><meshStandardMaterial color={step.variables.keyHash === index ? '#bc9c64' : '#536b60'} metalness={.65} roughness={.4} /></mesh>
        <mesh position={[0, 0, .26]}><boxGeometry args={[.55, .55, .02]} /><meshBasicMaterial color="#14201e" /></mesh>
      </> : <>
        <mesh position={[0, -.48, -.06]}><cylinderGeometry args={[.63, .7, .15, 12]} /><meshStandardMaterial color="#42534e" metalness={.75} roughness={.4} /></mesh>
        <mesh position={[0, -.4, -.06]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.53, .025, 6, 24]} /><meshBasicMaterial color="#8faf9d" /></mesh>
      </>}
    </group>)}
  </>;
}

function Unit({ unit, previous, hash, labels }: { unit?: StorageUnit; previous?: StorageUnit; hash: boolean; labels: Labels }) {
  const scene = useSpaceLesson()!;
  const item = unit ?? previous!;
  const group = useRef<Group>(null);
  const { camera, size } = useThree();
  const point = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const clock = scene.clock.current;
    const t = traceTransitionTime(clock, scene.index ?? clock.index, clock.animate);
    if (!group.current || t === undefined) return;
    group.current.position.set(...storagePosition(unit, previous, t));
    group.current.visible = Boolean(unit) || t < 1;
    const updated = unit && previous && (unit.value !== previous.value || unit.priority !== previous.priority);
    group.current.scale.setScalar(updated ? 1 + Math.sin(Math.PI * t) * .12 : 1);
    group.current.getWorldPosition(point).add(new Vector3(0, 0, .5));
    project(labels, `unit-${item.id}`, point, camera as OrthographicCamera, size.width, size.height);
    if (!group.current.visible) { const label = labels.current.get(`unit-${item.id}`); if (label) label.style.visibility = 'hidden'; }
  });
  return <group ref={group}>
    <mesh><boxGeometry args={[hash ? 2.65 : 1.2, .8, .85]} /><meshStandardMaterial color={unit?.active ? '#bc9c64' : hash ? '#81988a' : '#8c8196'} metalness={.55} roughness={.45} /></mesh>
    <mesh position={[0, 0, .435]}><boxGeometry args={[hash ? 2.42 : 1.03, .64, .02]} /><meshStandardMaterial color="#14201e" /></mesh>
    {[-1, 1].map((side) => <mesh key={side} position={[side * (hash ? 1.27 : .56), 0, .46]}><boxGeometry args={[.035, .52, .03]} /><meshBasicMaterial color={unit?.active ? '#d6b476' : '#8faf9d'} /></mesh>)}
  </group>;
}

function Focus({ step, model, width, height, scroll }: { step: Step; model: Model; width: number; height: number; scroll: RefObject<HTMLDivElement | null> }) {
  const scene = useSpaceLesson()!;
  const last = useRef<Step | null>(null);
  const extent = useRef({ width: 0, height: 0 });
  const { camera, size } = useThree();
  useFrame(() => {
    if (!scroll.current || scene.clock.current.index !== scene.index
      || Math.abs(size.width - scroll.current.scrollWidth) > 1 || Math.abs(size.height - scroll.current.scrollHeight) > 1
      || Math.abs((camera as OrthographicCamera).zoom - Math.min(size.width / width, size.height / height)) > .01) return;
    if (last.current === step) {
      if (extent.current.width && (extent.current.width !== size.width || extent.current.height !== size.height)) {
        scroll.current.scrollLeft = (scroll.current.scrollLeft + scroll.current.clientWidth / 2) * size.width / extent.current.width - scroll.current.clientWidth / 2;
        scroll.current.scrollTop = (scroll.current.scrollTop + scroll.current.clientHeight / 2) * size.height / extent.current.height - scroll.current.clientHeight / 2;
      }
      extent.current = { width: size.width, height: size.height };
      return;
    }
    const unit = model.units.find((entry) => entry.active) ?? (model.hash && Number(step.variables.keyHash ?? -1) < 0 ? model.units[0] : undefined);
    const position = unit?.position ?? (model.hash ? model.slots[Number(step.variables.keyHash)] : model.slots[0]);
    if (position) {
      const point = new Vector3(...position).project(camera);
      scroll.current.scrollLeft = Math.max(0, (point.x + 1) * size.width / 2 - scroll.current.clientWidth / 2);
      scroll.current.scrollTop = Math.max(0, (1 - point.y) * size.height / 2 - scroll.current.clientHeight / 2);
    } else { scroll.current.scrollLeft = 0; scroll.current.scrollTop = 0; }
    last.current = step;
    extent.current = { width: size.width, height: size.height };
  }, -.5);
  return null;
}

export default function StorageScene({ step, language, fallback }: { step: Step; language: Language; fallback: ReactNode }) {
  const scene = useSpaceLesson()!;
  const model = useMemo(() => storageModel(step, scene.capacity), [step, scene.capacity]);
  const before = useMemo(() => storageModel(scene.previous, scene.capacity), [scene.previous, scene.capacity]);
  const units = [...model.units, ...before.units.filter((entry) => !model.units.some((unit) => unit.id === entry.id))];
  const labels = useRef(new Map<string, HTMLSpanElement>());
  const scroll = useRef<HTMLDivElement>(null);
  const [lost, setLost] = useState(false);
  const [reset, setReset] = useState(0);
  const { sceneRef, visible } = useSceneVisibility(!lost);
  const width = Math.max(model.width, before.width);
  const height = Math.max(model.height, before.height);
  const ko = language === 'ko';
  const labelRef = (id: string) => (node: HTMLSpanElement | null) => { if (node) labels.current.set(id, node); else labels.current.delete(id); };
  if (lost) return <>{fallback}<p role="status" className="graph-help">{ko ? '3D를 표시할 수 없어 2D로 보여드립니다.' : '3D is unavailable. Showing the 2D view.'}</p></>;
  return <div ref={sceneRef} className="storage-observatory" data-kind={model.hash ? 'hash' : 'heap'} data-testid="storage-3d">
    <div ref={scroll} className="sequence-scroll" tabIndex={0} role="region" aria-label={ko ? '3D 관제 구조 · 스크롤로 슬롯과 도크 탐색' : '3D control structure · scroll to inspect slots and docks'}>
      <div className="sequence-stage" style={{ minWidth: width * 64 * (scene.zoom ?? 1), height: Math.max(350, height * 64) * (scene.zoom ?? 1) }}>
        <SceneBoundary fallback={fallback} onError={() => setLost(true)}><div className="graph-canvas"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [...home], zoom: 64 }} onCreated={({ gl }) => {
          gl.setClearColor('#0b1012', 0);
          gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
        }}>
          <Camera width={width} height={height} reset={reset} language={language} /><Focus step={step} model={model} scroll={scroll} width={width} height={height} />
          <ambientLight intensity={.7} color="#b9c9b5" /><directionalLight position={[-4, 7, 5]} intensity={3.2} color="#fff6e6" /><directionalLight position={[4, 1, -4]} intensity={1.4} color="#9bb7a5" />
          <Structure model={model} step={step} labels={labels} />
          {units.map((item) => <Unit key={item.id} unit={model.units.find((unit) => unit.id === item.id)} previous={before.units.find((unit) => unit.id === item.id)} hash={model.hash} labels={labels} />)}
        </Canvas></div></SceneBoundary>
        <div className="storage-labels" aria-hidden="true">{units.map((item) => {
          const unit = model.units.find((entry) => entry.id === item.id);
          return <span key={item.id} ref={labelRef(`unit-${item.id}`)} data-active={unit?.active} data-kind={model.hash ? 'hash' : 'heap'}>
            {(model.hash || !unit) && <small>{unit?.tag ?? (ko ? '제거됨' : 'REMOVED')}</small>}<strong>{item.value}</strong>{unit?.priority !== undefined && <em>p: {unit.priority}</em>}
          </span>;
        })}{model.slots.map((_, index) => <span className={model.hash ? 'storage-address' : 'storage-slot'} key={index} ref={labelRef(`slot-${index}`)} data-active={model.hash ? step.variables.keyHash === index : step.indices.includes(index)}>{model.hash ? index : `[${index}]${index === 0 ? ' ROOT' : ''}`}</span>)}</div>
        {!model.hash && !model.units.length && <p className="sequence-empty">{ko ? '빈 힙 · ROOT = ∅' : 'Empty heap · ROOT = ∅'}</p>}
      </div>
    </div>
    <p className="graph-help storage-guide">{model.hash ? ko ? `주소 ${step.variables.keyHash === -1 || step.variables.keyHash === undefined ? '∅' : step.variables.keyHash} · 레일의 화물은 같은 해시의 충돌 체인입니다.` : `Address ${step.variables.keyHash === -1 || step.variables.keyHash === undefined ? '∅' : step.variables.keyHash} · cargo on one rail forms a collision chain.` : ko ? 'ROOT부터 부모 → 자식 · 슬롯 번호는 실제 힙 배열 인덱스입니다.' : 'ROOT to parent → child · slot numbers are actual heap-array indices.'}</p>
    <div className="graph-scene-footer"><p className="graph-help">{ko ? '드래그·방향키로 회전 · 스크롤·스와이프로 탐색 · 일시정지로 이동 멈추기' : 'Drag or arrow keys to orbit · scroll or swipe to explore · pause freezes transfers'}</p><button className="bubble-size-button" onClick={() => setReset((value) => value + 1)}>{ko ? '시점 초기화' : 'Reset view'}</button></div>
    <details className="sequence-records"><summary>{ko ? '정확한 저장 상태 보기' : 'Inspect exact storage state'}</summary>{fallback}</details>
    <span className="sr-only">{model.hash ? model.slots.map((_, address) => `${address}: ${model.units.filter((unit) => unit.slot === address).map((unit) => `${unit.tag} = ${unit.value}`).join(', ') || '∅'}`).join('; ') : model.units.map((unit) => `${unit.tag}: ${unit.value}${unit.priority !== undefined ? ` p: ${unit.priority}` : ''}`).join('; ')}</span>
  </div>;
}
