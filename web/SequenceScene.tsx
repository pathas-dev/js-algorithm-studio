import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Group, OrthographicCamera, Vector3 } from 'three';
import type { Language, Step } from './algorithms';
import SceneOrbit from './SceneOrbit';
import { SceneBoundary } from './BubbleScene';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import { traceTransitionTime } from './bubble-motion';
import { sequenceModel, sequencePorts, sequencePosition, sequenceScanner, type SequenceToken } from './sequence-scene';

const home = [-1.2, 2.4, 10] as const;
const target = [0, 0, 0] as const;
type Labels = RefObject<Map<string, HTMLSpanElement>>;
type Point = [number, number, number];

function Bar({ position, size, color = '#526b60', lit = false }: { position: Point; size: Point; color?: string; lit?: boolean }) {
  return <mesh position={position}><boxGeometry args={size} />{lit ? <meshBasicMaterial color={color} /> : <meshStandardMaterial color={color} metalness={.25} roughness={.5} />}</mesh>;
}

function Marker({ id, position, labels }: { id: string; position: Point; labels: Labels }) {
  const group = useRef<Group>(null);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const label = labels.current.get(id);
    if (!group.current || !label) return;
    group.current.getWorldPosition(anchor).project(camera);
    label.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px,${(1 - anchor.y) * size.height / 2}px) translate(-50%,-50%)`;
    label.style.visibility = anchor.z >= -1 && anchor.z <= 1 ? 'visible' : 'hidden';
  });
  return <group ref={group} position={position} />;
}

function StackFocus({ step, position, center, scroll }: { step: Step; position: Point; center: Point; scroll: RefObject<HTMLDivElement | null> }) {
  const last = useRef<Step | null>(null);
  const anchor = useMemo(() => new Vector3(), []);
  const { camera, size } = useThree();
  useFrame(() => {
    if (!scroll.current || last.current === step) return;
    anchor.set(position[0] - center[0], position[1] - center[1], position[2] - center[2]).project(camera);
    scroll.current.scrollTop = Math.max(0, (1 - anchor.y) * size.height / 2 - scroll.current.clientHeight / 2);
    last.current = step;
  }, -.5);
  return null;
}

function Equipment({ capacity, stack, labels }: { capacity: number; stack: boolean; labels: Labels }) {
  const { end, entry, exit } = sequencePorts(capacity, stack);
  return stack ? <group>
    <Bar position={[0, -.5, 0]} size={[1.85, .2, 1.1]} color="#31463b" />
    {[-.82, .82].map((x) => <group key={x}>
      <Bar position={[x, end / 2 + .25, -.3]} size={[.12, end + 1.6, .18]} />
      <Bar position={[x, entry[1], 0]} size={[.22, .12, 1]} color="#9bb7a5" />
      <Bar position={[x, entry[1] + .14, .45]} size={[.16, .035, .05]} color="#d6b476" lit />
    </group>)}
    <Bar position={[0, entry[1], -.45]} size={[1.65, .12, .12]} />
    {Array.from({ length: capacity }, (_, index) => <Bar key={index} position={[0, index * .95 - .35, -.32]} size={[1.55, .045, .3]} />)}
    <Marker id="entry" position={[0, entry[1] + .55, 0]} labels={labels} />
  </group> : <group>
    {[-.32, .32].map((z) => <Bar key={z} position={[end / 2, -.4, z]} size={[end + 3.2, .09, .09]} />)}
    {Array.from({ length: capacity + 2 }, (_, index) => <Bar key={index} position={[(index - 1) * 1.1, -.47, 0]} size={[.15, .09, .85]} color="#31463b" />)}
    {[exit, entry].map(([x], index) => <group key={index} position={[x, 0, 0]}>
      {[-.55, .55].map((z) => <Bar key={z} position={[0, .05, z]} size={[.12, 1.05, .12]} />)}
      <Bar position={[0, .62, 0]} size={[.12, .12, 1.2]} color={index ? '#8c8196' : '#9bb7a5'} />
      <Bar position={[0, .71, 0]} size={[.08, .035, .7]} color={index ? '#8c8196' : '#9bb7a5'} lit />
    </group>)}
    <Marker id="exit" position={[exit[0], 1.15, 0]} labels={labels} />
    <Marker id="entry" position={[entry[0], 1.15, 0]} labels={labels} />
  </group>;
}

function Scanner({ step }: { step: Step }) {
  const scene = useSpaceLesson()!;
  const head = useRef<Group>(null);
  const curtain = useRef<Group>(null);
  const beam = useRef<Group>(null);
  const scanner = sequenceScanner(step, scene.previous, 1);
  const textLength = String(step.variables.text).length;
  useFrame(() => {
    const state = scene.clock.current;
    const t = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (t === undefined) return;
    const scan = sequenceScanner(step, scene.previous, t);
    if (head.current) head.current.position.x = scan.x;
    if (curtain.current) { curtain.current.position.x = scan.x; curtain.current.visible = scan.reading; }
    if (beam.current) { beam.current.position.x = scan.beam ?? 0; beam.current.visible = scan.beam !== undefined; }
  });
  return <group>
    {textLength > 0 && <group>
      <Bar position={[(textLength - 1) * .45, .9, -.16]} size={[textLength * .9 + .2, .64, .06]} color="#182721" />
      {[-.35, .35].map((y) => <Bar key={y} position={[(textLength - 1) * .45, .9 + y, -.12]} size={[textLength * .9 + .3, .018, .025]} color="#82968c" lit />)}
    </group>}
    {scanner.visible && <>
      <group ref={head} position={[scanner.x, -.9, 0]}>
        <Bar position={[0, 0, -.16]} size={[scanner.width, .64, .06]} color="#282430" />
        {[-.39, .39].map((y) => <Bar key={y} position={[0, y, 0]} size={[scanner.width + .2, .075, .23]} color="#8c8196" />)}
        {[-1, 1].map((side) => <group key={side} position={[side * (scanner.width / 2 + .05), 0, 0]}>
          <Bar position={[0, 0, 0]} size={[.15, .86, .3]} />
          <Bar position={[0, 0, .17]} size={[.045, .3, .025]} color="#d6b476" lit />
        </group>)}
      </group>
      <group ref={curtain} position={[scanner.x, 0, -.2]} visible={scanner.reading}>
        <mesh><planeGeometry args={[scanner.width, 1.25]} /><meshBasicMaterial color="#d6b476" transparent opacity={.045} depthWrite={false} side={2} /></mesh>
        <Bar position={[0, .54, 0]} size={[scanner.width, .025, .03]} color="#d6b476" lit />
      </group>
      <group ref={beam} position={[scanner.beam ?? 0, 0, 0]} visible={scanner.beam !== undefined}>
        <Bar position={[0, 0, 0]} size={[.018, 1.1, .018]} color="#d6b476" lit />
        {[-.55, .55].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.09, .015, 6, 24]} /><meshBasicMaterial color="#d6b476" /></mesh>)}
      </group>
    </>}
  </group>;
}

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

function Token({ token, previous, labels, capacity, peek }: { token?: SequenceToken; previous?: SequenceToken; labels: Labels; capacity: number; peek: boolean }) {
  const scene = useSpaceLesson()!;
  const item = token ?? previous!;
  const group = useRef<Group>(null);
  const scan = useRef<Group>(null);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  useFrame(() => {
    if (!group.current) return;
    const state = scene.clock.current;
    const t = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (t === undefined) return;
    group.current.position.set(...sequencePosition(token, previous, t, capacity));
    if (scan.current) scan.current.position.x = -.48 + .96 * t;
    const shown = Boolean(token) || t < 1;
    group.current.visible = shown;
    const label = labels.current.get(item.id);
    if (label) {
      group.current.getWorldPosition(anchor).project(camera);
      const labelScale = Math.min(1, (camera as OrthographicCamera).zoom / 48);
      label.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px,${(1 - anchor.y) * size.height / 2}px) translate(-50%,-50%) scale(${labelScale})`;
      label.style.visibility = shown && anchor.z >= -1 && anchor.z <= 1 ? 'visible' : 'hidden';
    }
  });
  return <group ref={group}>
    {item.row === 'stack' ? <>
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[.23, .65, 6, 16]} /><meshStandardMaterial color={item.color} metalness={.55} roughness={.35} /></mesh>
      {[-.33, .33].map((x) => <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.235, .035, 6, 24]} /><meshStandardMaterial color="#31463b" metalness={.8} roughness={.3} /></mesh>)}
      <Bar position={[0, 0, .235]} size={[.44, .23, .025]} color="#182721" />
      {peek && item.active && <group ref={scan}><Bar position={[0, 0, .29]} size={[.025, .45, .025]} color="#d6b476" lit /></group>}
    </> : item.row === 'queue' ? <>
      <mesh><boxGeometry args={[.76, .5, .58]} /><meshStandardMaterial color={item.color} metalness={.55} roughness={.45} /></mesh>
      {[-.34, .34].map((x) => <Bar key={x} position={[x, 0, .31]} size={[.055, .58, .07]} color="#31463b" />)}
      {[-.25, .25].map((y) => <Bar key={y} position={[0, y, 0]} size={[.84, .06, .68]} />)}
      <Bar position={[0, 0, .305]} size={[.5, .23, .025]} color="#182721" />
    </> : <>
      <Bar position={[0, -.27, 0]} size={[.025, .055, .035]} color={item.color} lit />
      {item.active && <Bar position={[0, 0, -.09]} size={[.64, .53, .025]} color={item.row === 'text' ? '#3b3828' : '#413448'} />}
    </>}
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
  const capacity = scene.capacity ?? Math.max(1, step.array.length, scene.previous.array.length);
  const ports = sequencePorts(capacity, model.stack);
  const tokens = [...model.tokens, ...previous.tokens.filter((token) => !model.tokens.some((item) => item.id === token.id))];
  const width = model.linear ? ports.width : Math.max(model.width, previous.width);
  const height = model.linear ? ports.height : Math.max(model.height, previous.height);
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
    if (model.linear && !model.stack && capacity <= 4) element.scrollLeft = 0;
  }, [scene.index, step]);
  if (lost) return <>{fallback}<p role="status" className="graph-help">{ko ? '3D를 표시할 수 없어 2D로 보여드립니다.' : '3D is unavailable. Showing the 2D view.'}</p></>;
  return <div ref={sceneRef} className="sequence-observatory" data-testid="sequence-3d" data-kind={text ? 'string' : model.stack ? 'stack' : 'queue'}>
    <p className="graph-help sequence-guide">{text
      ? step.variables.phase === 'prefix' ? ko ? '패턴 내부의 접두·접미를 조사합니다 · 접두 표는 아래 실행 기록에 표시' : 'Inspecting prefixes and suffixes inside the pattern · prefix table in the record below'
        : ko ? '위: 텍스트 신호 · 아래: 패턴 스캔 헤드 · 금빛 창: 조사 구간 · 선: 문자 비교' : 'Above: text signal · below: pattern scan head · gold window: inspected range · beam: character comparison'
      : model.stack ? ko ? '탐사 캡슐 적재실 · 위쪽 해치 하나로 PUSH / POP · TOP만 먼저 접근' : 'Exploration capsule bay · one upper hatch for PUSH / POP · TOP is reached first'
        : ko ? '화물 이송 레일 · FRONT 출구 ← REAR 입구 · 먼저 온 화물부터' : 'Cargo transfer rail · FRONT exit ← REAR entry · first arrival leaves first'}</p>
    <div ref={scroll} className="sequence-scroll" tabIndex={0} role="region" aria-label={ko ? '3D 관측 화면 · 긴 입력은 스크롤로 이동' : '3D observation · scroll to inspect long inputs'}>
      <div className="sequence-stage" style={{ minWidth: text ? width * 48 : model.stack ? 320 : width * 42, height: Math.max(330, height * (model.stack ? 48 : 58)) }}>
        <SceneBoundary fallback={fallback} onError={() => setLost(true)}><div className="graph-canvas"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [...home], zoom: 50 }} onCreated={({ gl }) => {
          gl.setClearColor('#0b1012', 0);
          gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
        }}>
          <Camera width={width} height={height} reset={reset} language={language} />
          {model.stack && <StackFocus step={step} position={model.tokens[0]?.position ?? ports.entry} center={ports.center} scroll={scroll} />}
          <ambientLight intensity={.65} color="#b9c9b5" /><directionalLight position={[-4, 7, 5]} intensity={3.2} color="#fff6e6" /><directionalLight position={[4, 1, -4]} intensity={1.4} color="#9bb7a5" />
          <Arrangement center={model.linear ? ports.center : model.center} previous={model.linear ? ports.center : previous.center}>
            {model.linear ? <Equipment capacity={capacity} stack={model.stack} labels={labels} /> : <Scanner step={step} />}
            {tokens.map((item) => <Token key={item.id} token={model.tokens.find((token) => token.id === item.id)} previous={previous.tokens.find((token) => token.id === item.id)} labels={labels} capacity={capacity} peek={step.type === 'peek'} />)}
          </Arrangement>
        </Canvas></div></SceneBoundary>
        <div className="sequence-labels" aria-hidden="true">{model.linear && (model.stack ? ['entry'] : ['entry', 'exit']).map((id) => <span key={id} className="sequence-port" ref={(node) => { if (node) labels.current.set(id, node); else labels.current.delete(id); }}>
          <strong>{model.stack ? ko ? '입출구' : 'HATCH' : id === 'entry' ? 'REAR' : 'FRONT'}</strong><small>{model.stack ? 'PUSH / POP' : id === 'entry' ? ko ? '입구' : 'ENTRY' : ko ? '출구' : 'EXIT'}</small>
        </span>)}{tokens.map((item) => <span key={item.id} data-active={item.active} data-wide={item.label.length > 3} ref={(node) => { if (node) labels.current.set(item.id, node); else labels.current.delete(item.id); }}>
          <strong>{item.label}</strong><small>{!model.tokens.some((token) => token.id === item.id) ? model.stack ? 'POP' : 'DEQUEUE' : item.row === 'stack' ? item.index === 0 ? 'TOP' : `[${item.index}]` : item.row === 'queue' ? item.index === 0 ? model.tokens.length === 1 ? 'FRONT / REAR' : 'FRONT' : item.index === model.tokens.length - 1 ? 'REAR' : `[${item.index}]` : `[${item.index}]`}</small>
        </span>)}</div>
        {!model.tokens.length && <p className="sequence-empty">{ko ? '비어 있음 · ∅' : 'Empty · ∅'}</p>}
      </div>
    </div>
    <div className="graph-scene-footer"><p className="graph-help">{ko ? '마우스·방향키로 회전 · 긴 입력은 스크롤·스와이프 · 일시정지로 이동 멈추기' : 'Mouse or arrow keys to orbit · scroll or swipe long inputs · pause freezes transfers'}</p><button className="bubble-size-button" onClick={() => setReset((value) => value + 1)}>{ko ? '시점 초기화' : 'Reset view'}</button></div>
    <details className="sequence-records"><summary>{ko ? '정확한 값·인덱스 보기' : 'Inspect exact values and indices'}</summary>{fallback}</details>
  </div>;
}
