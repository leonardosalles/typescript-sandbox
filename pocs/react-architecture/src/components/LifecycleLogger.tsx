import { useEffect, useLayoutEffect, useRef } from "react";

export default function LifecycleLogger({ label }: { label: string | number }) {
  const renderCount = useRef(0);
  renderCount.current++;

  console.log(
    `%c[${label}] 1. Render Phase - Body function executed`,
    "color: #61dafb",
  );

  useLayoutEffect(() => {
    console.log(
      `%c[${label}] 2. Commit Phase - useLayoutEffect executed`,
      "color: #ff4757; font-weight: bold",
    );

    // Force screen to block
    const start = performance.now();
    while (performance.now() - start < 100) {}
  });

  useEffect(() => {
    console.log(
      `%c[${label}] 3. Passive Phase - useEffect executed`,
      "color: #2ed573",
    );
  }, []);

  return null;
}
