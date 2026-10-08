import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Mesh, OrthographicCamera, Quaternion, ShaderMaterial, TubeGeometry, Vector3 } from 'three';
import SceneOrbit from './SceneOrbit';
import { SceneBoundary } from './BubbleScene';
import { useSpaceLesson } from './SpaceLesson';
import { useSceneVisibility } from './use-scene-visibility';
import type { GraphPlanet, GraphConnection } from './graph-scene';
import { graphCurve } from './graph-geometry';
import { atmosphereMaterial, planetMaterial } from './planet-material';
import { traceTransitionTime } from './bubble-motion';
import type { Language } from './algorithms';

type Labels = RefObject<Map<string, HTMLSpanElement>>;
const home = [-1.8, 6.5, 8] as const;
const target = [0, .25, 0] as const;

function Camera({ reset, language }: { reset: number; language: Language }) {
  const scene = useSpaceLesson()!;
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / 8.2, size.height / 6.2) * (scene.zoom ?? 1);
    ortho.updateProjectionMatrix();
    invalidate();
  }, [camera, size, scene.zoom, invalidate]);
  return <SceneOrbit home={home} target={target} reset={reset} label={language === 'ko' ? '3D 그래프 · 드래그 또는 방향키로 회전, 스크롤로 확대·축소, Home으로 시점 초기화' : '3D graph · drag or use arrow keys to orbit, scroll to zoom, Home to reset'} />;
}

function Labels({ nodes, edges, labels, weighted }: { nodes: GraphPlanet[]; edges: GraphConnection[]; labels: Labels; weighted: boolean }) {
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  const curves = useMemo(() => edges.map(graphCurve), [edges]);
  useFrame(() => {
    const place = (key: string, position: Vector3) => {
      const node = labels.current.get(key);
      if (!node) return;
      anchor.copy(position).project(camera);
      node.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px,${(1 - anchor.y) * size.height / 2}px) translate(-50%,-50%)`;
      node.style.visibility = anchor.z < -1 || anchor.z > 1 ? 'hidden' : 'visible';
    };
    nodes.forEach((node) => place(`node-${node.id}`, new Vector3(...node.position).add(new Vector3(0, .57, 0))));
    if (weighted) edges.forEach((edge, index) => { if (edge.weight !== undefined) place(`edge-${edge.from.id}-${edge.to.id}`, curves[index].getPoint(.5).add(new Vector3(0, .08, 0))); });
  });
  return null;
}

function Planet({ node, visible }: { node: GraphPlanet; visible: boolean }) {
  const mesh = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  const material = useMemo(() => planetMaterial(node.id), [node.id]);
  const atmosphere = useMemo(() => atmosphereMaterial(), []);
  const color = useMemo(() => new Color(node.color).multiplyScalar(node.dimmed ? .45 : 1), [node.color, node.dimmed]);
  useEffect(() => () => { material.dispose(); atmosphere.dispose(); }, [material, atmosphere]);
  useFrame((_, delta) => {
    if (mesh.current && visible) mesh.current.rotation.y += Math.min(delta, .1) * Math.PI * 2 / 10;
    material.color.lerp(color, 1 - Math.exp(-Math.min(delta, .1) * 8));
    atmosphere.uniforms.uColor.value.copy(material.color);
    atmosphere.uniforms.uOpacity.value = node.current ? .65 : .24;
    if (ring.current) ring.current.rotation.z = -.25;
  });
  return <group position={node.position}>
    <mesh ref={mesh} material={material}><sphereGeometry args={[.36, 40, 28]} /></mesh>
    <mesh material={atmosphere}><sphereGeometry args={[.385, 32, 24]} /></mesh>
    <mesh ref={ring} rotation={[-Math.PI / 2.5, .2, -.25]}><ringGeometry args={[.46, node.current || node.via ? .485 : .467, 64]} /><meshBasicMaterial color={node.via ? '#afa0be' : node.color} transparent opacity={node.current || node.via ? .85 : .28} side={2} depthWrite={false} /></mesh>
  </group>;
}

function Connection({ edge }: { edge: GraphConnection }) {
  const scene = useSpaceLesson()!;
  const curve = useMemo(() => graphCurve(edge), [edge]);
  const geometry = useMemo(() => new TubeGeometry(curve, 48, edge.active || edge.selected ? .022 : .012, 5, false), [curve, edge.active, edge.selected]);
  const color = edge.active ? '#d6b476' : edge.selected ? '#8faf9d' : '#526b60';
  const arrow = useMemo(() => ({ position: curve.getPoint(.96), rotation: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), curve.getTangent(.96).normalize()) }), [curve]);
  const flow = useMemo(() => new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uProgress: { value: 0 }, uColor: { value: new Color('#eed1a3') } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `varying vec2 vUv; uniform float uProgress; uniform vec3 uColor;
      void main(){float trail=exp(-abs(vUv.x-uProgress)*22.0); gl_FragColor=vec4(uColor,trail*.95);
      #include <colorspace_fragment>
      }`,
  }), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => flow.dispose(), [flow]);
  useFrame(() => {
    const state = scene.clock.current;
    const progress = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (progress !== undefined) flow.uniforms.uProgress.value = edge.reverse ? 1 - progress : progress;
  });
  return <>
    <mesh geometry={geometry}><meshBasicMaterial color={color} transparent opacity={edge.active || edge.selected ? .9 : .55} /></mesh>
    {edge.active && <mesh geometry={geometry} material={flow} />}
    {edge.directed && <mesh position={arrow.position} quaternion={arrow.rotation}><coneGeometry args={[.07, .19, 8]} /><meshBasicMaterial color={edge.active || edge.selected ? color : '#a3b0a7'} /></mesh>}
  </>;
}

export default function GraphScene({ nodes, edges, language, weighted, fallback }: { nodes: GraphPlanet[]; edges: GraphConnection[]; language: Language; weighted: boolean; fallback: ReactNode }) {
  const scene = useSpaceLesson()!;
  const [lost, setLost] = useState(false);
  const [reset, setReset] = useState(0);
  const { sceneRef, visible } = useSceneVisibility(!scene.reduced && !lost);
  const labels = useRef(new Map<string, HTMLSpanElement>());
  const ko = language === 'ko';
  const labelRef = (key: string) => (node: HTMLSpanElement | null) => { if (node) labels.current.set(key, node); else labels.current.delete(key); };
  if (lost) return <>{fallback}<p className="graph-help" role="status">{ko ? '3D를 표시할 수 없어 탑뷰로 보여드립니다.' : '3D is unavailable. Showing the top view.'}</p></>;
  return <div ref={sceneRef} className="graph-observatory" data-testid="graph-3d">
    <div className="graph-scene" role="group" aria-label={ko ? '행성과 연결 궤도로 보는 3D 그래프' : '3D graph of planets and connections'}>
      <SceneBoundary fallback={fallback} onError={() => setLost(true)}><div className="graph-canvas"><Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [...home], zoom: 50 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => {
        gl.setClearColor('#0b1012', 0);
        gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
      }}>
        <Camera reset={reset} language={language} /><Labels nodes={nodes} edges={edges} labels={labels} weighted={weighted} />
        <ambientLight intensity={.65} color="#b9c9b5" /><directionalLight position={[-4, 7, 5]} intensity={3.2} color="#fff6e6" /><directionalLight position={[4, 1, -4]} intensity={1.4} color="#9bb7a5" />
        {edges.map((edge) => <Connection key={`${edge.from.id}-${edge.to.id}`} edge={edge} />)}
        {nodes.map((node) => <Planet key={node.id} node={node} visible={visible} />)}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.15, 0]}><ringGeometry args={[3.68, 3.69, 128]} /><meshBasicMaterial color="#526b60" transparent opacity={.18} side={2} depthWrite={false} /></mesh>
      </Canvas></div></SceneBoundary>
      <div className="graph-labels" aria-hidden="true">{nodes.map((node) => <span key={node.id} ref={labelRef(`node-${node.id}`)} className="graph-node-label" data-current={node.current} data-dimmed={node.dimmed}>{node.value}</span>)}
        {weighted && edges.map((edge) => edge.weight !== undefined && <span key={`${edge.from.id}-${edge.to.id}`} ref={labelRef(`edge-${edge.from.id}-${edge.to.id}`)} className="graph-weight-label" data-active={edge.active || edge.selected}>{edge.weight}</span>)}
      </div>
      <span className="sr-only">{nodes.map((node) => `${node.value}${node.current ? ko ? ' 현재 정점' : ' current vertex' : ''}`).join(', ')}. {edges.map((edge) => `${edge.from.value}${edge.directed ? ' → ' : ' ↔ '}${edge.to.value}${weighted && edge.weight !== undefined ? ` (${edge.weight})` : ''}${edge.active ? ko ? ' 검사 중' : ' inspecting' : edge.selected ? ko ? ' 선택됨' : ' selected' : ''}`).join('; ')}</span>
    </div>
    <div className="graph-scene-footer"><p className="graph-help">{ko ? '드래그·방향키로 회전 · 스크롤로 확대·축소' : 'Drag or use arrow keys to orbit · scroll to zoom'}</p><button className="bubble-size-button" onClick={() => setReset((value) => value + 1)}>{ko ? '시점 초기화' : 'Reset view'}</button></div>
  </div>;
}
