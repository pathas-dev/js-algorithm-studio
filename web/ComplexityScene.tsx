import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, OrthographicCamera, ShaderMaterial, type Points } from 'three';
import { SceneBoundary } from './BubbleScene';
import { workStar } from './bubble-motion';
import { useSceneVisibility } from './use-scene-visibility';

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

function Cluster({ count, color, reduced, visible }: { count: number; color: string; reduced: boolean; visible: boolean }) {
  const cluster = useRef<Points>(null);
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
    uniforms: { color: { value: new Color(color) }, pointSize: { value: 4 }, uSpin: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `attribute float alpha; varying float vAlpha, vSeed; uniform float pointSize;
      void main(){vAlpha=alpha; vSeed=fract(sin(dot(position,vec3(12.9,78.2,37.7)))*43758.5); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_PointSize=pointSize;}`,
    fragmentShader: `uniform vec3 color; uniform float uSpin, uTime; varying float vAlpha, vSeed;
      void main(){
        vec2 p=gl_PointCoord-0.5;
        float angle=uSpin*(0.85+vSeed*0.3)+vSeed*6.283185;
        float c=cos(angle), s=sin(angle);
        vec2 surface=mat2(c,-s,s,c)*p;
        float r=length(p), glow=exp(-r*r*18.0);
        float core=exp(-dot(surface-vec2(0.07,0.025),surface-vec2(0.07,0.025))*130.0);
        float pulse=0.72+0.28*sin(uTime*0.9+vSeed*6.283185);
        gl_FragColor=vec4(mix(color,vec3(1.0),core*0.5),vAlpha*(glow*0.5+core*0.5)*pulse);
        #include <colorspace_fragment>
      }`,
  }), [color]);
  const spinTime = useRef(0);
  const currentCount = useRef(0);
  const motion = useRef({ start: new Float32Array(8128), elapsed: 1, total: 0, dirty: true });
  useEffect(() => {
    motion.current = { start: new Float32Array(geometry.getAttribute('alpha').array), elapsed: reduced || currentCount.current === 0 ? 1 : 0, total: Math.max(count, currentCount.current), dirty: true };
    invalidate();
  }, [count, reduced, geometry, invalidate]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => {
    const state = motion.current;
    if (state.dirty || state.elapsed < 1) {
      state.elapsed = reduced || !visible ? 1 : Math.min(1, state.elapsed + Math.min(delta, 0.1));
      const progress = 1 - (1 - state.elapsed) ** 3;
      const alpha = geometry.getAttribute('alpha') as BufferAttribute;
      for (let i = 0; i < state.total; i += 1) alpha.setX(i, state.start[i] + ((i < count ? 1 : 0) - state.start[i]) * progress);
      alpha.needsUpdate = true;
      geometry.setDrawRange(0, state.elapsed === 1 ? count : state.total);
      state.dirty = false;
    }
    if (visible && !reduced) spinTime.current += Math.min(delta, 0.1) * 1000;
    const seconds = spinTime.current / 1000;
    if (cluster.current) cluster.current.rotation.set(Math.sin(seconds * 0.22) * 0.18, seconds * 0.18, Math.sin(seconds * 0.16) * 0.05);
    material.uniforms.uTime.value = seconds;
    material.uniforms.uSpin.value = seconds * 0.102;
    material.uniforms.pointSize.value = Math.max(4, (camera as OrthographicCamera).zoom * 0.16) * gl.getPixelRatio();
    currentCount.current = state.elapsed === 1 ? count : state.total;
    if (state.elapsed < 1) invalidate();
  });
  return <points ref={cluster} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function ComplexityScene({ count, color, reduced }: { count: number; color: string; reduced: boolean }) {
  const [lost, setLost] = useState(false);
  const { sceneRef, visible } = useSceneVisibility(!reduced && !lost);
  const fallback = <div className="complexity-unavailable" />;
  return <div ref={sceneRef} className="complexity-stage" data-star-count={count} data-spinning={visible} aria-hidden="true">{lost ? fallback : <SceneBoundary fallback={fallback} onError={() => setLost(true)}>
    <Canvas orthographic frameloop={visible ? 'always' : 'demand'} dpr={[1, 1.5]} camera={{ position: [0, 2.4, 6], zoom: 32 }} gl={{ alpha: true, antialias: true }} onCreated={({ camera, gl }) => {
      camera.lookAt(0, 0, 0);
      gl.setClearColor('#0b1012', 0);
      gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
    }}>
      <Camera />
      <Cluster count={count} color={color} reduced={reduced} visible={visible} />
    </Canvas>
  </SceneBoundary>}</div>;
}
