import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, OrthographicCamera, ShaderMaterial } from 'three';
import { SceneBoundary } from './BubbleScene';
import { workStar } from './bubble-motion';

function Camera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / 6.5, size.height / 6.5);
    ortho.lookAt(0, 0, 0);
    ortho.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function Cluster({ count, color, reduced }: { count: number; color: string; reduced: boolean }) {
  const { camera, gl, invalidate } = useThree();
  const geometry = useMemo(() => {
    const cloud = new BufferGeometry();
    const positions = new Float32Array(8128 * 3);
    for (let i = 0; i < 8128; i += 1) positions.set(workStar(i), i * 3);
    cloud.setAttribute('position', new BufferAttribute(positions, 3));
    cloud.setAttribute('alpha', new BufferAttribute(new Float32Array(8128), 1));
    return cloud;
  }, []);
  const material = useMemo(() => new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { color: { value: new Color(color) }, pointSize: { value: 4 } },
    vertexShader: `attribute float alpha; varying float vAlpha; uniform float pointSize;
      void main(){vAlpha=alpha; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_PointSize=pointSize;}`,
    fragmentShader: `uniform vec3 color; varying float vAlpha;
      void main(){float r=length(gl_PointCoord-0.5); float glow=exp(-r*r*18.0); float core=1.0-smoothstep(0.06,0.20,r);
        gl_FragColor=vec4(mix(color,vec3(1.0),core*0.5),vAlpha*(glow*0.5+core*0.5));
        #include <colorspace_fragment>
      }`,
  }), [color]);
  const currentCount = useRef(0);
  const motion = useRef({ start: new Float32Array(8128), elapsed: 1, total: 0 });
  useEffect(() => {
    motion.current = { start: new Float32Array(geometry.getAttribute('alpha').array), elapsed: reduced || currentCount.current === 0 ? 1 : 0, total: Math.max(count, currentCount.current) };
    invalidate();
  }, [count, reduced, geometry, invalidate]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => {
    const state = motion.current;
    state.elapsed = Math.min(1, state.elapsed + Math.min(delta, 0.1));
    const progress = 1 - (1 - state.elapsed) ** 3;
    const alpha = geometry.getAttribute('alpha') as BufferAttribute;
    for (let i = 0; i < state.total; i += 1) alpha.setX(i, state.start[i] + ((i < count ? 1 : 0) - state.start[i]) * progress);
    alpha.needsUpdate = true;
    geometry.setDrawRange(0, state.elapsed === 1 ? count : state.total);
    material.uniforms.pointSize.value = Math.max(4, (camera as OrthographicCamera).zoom * 0.16) * gl.getPixelRatio();
    currentCount.current = state.elapsed === 1 ? count : state.total;
    if (state.elapsed < 1) invalidate();
  });
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export default function ComplexityScene({ count, color, reduced }: { count: number; color: string; reduced: boolean }) {
  const [lost, setLost] = useState(false);
  const fallback = <div className="complexity-unavailable" />;
  return <div className="complexity-stage" data-star-count={count} aria-hidden="true">{lost ? fallback : <SceneBoundary fallback={fallback} onError={() => setLost(true)}>
    <Canvas orthographic frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 2.4, 6], zoom: 32 }} gl={{ alpha: true, antialias: true }} onCreated={({ camera, gl }) => {
      camera.lookAt(0, 0, 0);
      gl.setClearColor('#0b1012', 0);
      gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
    }}>
      <Camera />
      <Cluster count={count} color={color} reduced={reduced} />
    </Canvas>
  </SceneBoundary>}</div>;
}
