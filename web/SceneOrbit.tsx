import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Spherical, TOUCH, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type Point = readonly [number, number, number];

function restoreView(controls: OrbitControls, home: Point) {
  // Finish pending drag damping before returning to the exact home angle.
  controls.enableDamping = false;
  controls.update();
  controls.object.position.set(...home);
  controls.update();
  controls.enableDamping = true;
}

export default function SceneOrbit({ home, target, reset, label, enabled = true, minPolar = .3, maxPolar = 1.35, maxAzimuth = Infinity, scrollable = false }: {
  home: Point; target: Point; reset: number; label: string; enabled?: boolean; minPolar?: number; maxPolar?: number; maxAzimuth?: number; scrollable?: boolean;
}) {
  const { camera, gl, invalidate } = useThree();
  const orbit = useRef<OrbitControls | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const controls = new OrbitControls(camera, gl.domElement);
    orbit.current = controls;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    if (scrollable) {
      controls.touches.ONE = TOUCH.PAN;
      gl.domElement.style.touchAction = 'pan-x pan-y';
    }
    controls.minPolarAngle = minPolar;
    controls.maxPolarAngle = maxPolar;
    controls.minAzimuthAngle = -maxAzimuth;
    controls.maxAzimuthAngle = maxAzimuth;
    controls.target.set(...target);
    camera.position.set(...home);
    controls.update();
    const changed = () => invalidate();
    const keydown = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') restoreView(controls, home);
      else {
        const spherical = new Spherical().setFromVector3(camera.position.clone().sub(controls.target));
        spherical.theta = Math.max(-maxAzimuth, Math.min(maxAzimuth, spherical.theta + (event.key === 'ArrowLeft' ? -.12 : event.key === 'ArrowRight' ? .12 : 0)));
        spherical.phi = Math.max(minPolar, Math.min(maxPolar, spherical.phi + (event.key === 'ArrowUp' ? -.1 : event.key === 'ArrowDown' ? .1 : 0)));
        camera.position.copy(new Vector3().setFromSpherical(spherical).add(controls.target));
        controls.update();
      }
      invalidate();
    };
    gl.domElement.tabIndex = 0;
    gl.domElement.setAttribute('aria-label', label);
    controls.addEventListener('change', changed);
    gl.domElement.addEventListener('keydown', keydown);
    return () => {
      controls.removeEventListener('change', changed);
      gl.domElement.removeEventListener('keydown', keydown);
      gl.domElement.removeAttribute('tabindex');
      gl.domElement.removeAttribute('aria-label');
      controls.dispose();
      orbit.current = null;
    };
  }, [camera, gl, invalidate, enabled, home, target, minPolar, maxPolar, maxAzimuth, label, scrollable]);
  useEffect(() => {
    if (!enabled) return;
    // Reset orientation only; the separate zoom controls keep their current value.
    if (orbit.current) restoreView(orbit.current, home);
    invalidate();
  }, [camera, home, reset, invalidate, enabled]);
  useFrame(() => orbit.current?.update(), -2);
  return null;
}
