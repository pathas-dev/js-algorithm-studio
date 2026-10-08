import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { lessonFragment, spaceFragment, spaceVertex } from './space-shader';

export default function SpaceSky({ active = true, variant = 'ambient' }: { active?: boolean; variant?: 'ambient' | 'lesson' }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [lost, setLost] = useState(false);
  const reduced = Boolean(useReducedMotion());
  useEffect(() => {
    if (lost || !canvas.current) return;
    const element = canvas.current;
    const gl = element.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) { setLost(true); return; }
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram()!;
    const buffer = gl.createBuffer()!;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Sky shader unavailable');
      gl.attachShader(program, shader);
    };
    let frame = 0;
    let elapsed = 0;
    let previous = 0;
    const release = () => { cancelAnimationFrame(frame); shaders.forEach((shader) => gl.deleteShader(shader)); gl.deleteBuffer(buffer); gl.deleteProgram(program); };
    try {
      compile(gl.VERTEX_SHADER, spaceVertex);
      compile(gl.FRAGMENT_SHADER, variant === 'lesson' ? lessonFragment : spaceFragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Sky shader unavailable');
    } catch { release(); setLost(true); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const time = gl.getUniformLocation(program, 'uTime');
    const aspect = gl.getUniformLocation(program, 'uAspect');
    const draw = () => {
      gl.uniform1f(time, elapsed);
      gl.uniform1f(aspect, element.width / element.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 1.5);
      element.width = Math.max(1, Math.round(element.clientWidth * ratio));
      element.height = Math.max(1, Math.round(element.clientHeight * ratio));
      gl.viewport(0, 0, element.width, element.height);
      draw();
    };
    const tick = (now: number) => {
      elapsed += previous ? Math.min((now - previous) / 1000, 0.1) : 0;
      previous = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (active && !document.hidden && !reduced) frame = requestAnimationFrame(tick);
    };
    const contextLost = (event: Event) => { event.preventDefault(); setLost(true); };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    element.addEventListener('webglcontextlost', contextLost);
    document.addEventListener('visibilitychange', visibility);
    resize();
    visibility();
    return () => { observer.disconnect(); element.removeEventListener('webglcontextlost', contextLost); document.removeEventListener('visibilitychange', visibility); release(); };
  }, [reduced, lost, active, variant]);
  return lost ? <div className="space-sky space-sky-still" data-sky={variant} aria-hidden="true" /> : <canvas ref={canvas} className="space-sky" data-sky={variant} aria-hidden="true" />;
}
