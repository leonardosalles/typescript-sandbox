import { perfMark, perfMeasure, recordMetric } from "./perf";

let swrFetchCount = 0;

export async function swrFetcher<T>(url: string): Promise<T> {
  const fetchId = `swr-fetch-${++swrFetchCount}`;
  const startMark = `${fetchId}-start`;
  const endMark = `${fetchId}-end`;

  perfMark(startMark);
  const wallStart = performance.now();

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  perfMark(endMark);
  perfMeasure(`SWR fetch: ${url}`, startMark, endMark);

  const duration = Math.round(performance.now() - wallStart);

  recordMetric({
    id: fetchId,
    strategy: "swr",
    startTime: wallStart,
    endTime: wallStart + duration,
    duration,
    renderCount: swrFetchCount,
    cacheHit: false,
  });

  return data;
}

let manualFetchCount = 0;

export async function manualFetcher<T>(url: string): Promise<T> {
  const fetchId = `manual-fetch-${++manualFetchCount}`;
  const startMark = `${fetchId}-start`;
  const endMark = `${fetchId}-end`;

  perfMark(startMark);
  const wallStart = performance.now();

  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  perfMark(endMark);
  perfMeasure(`Manual fetch: ${url}`, startMark, endMark);

  const duration = Math.round(performance.now() - wallStart);

  recordMetric({
    id: fetchId,
    strategy: "manual",
    startTime: wallStart,
    endTime: wallStart + duration,
    duration,
    renderCount: manualFetchCount,
    cacheHit: false,
  });

  return data;
}
