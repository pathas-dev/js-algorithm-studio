import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Mesh, MeshStandardMaterial, OrthographicCamera, Vector3 } from 'three';
import type { Step, Language } from './algorithms';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import { SceneBoundary } from './BubbleScene';
import { BUBBLE_SWAP_MS } from './bubble-playback';

type RingPosition = { disc: number; pole: number; level: number };
export const hanoiPositions = (poles: number[][]): RingPosition[] => poles.flatMap((pole, station) => [...pole].reverse().map((disc, level) => ({ disc, pole: station, level })));
export function hanoiPosition(next: RingPosition, previous: RingPosition | undefined, progress: number): [number, number, number] {
  const from = previous ?? next;
  const t = Math.max(0, Math.min(1, progress));
  return [(from.pole + (next.pole - from.pole) * t - 1) * 3.2, .3 + (from.level + (next.level - from.level) * t) * .3 + (from.pole === next.pole ? 0 : Math.sin(t * Math.PI) * 2.2), 0];
}

function Camera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / 10.5, size.height / 5.4);
    camera.position.set(-3, 5, 10);
    camera.lookAt(0, 1.1, 0);
    ortho.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function StationLabels({ labels }: { labels: React.RefObject<Map<number, HTMLSpanElement>> }) {
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  useFrame(() => {
    for (const [pole, node] of labels.current) {
      anchor.set((pole - 1) * 3.2, -.45, 0).project(camera);
      node.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px,${(1 - anchor.y) * size.height / 2}px) translate(-50%,-50%)`;
    }
  });
  return null;
}

function Ring({ item, prior, n, active, visible, label }: { item: RingPosition; prior?: RingPosition; n: number; active: boolean; visible: boolean; label: React.RefObject<Map<number, HTMLLIElement>> }) {
  const scene = useSpaceLesson()!;
  const mesh = useRef<Mesh>(null);
  const spin = useRef(0);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  const radius = .25 + item.disc / n * .75;
  const color = useMemo(() => new Color(active ? '#d6b476' : ['#82968c', '#b7a07e', '#8c8196'][item.disc % 3]), [active, item.disc]);
  const material = useMemo(() => {
    const surface = new MeshStandardMaterial({ color: '#82968c', roughness: .88 });
    surface.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 ringPoint;').replace('#include <begin_vertex>', '#include <begin_vertex>\nringPoint=position;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 ringPoint;').replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= .65+.35*sin(atan(ringPoint.y,ringPoint.x)*7.0+sin(ringPoint.x*23.0));');
    };
    return surface;
  }, []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const progress = scene.clock.current.animate ? Math.min(1, scene.clock.current.elapsed / BUBBLE_SWAP_MS) : 1;
    mesh.current.position.set(...hanoiPosition(item, prior, progress));
    if (visible) spin.current += Math.min(delta, .1) * Math.PI * 2 / (8 + item.disc / n * 4);
    mesh.current.rotation.set(-Math.PI / 2, 0, spin.current);
    material.color.lerp(color, 1 - Math.exp(-Math.min(delta, .1) * 8));
    anchor.copy(mesh.current.position).add(new Vector3(radius + .18, .12, 0)).project(camera);
    const node = label.current.get(item.disc);
    if (node) node.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px,${(1 - anchor.y) * size.height / 2}px) translate(-50%,-50%)`;
  });
  return <mesh ref={mesh} material={material} position={hanoiPosition(item, prior, 1)} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[radius, .065, 12, 80]} /></mesh>;
}

export default function HanoiScene({ step, language }: { step: Step; language: Language }) {
  const scene = useSpaceLesson();
  const [lost, setLost] = useState(false);
  const { sceneRef, visible } = useSceneVisibility(Boolean(scene && !scene.reduced && !lost));
  const labels = useRef(new Map<number, HTMLLIElement>());
  const stations = useRef(new Map<number, HTMLSpanElement>());
  const poles: number[][] = JSON.parse(String(step.variables.poles));
  const rings = hanoiPositions(poles);
  const prior = hanoiPositions(JSON.parse(String(scene?.previous.variables.poles ?? step.variables.poles)));
  const records = <div className="hanoi-stations">{poles.map((pole, index) => <div key={index}><strong>{'ABC'[index]}</strong><span>{language === 'ko' ? '위 → 아래' : 'Top → bottom'}</span><output>[{pole.join(', ')}]</output></div>)}</div>;
  if (!scene || scene.reduced || lost) return <div className="hanoi-static"><svg viewBox="0 0 420 220" role="img" aria-label={language === 'ko' ? '세 정거장의 하노이 고리' : 'Hanoi rings at three stations'}>{rings.map(({ disc, pole, level }) => <g key={disc}><ellipse cx={70 + pole * 140} cy={170 - level * 24} rx={15 + disc / Number(step.variables.n) * 35} ry={8} fill="none" stroke={disc === Number(step.variables.disc) ? '#d6b476' : '#8faf9d'} strokeWidth="5" /><text x={70 + pole * 140} y={173 - level * 24} fill="#e2e7d9" fontSize="11" textAnchor="middle">{disc}</text></g>)}</svg>{records}</div>;
  return <div ref={sceneRef} className="hanoi-scene">
    <SceneBoundary fallback={records} onError={() => setLost(true)}><div className="hanoi-canvas" aria-hidden="true"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ zoom: 50 }} onCreated={({ gl }) => { gl.setClearColor('#0b1012', 0); gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true }); }}>
      <Camera /><StationLabels labels={stations} /><ambientLight intensity={1} /><directionalLight position={[-4, 8, 5]} intensity={3} color="#fff6e6" /><directionalLight position={[3, 1, -3]} intensity={1} color="#a3b0a7" />
      {[0, 1, 2].map((pole) => <group key={pole} position={[(pole - 1) * 3.2, 0, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.16, 1.18, 80]} /><meshBasicMaterial color="#526b60" side={2} /></mesh><mesh><sphereGeometry args={[.2, 24, 16]} /><meshStandardMaterial color="#8faf9d" emissive="#82968c" emissiveIntensity={.4} roughness={1} /></mesh></group>)}
      {rings.map((item) => <Ring key={item.disc} item={item} prior={prior.find((ring) => ring.disc === item.disc)} n={Number(step.variables.n)} active={step.type === 'move' && item.disc === Number(step.variables.disc)} visible={visible} label={labels} />)}
    </Canvas></div></SceneBoundary>
    <ol className="hanoi-labels" aria-label={language === 'ko' ? '현재 원판 위치' : 'Current disc positions'}>{rings.map(({ disc, pole, level }) => <li key={disc} ref={(node) => { if (node) labels.current.set(disc, node); else labels.current.delete(disc); }} aria-label={`${disc} · ${'ABC'[pole]} · ${level}`}><span>{disc}</span></li>)}</ol>
    <div className="hanoi-orbit-names" aria-hidden="true">{[0, 1, 2].map((pole) => <span key={pole} ref={(node) => { if (node) stations.current.set(pole, node); else stations.current.delete(pole); }}>{'ABC'[pole]}</span>)}</div>
    {records}
  </div>;
}
