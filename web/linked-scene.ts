import type { Step } from './algorithms';

export type LinkedNode = { id: number; value: number; position: [number, number, number]; active: boolean; tag: string };
export type LinkedCable = { from: number; to: number; channel: 'next' | 'previous' };
export const cableKey = (edge: LinkedCable) => `${edge.channel}-${edge.from}-${edge.to}`;
export const linkedSceneSupported = (step: Step) => ['linked-list', 'doubly-linked-list'].includes(String(step.variables.structure))
  && !['list-forward', 'list-reverse'].includes(String(step.variables.mode));

export function linkedModel(step: Step) {
  const nodes: LinkedNode[] = step.array.map((item, index) => ({
    ...item, position: [(index - (step.array.length - 1) / 2) * 2.35, 0, 0],
    active: step.indices.includes(index),
    tag: [step.variables.head === item.id ? 'HEAD' : '', step.variables.tail === item.id ? 'TAIL' : ''].filter(Boolean).join(' / '),
  }));
  const cables: LinkedCable[] = [];
  for (const [field, channel] of [['links', 'next'], ['previousLinks', 'previous']] as const) {
    const links: number[][] = JSON.parse(String(step.variables[field] ?? '[]'));
    for (const [from, to] of links) cables.push({ from, to, channel });
  }
  return { nodes, cables };
}

export function linkedMotion(step: Step, previous: Step) {
  return linkedSceneSupported(step) && (step.variables.links !== previous.variables.links
    || step.variables.previousLinks !== previous.variables.previousLinks
    || step.array.some((item, index) => previous.array[index]?.id !== item.id)
    || step.array.length !== previous.array.length);
}

export function linkedPosition(node: LinkedNode | undefined, previous: LinkedNode | undefined, time: number): [number, number, number] {
  const from: [number, number, number] = previous?.position ?? [node!.position[0], 1.6, 0];
  const to: [number, number, number] = node?.position ?? [previous!.position[0], 1.6, 0];
  if (time <= 0) return from;
  if (time >= 1) return to;
  return [from[0] + (to[0] - from[0]) * time, from[1] + (to[1] - from[1]) * time,
    from[0] === to[0] ? 0 : Math.sign(to[0] - from[0]) * Math.sin(Math.PI * time) * .65];
}

// Detach the old target before attaching the new one; never imply two committed pointers.
export function cableProgress(current: boolean, retained: boolean, time: number) {
  return retained ? 1 : current ? Math.max(0, (time - .45) / .55) : Math.max(0, 1 - time / .45);
}

export function linkedCablePoints(edge: LinkedCable, source: [number, number, number], destination?: [number, number, number]): [number, number, number][] {
  const next = edge.channel === 'next';
  const port = next ? .34 : -.34;
  const z = next ? .38 : -.38;
  const start: [number, number, number] = [source[0] + port, source[1] - .24, source[2] + z];
  const end: [number, number, number] = destination ? [destination[0] - port, destination[1] - .24, destination[2] + z]
    : [source[0] + port, source[1] - (next ? .92 : 1.65), source[2] + z];
  if (!destination) return [start, [start[0], start[1] + (end[1] - start[1]) / 3, start[2]],
    [end[0], start[1] + (end[1] - start[1]) * 2 / 3, end[2]], end];
  const lane = Math.min(start[1], end[1]) - (next ? .65 : 1.32);
  return [start, [start[0], lane, start[2]], [end[0], lane, end[2]], end];
}
