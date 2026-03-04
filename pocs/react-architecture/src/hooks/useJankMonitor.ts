import { useEffect } from "react";

export function useJankMonitor(name: string) {
  useEffect(() => {
    let lastTime = performance.now();
    const frame = () => {
      const now = performance.now();
      if (now - lastTime > 30) {
        console.warn(
          `[${name}] JANK DETECTED: ${Math.round(now - lastTime)}ms`,
        );
      }
      lastTime = now;
      requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [name]);
}
