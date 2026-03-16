/**
 * Performance measurement utilities.
 * These wrap the Web Performance API to give us precise timing data
 * that also shows up in Chrome DevTools Performance tab as User Timings.
 */

export interface FetchMetric {
  id: string;
  strategy: "swr" | "manual";
  startTime: number;
  endTime: number;
  duration: number;
  renderCount: number;
  cacheHit: boolean;
  error?: string;
}

const metricsLog: FetchMetric[] = [];

/**
 * Marks a custom event in the browser's Performance Timeline.
 * These appear as orange markers in Chrome DevTools > Performance tab.
 */
export function perfMark(name: string) {
  if (typeof performance !== "undefined") {
    performance.mark(name);
  }
}

/**
 * Creates a User Timing measure between two marks.
 * Visible in DevTools Performance tab under "Timings" row.
 */
export function perfMeasure(name: string, startMark: string, endMark?: string) {
  if (typeof performance !== "undefined") {
    try {
      performance.measure(name, startMark, endMark);
    } catch {
      // marks may not exist yet
    }
  }
}

export function recordMetric(metric: FetchMetric) {
  metricsLog.push(metric);
  // Also log to console with timing — visible in DevTools Console
  console.log(
    `%c[PERF] ${metric.strategy.toUpperCase()} %c${metric.duration}ms %c${
      metric.cacheHit ? "CACHE HIT" : "NETWORK"
    }`,
    "color: #a855f7; font-weight: bold",
    `color: ${metric.duration < 200 ? "#00ff88" : metric.duration < 500 ? "#ffd700" : "#ff4060"}; font-weight: bold`,
    `color: ${metric.cacheHit ? "#4080ff" : "#6b6b8a"}`
  );
}

export function getMetrics(): FetchMetric[] {
  return [...metricsLog];
}

export function clearMetrics() {
  metricsLog.length = 0;
  if (typeof performance !== "undefined") {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * Measures how long a component render takes using Performance API.
 * Call at the top of a component to track render frequency and cost.
 */
export function useRenderTracker(componentName: string): () => void {
  const markName = `${componentName}-render-${Date.now()}`;
  perfMark(markName);
  return () => {
    const endMark = `${markName}-end`;
    perfMark(endMark);
    perfMeasure(`${componentName} render`, markName, endMark);
  };
}
