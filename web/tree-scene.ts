import type { Language, Step } from './algorithms';

export type TreeNode = { id: number; value: number; depth: number; left: number; right: number; balance?: number; height?: number };
export type TreeUnit = TreeNode & { position: [number, number, number]; active: boolean };
export type TreeArm = { id: string; parent: number; child: number; side: 'left' | 'right' };
export const treeSceneSupported = (step: Step) => ['binary-search-tree', 'avl-tree'].includes(String(step.variables.structure));

export function treeModel(step: Step, capacity = step.array.length) {
  const nodes: TreeNode[] = JSON.parse(String(step.variables.tree));
  const ordered = [...nodes].sort((a, b) => a.value - b.value);
  const depth = Math.max(0, ...nodes.map((node) => node.depth));
  const units: TreeUnit[] = nodes.map((node, index) => ({ ...node, active: step.indices.includes(index),
    position: [(ordered.findIndex((item) => item.id === node.id) - (nodes.length - 1) / 2) * 2.1, (depth / 2 - node.depth) * 2.2, 0] }));
  const arms: TreeArm[] = nodes.flatMap((node) => (['left', 'right'] as const).flatMap((side) =>
    units.some((unit) => unit.id === node[side]) ? [{ id: `${node.id}-${side}-${node[side]}`, parent: node.id, child: node[side], side }] : []));
  return { units, arms, width: Math.max(7, capacity * 2.1 + 1.5), height: Math.max(5, depth * 2.2 + 2.5) };
}

export function treeMotion(step: Step, previous: Step) {
  return treeSceneSupported(step) && (step.variables.tree !== previous.variables.tree
    || step.type !== 'done' && (step.variables.value !== previous.variables.value || step.indices.join() !== previous.indices.join()));
}

// Detach changed arms before moving nodes, then grow only the recorded replacements.
export function treeArmProgress(current: boolean, previous: boolean, time: number) {
  if (current && previous) return 1;
  if (time >= 1) return current ? 1 : 0;
  return current ? Math.max(0, Math.min(1, (time - .78) / .22)) : Math.max(0, Math.min(1, 1 - time / .22));
}

export function treePosition(unit: TreeUnit | undefined, previous: TreeUnit | undefined, time: number): [number, number, number] {
  const from: [number, number, number] = previous?.position ?? [unit!.position[0], unit!.position[1], 2];
  const to: [number, number, number] = unit?.position ?? [previous!.position[0], previous!.position[1], 2];
  const progress = Math.max(0, Math.min(1, (time - .22) / .56));
  if (progress <= 0) return from;
  if (progress >= 1) return to;
  const eased = progress * progress * (3 - 2 * progress);
  return from.map((value, index) => value + (to[index] - value) * eased + (index === 2 && from[1] !== to[1] ? Math.sin(Math.PI * progress) * .5 : 0)) as [number, number, number];
}

export function treeLabel(unit: TreeUnit, previous = false, language: Language = 'en') {
  const root = previous ? language === 'ko' ? '이전 ROOT' : 'PREVIOUS ROOT' : 'ROOT';
  return `${unit.depth === 0 ? `${root} · ` : ''}N${unit.id}\n${unit.value}${unit.balance !== undefined ? `\nb=${unit.balance} · h=${unit.height}` : ''}`;
}

export function treeTransferText(moving: boolean, avl: boolean, language: Language) {
  const fields = language === 'ko' ? `ROOT·값${avl ? '·b/h' : ''}` : `ROOT/value${avl ? '/b/h' : ''}`;
  return moving ? language === 'ko'
    ? `연결 변경 중 · 기존 ${fields}는 이전 스냅샷 · 새 노드는 현재 값으로 진입`
    : `Transfer in progress · existing ${fields} show the prior snapshot · new nodes enter with current values`
    : language === 'ko' ? `현재 스냅샷 · ${fields}와 연결은 선택한 단계의 상태`
      : `Current snapshot · ${fields} and connections match the selected step`;
}
