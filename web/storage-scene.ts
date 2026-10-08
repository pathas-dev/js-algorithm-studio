import type { Step } from './algorithms';

export type StorageUnit = { id: string; value: string; tag: string; priority?: number; position: [number, number, number]; active: boolean; slot: number };
export const storageSceneSupported = (step: Step) => ['heap', 'max-heap', 'priority-queue', 'hash-table'].includes(String(step.variables.structure));

export function storageModel(step: Step, capacity = step.array.length) {
  const hash = step.variables.structure === 'hash-table';
  const units: StorageUnit[] = [];
  const slots: [number, number, number][] = [];
  const links: [number, number][] = [];
  let width = 7;
  let height = 5;
  if (hash) {
    const buckets: { key: string; value: string }[][] = JSON.parse(String(step.variables.hashTable));
    width = Math.max(7, 2 + Math.max(1, ...buckets.map((bucket) => bucket.length)) * 3.3);
    height = buckets.length * 1.65 + 1.4;
    buckets.forEach((bucket, address) => {
      slots.push([-width / 2 + .7, (buckets.length - 1) * .825 - address * 1.65, 0]);
      bucket.forEach((entry, index) => units.push({ id: entry.key, value: entry.value, tag: entry.key,
        position: [slots[address][0] + 2 + index * 3.3, slots[address][1], 0], slot: address,
        active: step.variables.keyHash === address && (step.variables.candidate ?? step.variables.key) === entry.key }));
    });
  } else {
    const levels = Math.max(1, Math.ceil(Math.log2(capacity + 1)));
    width = Math.max(7, 2 ** (levels - 1) * 2.2 + 1.5);
    height = Math.max(5, levels * 1.9 + 1.4);
    const priorities: Record<string, number> = JSON.parse(String(step.variables.priorities ?? '{}'));
    step.array.slice(0, Number(step.variables.heapSize)).forEach((item, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const position: [number, number, number] = [((index - (2 ** level - 1) + .5) / 2 ** level - .5) * (width - 1.5), (levels - 1) * .95 - level * 1.9, 0];
      slots.push(position);
      if (index) links.push([Math.floor((index - 1) / 2), index]);
      units.push({ id: String(item.id), value: String(item.value), tag: `[${index}]${index === 0 ? ' ROOT' : ''}`,
        priority: priorities[String(item.value)], position, slot: index, active: step.indices.includes(index) });
    });
  }
  return { hash, units, slots, links, width, height };
}

export function storageMotion(step: Step, previous: Step) {
  return storageSceneSupported(step) && (step.variables.hashTable !== previous.variables.hashTable
    || step.variables.priorities !== previous.variables.priorities || step.array.length !== previous.array.length
    || step.array.some((item, index) => item.id !== previous.array[index]?.id));
}

export function storagePosition(unit: StorageUnit | undefined, previous: StorageUnit | undefined, time: number): [number, number, number] {
  const from = previous?.position ?? [unit!.position[0], unit!.position[1], 2] as [number, number, number];
  const to = unit?.position ?? [previous!.position[0], previous!.position[1], 2] as [number, number, number];
  if (time <= 0) return from;
  if (time >= 1) return to;
  return from.map((value, index) => value + (to[index] - value) * time + (index === 2 && from[0] !== to[0] ? Math.sign(to[0] - from[0]) * Math.sin(Math.PI * time) * .65 : 0)) as [number, number, number];
}

export function storageSlotPosition(model: ReturnType<typeof storageModel>, index: number): [number, number, number] {
  const slot = model.slots[index];
  return [slot[0], slot[1] + (model.hash ? 0 : .72), .35];
}
