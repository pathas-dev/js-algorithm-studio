import { Component, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, Color, Mesh, MeshStandardMaterial, OrthographicCamera, VSMShadowMap, Points, ShaderMaterial, Vector2, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Item, Step } from './algorithms';
import type { BubblePlayback } from './bubble-playback';
import ArrayView from './ArrayView';
import './bubble.css';

type Props = { step: Step; previous: Step; clock: RefObject<BubblePlayback>; language: 'ko' | 'en'; reduced: boolean; view: '2d' | '3d' };
type Labels = RefObject<Map<number, HTMLLIElement>>;
const ease = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
const seed = (i: number) => { const n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const erosion = (state: BubblePlayback) => state.phase === 'erode' ? state.elapsed / 6000 : state.phase === 'form' ? 1 - state.elapsed / 3000 : 0;
const position = (index: number, length: number) => (index - (length - 1) / 2) * 1.12;
const height = (item: Item, maximum: number) => Math.max(0.16, Math.abs(item.value) / maximum * 3.2);

function Camera({ count, signed, view }: { count: number; signed: boolean } & Pick<Props, 'view'>) {
  const { camera, size } = useThree();
  const depth = useRef(view === '3d' ? 1 : 0);
  const target = useMemo(() => new Vector3(0, signed ? 0 : 1.25, 0), [signed]);
  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = Math.min(size.width / Math.max(7.8, count * 1.12 + 1.8), size.height / (signed ? 9.6 : 5.5));
    ortho.updateProjectionMatrix();
  }, [camera, size.width, size.height, count, signed]);
  useFrame((_, delta) => {
    depth.current += ((view === '3d' ? 1 : 0) - depth.current) * (1 - Math.exp(-Math.min(delta, 0.1) * 7));
    camera.position.set(-2.2 * depth.current, target.y + 3.5 * depth.current, 12);
    camera.lookAt(target);
    camera.updateMatrixWorld();
  }, -1);
  return null;
}

function Backdrop({ step, clock }: Pick<Props, 'step' | 'clock'>) {
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  const material = useMemo(() => new ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uRelease: { value: 0 }, uRipple: { value: 0 }, uCenter: { value: new Vector2(0.5, 0.4) }, uPaper: { value: new Color('#f0efe7') }, uClay: { value: new Color('#91a28b') }, uInk: { value: new Color('#41503e') } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,1.0,1.0);}',
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime, uAspect, uRelease, uRipple;
      uniform vec2 uCenter;
      uniform vec3 uPaper, uClay, uInk;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      float field(vec2 p){return noise(p)*0.57+noise(p*2.07+3.1)*0.29+noise(p*4.13+7.6)*0.14;}
      void main(){
        vec2 p=(vUv-0.5)*vec2(min(uAspect,3.0),1.0)*2.7;
        float t=uTime*0.11;
        vec2 drift=vec2(field(p+vec2(t,-t*0.7)),field(p+vec2(-t*0.6,t)+9.2));
        float wash=field(p+drift*(1.6+uRelease*1.2)+vec2(t*0.3,-t*0.22));
        float folds=field(p-drift*1.2-vec2(t*0.25,0.0)+14.3);
        float quiet=smoothstep(0.15,0.65,length((vUv-vec2(0.5,0.48))*vec2(1.4,1.0)));
        float edge=smoothstep(0.0,0.14,min(min(vUv.x,1.0-vUv.x),min(vUv.y,1.0-vUv.y)));
        vec3 color=mix(uPaper,uClay,smoothstep(0.3,0.75,wash)*(0.13+quiet*0.3));
        color=mix(color,uInk,smoothstep(0.45,0.8,folds)*(0.012+uRelease*0.025));
        float distance=length((vUv-uCenter)*vec2(uAspect,1.0));
        float ring=exp(-pow((distance-uRipple*0.65)*17.0,2.0))*sin(uRipple*3.14159);
        color=mix(color,uClay,ring*0.065);
        color=mix(uPaper,color,edge);
        gl_FragColor=vec4(color,1.0);
        #include <colorspace_fragment>
      }`,
  }), []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(() => {
    const state = clock.current;
    const uniforms = material.uniforms;
    uniforms.uTime.value = state.time / 1000;
    uniforms.uAspect.value = size.width / size.height;
    uniforms.uRelease.value = Math.sin(Math.PI * Math.max(0, Math.min(1, erosion(state))));
    uniforms.uRipple.value = state.phase === 'sort' && step.type === 'swap' && state.animate ? Math.min(1, state.elapsed / 2800) : 0;
    const middle = step.indices.length ? step.indices.reduce((sum, index) => sum + index, 0) / step.indices.length : (step.array.length - 1) / 2;
    anchor.set(position(middle, step.array.length), 0, 0).project(camera);
    uniforms.uCenter.value.set((anchor.x + 1) / 2, (anchor.y + 1) / 2);
  });
  return <mesh material={material} frustumCulled={false} renderOrder={-10}><planeGeometry args={[2, 2]} /></mesh>;
}

function Stone({ item, index, step, previous, clock, maximum, labels, signed, view }: { item: Item; index: number; maximum: number; labels: Labels; signed: boolean } & Pick<Props, 'step' | 'previous' | 'clock' | 'view'>) {
  const mesh = useRef<Mesh>(null);
  const { camera, size } = useThree();
  const anchor = useMemo(() => new Vector3(), []);
  const stoneHeight = height(item, maximum);
  const uniforms = useMemo(() => ({ uErosion: { value: 0 }, uStoneHeight: { value: stoneHeight } }), [stoneHeight]);
  const geometry = useMemo(() => {
    const shape = new RoundedBoxGeometry(0.78, stoneHeight, 0.7, 4, Math.min(0.065, stoneHeight / 3));
    const vertices = shape.getAttribute('position');
    for (let i = 0; i < vertices.count; i += 1) {
      const taper = 1 - (vertices.getY(i) / stoneHeight + 0.5) * (0.035 + seed(item.id) * 0.025);
      vertices.setX(i, vertices.getX(i) * taper);
    }
    shape.computeVertexNormals();
    return shape;
  }, [stoneHeight, item.id]);
  const material = useMemo(() => {
    const clay = new MeshStandardMaterial({ color: '#91a28b', roughness: 0.93, metalness: 0 });
    clay.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vClay;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvClay = position;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
        varying vec3 vClay;
        uniform float uErosion;
        uniform float uStoneHeight;
        float clayNoise(vec3 p) { return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
      `).replace('#include <color_fragment>', `#include <color_fragment>
        float grain = clayNoise(floor(vClay * 180.0));
        float edge = (vClay.y / uStoneHeight + 0.5) * 0.82 + clayNoise(floor(vClay * 18.0)) * 0.18;
        if (uErosion > 0.0 && edge > 1.0 - uErosion) discard;
        diffuseColor.rgb *= 0.97 + grain * 0.045;
      `);
    };
    clay.customProgramCacheKey = () => 'bubble-clay-v2';
    return clay;
  }, [uniforms]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  const base = useMemo(() => new Color('#91a28b').offsetHSL(0, 0, (seed(item.id + 6) - 0.5) * 0.08), [item.id]);
  const warm = useMemo(() => new Color('#ba9469'), []);
  const swap = useMemo(() => new Color('#a79aab'), []);
  const settled = useMemo(() => new Color('#74886d'), []);
  useFrame(() => {
    if (!mesh.current) return;
    const state = clock.current;
    const from = previous.array.findIndex((entry) => entry.id === item.id);
    const moving = step.type === 'swap' && state.animate && from !== index;
    const progress = moving ? ease(state.elapsed / 1400) : 1;
    const oldX = position(from < 0 ? index : from, step.array.length);
    mesh.current.position.set(oldX + (position(index, step.array.length) - oldX) * progress, Math.sign(item.value || 1) * stoneHeight / 2, moving ? Math.sin(progress * Math.PI) * (from < index ? 0.7 : -0.7) : 0);
    mesh.current.rotation.z = moving ? Math.sin(progress * Math.PI) * (from < index ? -0.025 : 0.025) : 0;
    mesh.current.scale.z = view === '2d' ? 0.01 : 1;
    uniforms.uErosion.value = Math.max(0, Math.min(1, erosion(state)));
    const active = step.indices.includes(index);
    const isSettled = index >= Number(step.variables.sortedFrom ?? step.array.length);
    material.color.copy(active ? step.type === 'swap' ? swap : warm : isSettled ? settled : base);
    material.emissive.copy(material.color);
    material.emissiveIntensity = view === '2d' ? 0.4 : 0;
    // Shadows fade with the object, avoiding a solid ghost after erosion.
    mesh.current.castShadow = view === '3d' && uniforms.uErosion.value < 0.3;
    const label = labels.current.get(item.id);
    const valueLabel = label?.querySelector<HTMLElement>('.bubble-value');
    const indexLabel = label?.querySelector<HTMLElement>('.bubble-index');
    if (valueLabel && indexLabel) {
      const sign = Math.sign(item.value || 1);
      anchor.set(mesh.current.position.x, sign * (stoneHeight + 0.3), mesh.current.position.z).project(camera);
      valueLabel.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px, ${(1 - anchor.y) * size.height / 2}px) translate(-50%, -50%)`;
      valueLabel.style.opacity = String(1 - ease(uniforms.uErosion.value));
      anchor.set(position(index, step.array.length), signed ? -4.4 : -0.55, 0).project(camera);
      indexLabel.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px, ${(1 - anchor.y) * size.height / 2}px) translate(-50%, -50%)`;
    }
  });
  return <mesh ref={mesh} geometry={geometry} material={material} castShadow position={[position(index, step.array.length), Math.sign(item.value || 1) * stoneHeight / 2, 0]} />;
}

function Dust({ step, maximum, clock }: Pick<Props, 'step' | 'clock'> & { maximum: number }) {
  const points = useRef<Points>(null);
  const { size } = useThree();
  const perStone = size.width < 500 ? 36 : 72;
  const geometry = useMemo(() => {
    const count = Math.min(1200, perStone * step.array.length);
    const positions = new Float32Array(count * 3);
    const origins = new Float32Array(count * 3);
    const heights = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const index = i % step.array.length;
      const item = step.array[index];
      const y = seed(i + item.id * 17);
      origins[i * 3] = position(index, step.array.length) + (seed(i + 3) - 0.5) * 0.76;
      origins[i * 3 + 1] = y * height(item, maximum) * Math.sign(item.value || 1);
      origins[i * 3 + 2] = (seed(i + 9) - 0.5) * 0.66;
      heights[i] = y;
    }
    const cloud = new BufferGeometry();
    cloud.setAttribute('position', new BufferAttribute(positions, 3));
    cloud.setAttribute('alpha', new BufferAttribute(new Float32Array(count), 1));
    return { cloud, origins, heights, count };
  }, [step.array, maximum, perStone]);
  const material = useMemo(() => new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { color: { value: new Color('#a5987c') }, pointSize: { value: size.width < 500 ? 2.3 : 2.8 } },
    vertexShader: 'attribute float alpha; varying float vAlpha; uniform float pointSize; void main(){vAlpha=alpha; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_PointSize=pointSize;}',
    fragmentShader: 'uniform vec3 color; varying float vAlpha; void main(){float d=length(gl_PointCoord-vec2(0.5)); gl_FragColor=vec4(color,vAlpha*(1.0-smoothstep(0.18,0.5,d)));\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
  }), [size.width]);
  useEffect(() => () => { geometry.cloud.dispose(); material.dispose(); }, [geometry, material]);
  useFrame(() => {
    if (!points.current) return;
    const state = clock.current;
    const eroding = state.phase === 'erode' || state.phase === 'form';
    const swapping = state.phase === 'sort' && step.type === 'swap' && state.animate;
    points.current.visible = eroding || swapping;
    if (!points.current.visible) return;
    const progress = eroding ? erosion(state) : Math.min(1, state.elapsed / 1800);
    const vertices = geometry.cloud.getAttribute('position') as BufferAttribute;
    const alpha = geometry.cloud.getAttribute('alpha') as BufferAttribute;
    for (let i = 0; i < geometry.count; i += 1) {
      const index = i % step.array.length;
      const age = eroding ? Math.max(0, progress - (1 - geometry.heights[i])) : progress;
      const visible = eroding ? age > 0 : step.indices.includes(index) && geometry.heights[i] < 0.15;
      vertices.setXYZ(i, geometry.origins[i * 3] + age * (seed(i + 41) + 0.25) * 1.3, geometry.origins[i * 3 + 1] + Math.sin(age * 2) * 0.55, geometry.origins[i * 3 + 2] + age * (seed(i + 52) - 0.5) * 1.3);
      alpha.setX(i, visible ? eroding ? Math.max(0, 0.58 - age * 0.7) : Math.sin(progress * Math.PI) * 0.25 : 0);
    }
    vertices.needsUpdate = true;
    alpha.needsUpdate = true;
  });
  return <points ref={points} geometry={geometry.cloud} material={material} frustumCulled={false} />;
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function BubbleScene({ step, previous, clock, language, reduced, view }: Props) {
  const [lost, setLost] = useState(false);
  const labels = useRef(new Map<number, HTMLLIElement>());
  const maximum = Math.max(1, ...step.array.map((item) => Math.abs(item.value)));
  const signed = step.array.some((item) => item.value < 0);
  const slotWidth = Math.max(36, ...step.array.map((item) => String(item.value).length * 9 + 16));
  const fallback = <ArrayView step={step} language={language} />;
  if (reduced || lost) return fallback;
  return <div className="bubble-art" data-view={view}>
    <div className="bubble-art-scroll">
      <div className="bubble-art-frame" style={{ minWidth: Math.max(280, step.array.length * slotWidth) }}>
        <SceneBoundary fallback={fallback} onError={() => setLost(true)}>
          <div className="bubble-canvas" aria-hidden="true">
            <Canvas orthographic shadows dpr={[1, 1.5]} camera={{ position: [0, 5.1, 10], zoom: 60 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => {
              gl.shadowMap.type = VSMShadowMap;
              gl.setClearColor('#f0efe7');
              gl.domElement.addEventListener('webglcontextlost', (event) => { event.preventDefault(); setLost(true); }, { once: true });
            }}>
              <Camera count={step.array.length} signed={signed} view={view} />
              <Backdrop step={step} clock={clock} />
              <ambientLight intensity={1.2} color="#f5efe3" />
              <directionalLight position={[-3, 10, 4]} intensity={2.8} color="#fff6e6" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-camera-left={-Math.max(8, step.array.length * 0.65)} shadow-camera-right={Math.max(8, step.array.length * 0.65)} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-radius={8} shadow-blurSamples={16} />
              <directionalLight position={[4, 3, -3]} intensity={0.8} color="#b9c9b5" />
              <mesh visible={view === '3d'} rotation={[-Math.PI / 2, 0, 0]} position={[0, signed ? -3.3 : -0.015, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} /><shadowMaterial color="#41503e" opacity={0.14} />
              </mesh>
              {step.array.map((item, index) => <Stone key={item.id} item={item} index={index} maximum={maximum} step={step} previous={previous} clock={clock} labels={labels} signed={signed} view={view} />)}
              <Dust step={step} maximum={maximum} clock={clock} />
            </Canvas>
          </div>
        </SceneBoundary>
        <ol className="bubble-values" aria-label={language === 'ko' ? '현재 배열' : 'Current array'}>
          {step.array.map((item, index) => <li key={item.id} ref={(node) => { if (node) labels.current.set(item.id, node); else labels.current.delete(item.id); }} aria-label={language === 'ko' ? `인덱스 ${index}, 값 ${item.value}` : `Index ${index}, value ${item.value}`}><span className="bubble-value">{item.value}</span><small className="bubble-index">[{index}]</small></li>)}
        </ol>
        {!step.array.length && <p className="bubble-empty">{language === 'ko' ? '빈 배열 · 잠깐 쉬어갑니다.' : 'An empty array. A moment of rest.'}</p>}
      </div>
    </div>
  </div>;
}
