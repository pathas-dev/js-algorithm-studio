import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, Mesh, RingGeometry, ShaderMaterial, TubeGeometry } from 'three';
import { useSpaceLesson } from './SpaceLesson';
import { traceTransitionTime } from './bubble-motion';
import { wormholeFrame, type graphCurve } from './graph-geometry';

const vertex = 'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';

export default function GraphWormhole({ curve, reverse }: { curve: ReturnType<typeof graphCurve>; reverse: boolean }) {
  const scene = useSpaceLesson()!;
  const { camera } = useThree();
  const mouths = useRef<(Mesh | null)[]>([]);
  const light = useRef<Mesh>(null);
  const tunnel = useMemo(() => new TubeGeometry(curve, 64, .13, 8, false), [curve]);
  const rim = useMemo(() => new RingGeometry(.13, .3, 64), []);
  const ends = useMemo(() => [curve.getPointAt(0), curve.getPointAt(1)], [curve]);
  const flow = useMemo(() => new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uProgress: { value: 0 }, uPhase: { value: 0 }, uEnergy: { value: 0 }, uDirection: { value: 1 }, uColor: { value: new Color('#eed1a3') } },
    vertexShader: vertex,
    fragmentShader: `varying vec2 vUv; uniform float uProgress, uPhase, uEnergy, uDirection; uniform vec3 uColor;
      void main(){
        float head=exp(-pow((vUv.x-uProgress)*18.0,2.0));
        float behind=(uProgress-vUv.x)*uDirection;
        float wake=exp(-max(0.0,behind)*6.0)*step(0.0,behind)*step(behind,0.4);
        float spiral=0.35+0.65*pow(0.5+0.5*cos(vUv.y*18.8496-vUv.x*34.0+uPhase*24.0*uDirection),3.0);
        float throat=0.2*pow(0.5+0.5*cos(vUv.x*38.0-uPhase*18.0*uDirection),8.0);
        gl_FragColor=vec4(uColor*(1.0+head*0.5),(head*0.95+wake*0.45+throat)*spiral*uEnergy);
        #include <colorspace_fragment>
      }`,
  }), []);
  const portals = useMemo(() => [0, 1].map(() => new ShaderMaterial({
    transparent: true, depthWrite: false, side: DoubleSide, blending: AdditiveBlending,
    uniforms: { uPhase: { value: 0 }, uOpacity: { value: .2 }, uColor: { value: new Color('#d6b476') } },
    vertexShader: vertex,
    fragmentShader: `varying vec2 vUv; uniform float uPhase, uOpacity; uniform vec3 uColor;
      void main(){
        vec2 p=(vUv-0.5)*2.0; float r=length(p);
        float swirl=pow(0.5+0.5*cos(atan(p.y,p.x)*3.0-r*8.0-uPhase*16.0),3.0);
        float rim=smoothstep(0.42,0.6,r)*(1.0-smoothstep(0.88,1.0,r));
        gl_FragColor=vec4(uColor*(0.7+swirl*0.8),rim*(0.4+swirl*0.6)*uOpacity);
        #include <colorspace_fragment>
      }`,
  })), []);
  useEffect(() => () => tunnel.dispose(), [tunnel]);
  useEffect(() => () => { rim.dispose(); flow.dispose(); portals.forEach((material) => material.dispose()); }, [rim, flow, portals]);
  useFrame(() => {
    const state = scene.clock.current;
    const progress = traceTransitionTime(state, scene.index ?? state.index, state.animate);
    if (progress === undefined) return;
    const frame = wormholeFrame(progress, reverse);
    flow.uniforms.uProgress.value = frame.position;
    flow.uniforms.uPhase.value = progress;
    flow.uniforms.uDirection.value = reverse ? -1 : 1;
    flow.uniforms.uEnergy.value = frame.energy;
    portals.forEach((material, index) => {
      const departure = index === (reverse ? 1 : 0);
      const pulse = departure ? frame.departure : frame.arrival;
      material.uniforms.uPhase.value = progress;
      material.uniforms.uOpacity.value = .25 + pulse * .75;
      material.uniforms.uColor.value.set(departure ? '#d6b476' : '#afa0be');
      const mouth = mouths.current[index];
      if (mouth) {
        // Face the observer so orbiting never reduces the aperture to an invisible edge.
        mouth.quaternion.copy(camera.quaternion);
        mouth.scale.setScalar(.7 + pulse * .8);
      }
    });
    if (light.current) {
      curve.getPointAt(frame.position, light.current.position);
      light.current.scale.setScalar(frame.energy);
    }
  });
  return <>
    <mesh geometry={tunnel} material={flow} />
    {ends.map((end, index) => <mesh key={index} ref={(mesh) => { mouths.current[index] = mesh; }} position={end} geometry={rim} material={portals[index]} />)}
    <mesh ref={light}><sphereGeometry args={[.065, 16, 12]} /><meshBasicMaterial color="#eed1a3" transparent blending={AdditiveBlending} depthWrite={false} /></mesh>
  </>;
}
