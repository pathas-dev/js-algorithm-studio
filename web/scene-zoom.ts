export function wheelZoom(zoom: number, delta: number, mode = 0) {
  const pixels = delta * (mode === 1 ? 16 : mode === 2 ? 320 : 1);
  return Math.max(.5, Math.min(2, zoom * Math.exp(-Math.max(-160, Math.min(160, pixels)) * .002)));
}
