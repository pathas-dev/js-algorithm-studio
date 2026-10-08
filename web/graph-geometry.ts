import { CubicBezierCurve3, QuadraticBezierCurve3, Vector3 } from 'three';
import type { GraphConnection } from './graph-scene';

export function wormholeFrame(progress: number, reverse: boolean) {
  const time = Math.max(0, Math.min(1, progress));
  const travel = Math.max(0, Math.min(1, (time - .12) / .72));
  return {
    position: reverse ? 1 - travel : travel,
    energy: Math.sin(time * Math.PI),
    departure: Math.sin(Math.min(1, time / .4) * Math.PI),
    arrival: Math.sin(Math.max(0, (time - .65) / .35) * Math.PI),
  };
}

// Both directions get their own lane; trim connections to the actual sphere surface.
export function graphCurve(edge: GraphConnection) {
  const from = new Vector3(...edge.from.position), to = new Vector3(...edge.to.position);
  if (edge.from.id === edge.to.id) return new CubicBezierCurve3(
    from.clone().add(new Vector3(-.3, .12, -.24)), from.clone().add(new Vector3(-1.1, .6, -.7)),
    from.clone().add(new Vector3(1.1, .6, -.7)), from.clone().add(new Vector3(.3, .12, -.24)));
  const direction = to.clone().sub(from).normalize();
  const center = from.clone().add(to).multiplyScalar(.5);
  if (edge.reciprocal) center.add(new Vector3(-direction.z, 0, direction.x).multiplyScalar(.55));
  center.y += edge.reciprocal ? .35 : .16;
  const start = from.clone().add(center.clone().sub(from).normalize().multiplyScalar(.4));
  const end = to.clone().sub(to.clone().sub(center).normalize().multiplyScalar(.45));
  return new QuadraticBezierCurve3(start, center, end);
}
