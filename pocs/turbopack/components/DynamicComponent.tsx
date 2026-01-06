"use client";

import { useState, useEffect } from "react";

const DynamicComponent = () => {
  const [count, setCount] = useState<number>(0);
  const [rebuildTime, setRebuildTime] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
      const start = performance.now();

      // Simulate a rebuild
      setRebuildTime(performance.now() - start);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Dynamic Component</h2>
      <p>Count: {count}</p>
      {rebuildTime !== null && (
        <p>Last Rebuild Time: {rebuildTime.toFixed(2)} ms</p>
      )}
    </div>
  );
};

export default DynamicComponent;
