// A damped response with a small overshoot; tied to playback, so pausing freezes it.
export function springProgress(value: number) {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return 1 - Math.exp(-6 * value) * (Math.cos(8 * value) + 0.75 * Math.sin(8 * value));
}

// Identical blocks: volume, rather than a normalized height, represents work.
export function workBlock(index: number, count: number): [number, number, number] {
  const side = Math.ceil(Math.cbrt(count));
  return [(index % side - (side - 1) / 2) * 0.16, (Math.floor(index / (side * side)) + 0.5) * 0.16, (Math.floor(index / side) % side - (side - 1) / 2) * 0.16];
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
