import { useLayoutEffect, useRef } from "react";

export function useRenderMetrics(name: string) {
  const startTime = useRef(0);

  startTime.current = performance.now();

  useLayoutEffect(() => {
    const duration = performance.now() - startTime.current;
    if (duration > 5) {
      console.log(
        `%c[${name}] Reconciliation time: ${duration.toFixed(2)}ms`,
        "background: #333; color: yellow",
      );
    }
  });
}
