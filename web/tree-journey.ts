import type { Language, Step } from './algorithms';
import { treeModel, treePosition, type TreeUnit } from './tree-scene';

type Model = ReturnType<typeof treeModel>;

export function treeRoute(model: Model, value: number) {
  const path: TreeUnit[] = [];
  let unit = model.units.find((entry) => entry.depth === 0);
  while (unit) {
    path.push(unit);
    if (value === unit.value) break;
    unit = model.units.find((entry) => entry.id === (value < unit!.value ? unit!.left : unit!.right));
  }
  return path;
}

export function treeSector(model: Model, id: number): number[] {
  const unit = model.units.find((entry) => entry.id === id);
  return unit ? [id, ...treeSector(model, unit.left), ...treeSector(model, unit.right)] : [];
}

export function treeJourney(step: Step, previous: Step) {
  const model = treeModel(step);
  const before = treeModel(previous);
  const operation = String(step.variables.operation ?? '');
  const target = typeof step.variables.value === 'number' ? step.variables.value : undefined;
  const oldActive = before.units.find((unit) => unit.active);
  const inspecting = ['inspect-insert', 'inspect-find'].includes(step.type);
  const travelling = inspecting || ['insert', 'insert-done', 'find'].includes(step.type);
  const active = model.units.find((unit) => unit.active)
    ?? (step.type === 'find' && step.variables.result === 'null' ? model.units.find((unit) => unit.id === oldActive?.id) : undefined);
  const route = target === undefined ? [] : treeRoute(model, target);
  const reached = active ? route.findIndex((unit) => unit.id === active.id) : -1;
  const path = travelling && reached >= 0 ? route.slice(0, reached + 1) : [];
  const side = active && target !== undefined && target !== active.value ? target < active.value ? 'left' : 'right' : undefined;
  const candidates = inspecting && active ? target === active.value ? [active.id] : treeSector(model, active[side!]) : [];
  const excluded = inspecting ? model.units.filter((unit) => !candidates.includes(unit.id) && !path.some((gate) => gate.id === unit.id)).map((unit) => unit.id) : [];
  const vacancy: [number, number, number] | undefined = target !== undefined && travelling && (!active || side && active[side] < 0)
    ? active ? [active.position[0] + (side === 'left' ? -1.2 : 1.2), active.position[1] - 1.3, 0] : [0, 0, 0] : undefined;
  const copied = model.units.find((unit) => before.units.some((old) => old.id === unit.id && old.value !== unit.value));
  const rotation = step.type === 'rotation' ? (() => {
    const same = model.units.filter((unit) => before.units.some((old) => old.id === unit.id && old.value === unit.value));
    const improved = same.filter((unit) => before.units.find((old) => old.id === unit.id)!.depth > unit.depth);
    const destination = improved.find((unit) => unit.value === target) ?? improved.sort((a, b) =>
      before.units.find((old) => old.id === b.id)!.depth - before.units.find((old) => old.id === a.id)!.depth)[0];
    return destination ? { value: destination.value, before: treeRoute(before, destination.value), after: treeRoute(model, destination.value),
      inorder: [...model.units].sort((a, b) => a.value - b.value).map((unit) => unit.value) } : undefined;
  })() : undefined;
  const connected = active && oldActive && previous.variables.operation === operation && previous.variables.value === target
    && (oldActive.id === active.id || before.arms.some((arm) => arm.parent === oldActive.id && arm.child === active.id)
      || model.arms.some((arm) => arm.parent === oldActive.id && arm.child === active.id));
  const from: [number, number, number] = connected ? [...oldActive.position] : active ? [active.position[0], active.position[1] + 1.2, 0] : [0, 1.2, 0];
  const to: [number, number, number] = step.type === 'find' && step.variables.result === 'null' && vacancy ? vacancy : active ? [...active.position] : [0, 0, 0];
  return { operation, target, inspecting, travelling, active, path, side, candidates, excluded, copied,
    copiedFrom: copied ? before.units.find((old) => old.id === copied.id)?.value : undefined, vacancy, rotation, from, to };
}

export function treeProbePosition(journey: ReturnType<typeof treeJourney>, time: number): [number, number, number] {
  if (journey.rotation) {
    const { before, after } = journey.rotation;
    if (time > .22 && time < .78) {
      const position = treePosition(after.at(-1), before.at(-1), time);
      return [position[0], position[1], position[2] + .9];
    }
    const path = time <= .22 ? before : after;
    const progress = Math.max(0, Math.min(1, time <= .22 ? time / .22 : (time - .78) / .22)) * (path.length - 1);
    const from = path[Math.floor(progress)].position;
    const to = path[Math.min(path.length - 1, Math.floor(progress) + 1)].position;
    return from.map((value, axis) => value + (to[axis] - value) * (progress % 1) + (axis === 2 ? .9 : 0)) as [number, number, number];
  }
  const t = Math.max(0, Math.min(1, time / .65));
  const eased = t * t * (3 - 2 * t);
  return journey.from.map((value, axis) => value + (journey.to[axis] - value) * eased + (axis === 2 ? .9 : 0)) as [number, number, number];
}

export function treeJourneyBounds(journey: ReturnType<typeof treeJourney>, model: Model, before: Model) {
  const compact = Math.max(model.units.length, before.units.length) <= 3;
  const points = [...model.units, ...before.units].map((unit) => unit.position);
  if (journey.vacancy) points.push(journey.vacancy);
  if (journey.travelling) points.push(journey.from, journey.to);
  // Frame the probe's side lane, its destination label and empty arrival as well as real nodes.
  return { compact, width: Math.max(compact ? 6.7 : Math.max(model.width, before.width), 2 * Math.max(0, ...points.map((point) => Math.abs(point[0]))) + 2.7),
    height: Math.max(model.height, before.height, 2 * (Math.max(0, ...points.map((point) => Math.abs(point[1]))) + 1)) };
}

export function treeJourneyText(step: Step, journey: ReturnType<typeof treeJourney>, language: Language) {
  const ko = language === 'ko';
  const { target, active, side, inspecting, rotation, copied } = journey;
  if (rotation) return ko
    ? `같은 목적지 ${rotation.value} · ROOT부터 ${rotation.before.length}개 → ${rotation.after.length}개 관문. 좌표 순서는 그대로, 진입 항로를 재편합니다.`
    : `Same destination ${rotation.value} · ${rotation.before.length} → ${rotation.after.length} gates from ROOT. Reassign the entry while preserving coordinate order.`;
  if (copied) {
    return ko ? `관문 N${copied.id}의 좌표를 ${journey.copiedFrom} → ${copied.value}로 갱신합니다. 이어받을 좌표를 옮겨 적고 그 좌표의 원래 관문을 철수합니다.`
      : `Update gate N${copied.id}'s coordinate ${journey.copiedFrom} → ${copied.value}. Copy the replacement coordinate and withdraw its original gate.`;
  }
  if (step.type === 'balance' || step.type === 'rotation-start' || step.type === 'remove-balance') {
    const model = treeModel(step);
    const levels = (id: number) => { const child = model.units.find((unit) => unit.id === id); return child ? (child.height ?? 0) + 1 : 0; };
    return active ? ko
      ? `관문 ${active.value}에서 L ${levels(active.left)}층 · R ${levels(active.right)}층. ${Math.abs(active.balance ?? 0) > 1 ? '차이가 1층을 넘어 진입 관문을 재배치합니다.' : '깊이 차이가 1층 이내인지 확인합니다.'}`
      : `Gate ${active.value}: L ${levels(active.left)} levels · R ${levels(active.right)} levels. ${Math.abs(active.balance ?? 0) > 1 ? 'The gap exceeds one level; reassign this entry.' : 'Check that the depth gap stays within one level.'}`
      : ko ? '삭제 후 항로 깊이를 다시 검사합니다.' : 'Audit route depth after removal.';
  }
  if (inspecting && active && target !== undefined) return target === active.value ? ko
    ? `${target} = ${active.value} · 목적지 도착.${journey.operation === 'insert' ? ' 기존 관문을 사용하며 중복 설치하지 않습니다.' : ''}`
    : `${target} = ${active.value} · Destination reached.${journey.operation === 'insert' ? ' Reuse the existing gate; do not install a duplicate.' : ''}`
    : ko ? `${target} ${side === 'left' ? '<' : '>'} ${active.value} · ${side === 'left' ? '작은' : '큰'} 좌표의 ${side === 'left' ? 'L' : 'R'} 항로를 엽니다.${journey.candidates.length ? ' 다른 구역은 탐색에서 제외합니다.' : ' 이 방향은 아직 빈 항로입니다.'}`
      : `${target} ${side === 'left' ? '<' : '>'} ${active.value} · Open ${side === 'left' ? 'L for smaller' : 'R for larger'} coordinates.${journey.candidates.length ? ' Exclude other sectors from the search.' : ' This branch is empty.'}`;
  if (inspecting && !active) return ko ? journey.operation === 'insert' ? `빈 항로에 도착했습니다. 좌표 ${target}의 첫 관문을 설치합니다.` : `빈 항로입니다. 목적지 ${target}는 등록되어 있지 않습니다.`
    : journey.operation === 'insert' ? `Arrive at an empty route. Install the first gate at coordinate ${target}.` : `Empty route. Destination ${target} is not registered.`;
  if (step.type === 'find') return step.variables.result === 'null' ? ko ? `목적지 ${target} 없음 · 빈 항로에서 탐색을 마칩니다.` : `Destination ${target} absent · stop at the empty branch.`
    : ko ? `목적지 ${target} 도착 · 이 경로에서 값을 찾았습니다.` : `Destination ${target} reached · found along this route.`;
  if (step.type === 'insert') return ko ? `목적지 ${target}의 빈 도착 지점에 새 관문을 설치합니다.` : `Install a new gate at destination ${target}'s empty arrival point.`;
  if (step.type === 'insert-done') return ko ? `좌표 ${target} 등록 완료 · 다음 탐사도 같은 분기 규칙을 따릅니다.` : `Coordinate ${target} registered · future probes follow the same branch rule.`;
  if (step.type === 'remove') return ko ? `좌표 ${target} 제거 · 남은 목적지의 실제 항로를 이어 줍니다.` : `Remove coordinate ${target} · reconnect the remaining destinations' actual routes.`;
  return ko ? '탐사선은 목적지 좌표를 싣고 출발합니다. 관문보다 작으면 L, 크면 R. 한 번의 비교로 한 구역을 제외합니다.'
    : 'A probe carries its destination coordinate. Smaller than a gate: L. Larger: R. Each comparison excludes a sector.';
}
