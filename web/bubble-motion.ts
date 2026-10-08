// A damped response with a small overshoot; tied to playback, so pausing freezes it.
export function springProgress(value: number) {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return 1 - Math.exp(-6 * value) * (Math.cos(8 * value) + 0.75 * Math.sin(8 * value));
}

// Stable 3D positions: more work adds equal stars without resizing existing ones.
export function workStar(index: number): [number, number, number] {
  if (index === 0) return [0, 0, 0];
  const radius = Math.cbrt(index) * 0.14;
  const angle = index * 2.399963229728653;
  return [Math.cos(angle) * radius, Math.sin(index * Math.SQRT2) * radius * 0.45, Math.sin(angle) * radius];
}

// Visual minimum keeps zero and small magnitudes visible; signed labels carry the exact value.
export const planetRadius = (value: number, maximum: number) => Math.max(0.13, Math.abs(value) / maximum * 0.53);

// Reserve the largest possible ring envelope in every fixed slot, even after reordering.
export const planetSpacing = (values: number[], maximum: number) => Math.max(1.12, ...values.map((value) => planetRadius(value, maximum) * 3.4 + 0.28));

// Opposing semicircles keep the pair a slot apart at constant angular/path speed.
export function orbitalSwap(from: number, to: number, time: number): [number, number] {
  const angle = Math.max(0, Math.min(1, time)) * Math.PI;
  return [from + (to - from) * (1 - Math.cos(angle)) / 2, (to - from) * Math.sin(angle) / 2];
}

// Distant transfers clear intermediate slots before travelling across the row.
export function planetTransfer(from: number, to: number, time: number, spacing: number): [number, number] {
  const distance = Math.abs(to - from);
  if (distance <= spacing * 1.01) return orbitalSwap(from, to, time);
  const clearance = spacing * 1.05;
  const traveled = Math.max(0, Math.min(1, time)) * (distance + clearance * 2);
  const direction = Math.sign(to - from);
  if (traveled < clearance) return [from, direction * traveled];
  if (traveled < clearance + distance) return [from + direction * (traveled - clearance), direction * clearance];
  return [to, direction * (distance + clearance * 2 - traveled)];
}

// Small/medium/large planets turn in 8/10/12 seconds; IDs keep a stable phase.
export function axialAngle(timeMs: number, id: number, radius = 0.33) {
  const period = 8 + Math.max(0, Math.min(1, (radius - 0.13) / 0.4)) * 4;
  return Math.max(0, timeMs) / 1000 * Math.PI * 2 / period + id * 0.8;
}
