import type { Item, Step } from './algorithms';

export type GraphPlanet = Item & { x: number; y: number; position: [number, number, number]; color: string; current: boolean; via: boolean; dimmed: boolean };
export type GraphConnection = { from: GraphPlanet; to: GraphPlanet; weight?: number; active: boolean; selected: boolean; reciprocal: boolean; directed: boolean; reverse: boolean };

export function graphModel(step: Step, seen: string[], processed: string[], chosen: number[][], matrix: boolean) {
  const nodes: GraphPlanet[] = step.array.map((item, index) => {
    const angle = index / step.array.length * Math.PI * 2 - Math.PI / 2;
    const current = step.variables.structure === 'disjoint-set' ? step.indices.includes(index) : step.variables.current === item.value;
    const discovered = seen.includes(String(item.value));
    return { ...item, x: 220 + Math.cos(angle) * 150, y: 155 + Math.sin(angle) * 116,
      position: step.array.length === 1 ? [0, .35, 0] : [Math.cos(angle) * 3, .35 + Math.sin(index * 2.4) * .26, Math.sin(angle) * 2.3],
      color: current ? '#d6b476' : processed.includes(String(item.value)) ? '#8faf9d' : discovered ? '#8dacc0' : ['#82968c', '#b7a07e', '#8c8196'][item.id % 3],
      current, via: step.variables.via === item.value, dimmed: !discovered && step.type === 'done' };
  });
  const edges: GraphConnection[] = (step.edges ?? []).flatMap(([a, b, weight]) => {
    const from = nodes.find((node) => node.value === a), to = nodes.find((node) => node.value === b);
    if (!from || !to) return [];
    const directed = Boolean(step.variables.directed);
    const active = matrix
      ? (step.variables.current === a && step.variables.via === b) || (step.variables.via === a && step.variables.next === b) || (!directed && ((step.variables.current === b && step.variables.via === a) || (step.variables.via === b && step.variables.next === a)))
      : (step.variables.current === a && step.variables.next === b) || (!directed && step.variables.current === b && step.variables.next === a);
    const selected = chosen.some(([c, d]) => (c === a && d === b) || (!directed && c === b && d === a));
    const reverse = !directed && (matrix ? (step.variables.current === b && step.variables.via === a) || (step.variables.via === b && step.variables.next === a) : step.variables.current === b);
    return [{ from, to, weight, active, selected, directed, reverse, reciprocal: directed && a !== b && Boolean(step.edges?.some(([c, d]) => c === b && d === a)) }];
  });
  return { nodes, edges };
}
