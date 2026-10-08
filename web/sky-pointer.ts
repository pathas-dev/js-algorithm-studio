export type SkyPointer = { x: number; y: number; strength: number };

export function observeSkyPointer(element: HTMLElement, target: SkyPointer) {
  const reset = () => { target.strength = 0; };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || event.buttons || document.hidden) { reset(); return; }
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 1 || y < 0 || y > 1) { reset(); return; }
    target.x = x;
    target.y = y;
    target.strength = 1;
  };
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerup', move, { passive: true });
  window.addEventListener('blur', reset);
  document.documentElement.addEventListener('pointerleave', reset);
  document.addEventListener('visibilitychange', reset);
  return () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', move);
    window.removeEventListener('blur', reset);
    document.documentElement.removeEventListener('pointerleave', reset);
    document.removeEventListener('visibilitychange', reset);
  };
}
