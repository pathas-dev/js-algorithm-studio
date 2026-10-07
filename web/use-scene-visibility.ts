import { useEffect, useRef, useState } from 'react';

// Autonomous scene motion runs only while its actual artwork is on screen.
export function useSceneVisibility(enabled: boolean) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled || !sceneRef.current) { setVisible(false); return; }
    let intersecting = false;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); });
    observer.observe(sceneRef.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [enabled]);
  return { sceneRef, visible };
}
