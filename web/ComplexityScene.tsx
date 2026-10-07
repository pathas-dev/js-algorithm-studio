import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D, OrthographicCamera } from 'three';
import { SceneBoundary } from './BubbleScene';
import { springProgress, workBlock } from './bubble-motion';

function Camera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / 5, size.height / 5.3);
    ortho.lookAt(0, 1.35, 0);
    ortho.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function Pile({ count, color, reduced }: { count: number; color: string; reduced: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const { invalidate } = useThree();
  const current = useRef({ positions: new Float32Array(8128 * 3), scales: new Float32Array(8128), count: 0 });
  const motion = useRef({ start: new Float32Array(), scales: new Float32Array(), target: new Float32Array(), count: 0, elapsed: 1 });
  useEffect(() => {
    const total = Math.max(count, current.current.count);
    const start = current.current.positions.slice();
    const scales = current.current.scales.slice();
    const target = new Float32Array(total * 3);
    for (let i = 0; i < total; i += 1) {
      const point = i < count ? workBlock(i, count) : Array.from(start.subarray(i * 3, i * 3 + 3));
      target.set(point, i * 3);
      if (i >= current.current.count) start.set([point[0], point[1] + 0.65, point[2] + 0.25], i * 3);
    }
    motion.current = { start, scales, target, count: total, elapsed: reduced || current.current.count === 0 ? 1 : 0 };
    invalidate();
  }, [count, reduced, invalidate]);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const state = motion.current;
    state.elapsed = Math.min(1, state.elapsed + Math.min(delta, 0.1));
    const progress = springProgress(state.elapsed);
    mesh.current.count = state.elapsed === 1 ? count : state.count;
    for (let i = 0; i < state.count; i += 1) {
      const scale = Math.max(0, state.scales[i] + ((i < count ? 1 : 0) - state.scales[i]) * progress);
      for (let axis = 0; axis < 3; axis += 1) {
        const offset = i * 3 + axis;
        current.current.positions[offset] = state.start[offset] + (state.target[offset] - state.start[offset]) * progress;
      }
      dummy.position.fromArray(current.current.positions, i * 3);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      current.current.scales[i] = scale;
    }
    current.current.count = mesh.current.count;
    mesh.current.instanceMatrix.needsUpdate = true;
    if (state.elapsed < 1) invalidate();
  });
  return <instancedMesh ref={mesh} args={[undefined, undefined, 8128]} frustumCulled={false} castShadow>
    <boxGeometry args={[0.145, 0.145, 0.145]} />
    <meshStandardMaterial color={color} roughness={0.93} metalness={0} />
  </instancedMesh>;
}

export default function ComplexityScene({ count, color, reduced }: { count: number; color: string; reduced: boolean }) {
  const [lost, setLost] = useState(false);
  const fallback = <div className="complexity-unavailable" />;
  return <div className="complexity-stage" aria-hidden="true">{lost ? fallback : <SceneBoundary fallback={fallback} onError={() => setLost(true)}>
    <Canvas orthographic frameloop="demand" shadows dpr={[1, 1.5]} camera={{ position: [4, 4.5, 6], zoom: 42 }} onCreated={({ camera, gl }) => {
      camera.lookAt(0, 1.35, 0);
      gl.setClearColor('#f0efe7');
      gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
    }}>
      <Camera />
      <ambientLight intensity={1.2} color="#f5efe3" />
      <directionalLight position={[-3, 10, 4]} intensity={2.8} color="#fff6e6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0004} />
      <directionalLight position={[4, 3, -3]} intensity={0.8} color="#b9c9b5" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[100, 100]} /><shadowMaterial color="#41503e" opacity={0.14} /></mesh>
      <Pile count={count} color={color} reduced={reduced} />
    </Canvas>
  </SceneBoundary>}</div>;
}
