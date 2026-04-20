import { useEffect, useRef } from "react";

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
  immediate?: boolean;
}

export function usePolling(
  callback: () => void,
  { interval = 5000, enabled = true, immediate = true }: UsePollingOptions = {},
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    if (immediate) {
      callbackRef.current();
    }

    const id = setInterval(() => {
      callbackRef.current();
    }, interval);

    return () => clearInterval(id);
  }, [enabled, interval, immediate]);
}
