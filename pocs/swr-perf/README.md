# SWR vs Manual Fetch — Performance POC

> A deep proof of concept exploring data fetching strategies, caching, deduplication, and profiling in React/Next.js.

---

## Why This POC Exists

The question "should I use SWR or just `useEffect + fetch`?" is deceptively simple. The surface answer is obvious — SWR handles caching. But **how** it handles it, **why** it matters at scale, and **how to measure the difference** requires going much deeper.

This POC was built to:
1. Visually observe SWR's stale-while-revalidate cache in action
2. Measure the deduplication effect (N consumers → 1 request)
3. Learn how to profile React apps with Chrome DevTools
4. Understand render frequency and what triggers re-renders
5. Build intuition for when SWR helps vs when it doesn't

---

## Project Structure

```
app/
├── api/
│   ├── posts/route.ts         — Fast endpoint (~50-100ms)
│   ├── slow-posts/route.ts    — Slow endpoint (~800-1500ms)
│   └── metrics/route.ts       — Node.js memory metrics
├── components/
│   ├── SWRPanel.tsx            — SWR implementation with cache visualization
│   ├── ManualPanel.tsx         — useEffect + fetch (naive approach)
│   ├── MetricsDashboard.tsx    — Live comparison dashboard
│   ├── DeduplicationDemo.tsx   — Mount N consumers, count network requests
│   ├── ProfilingGuide.tsx      — Step-by-step DevTools instructions
│   └── SWRProvider.tsx         — Global SWR config
├── lib/
│   ├── perf.ts                 — Performance API utilities (User Timings)
│   └── fetcher.ts              — SWR fetcher + manual fetcher (both instrumented)
└── page.tsx
```

---

## Running the App

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Core Concepts Explored

### 1. Stale-While-Revalidate (SWR Pattern)

The HTTP `stale-while-revalidate` cache directive — and the library named after it — follow the same principle:

> Serve stale (cached) content immediately, then revalidate in the background.

```
First visit:
  Cache: MISS → fetch from network → store in cache → render

Second visit (within dedupingInterval):
  Cache: HIT → render instantly → no network request

Third visit (after dedupingInterval, tab was focused):
  Cache: STALE → render stale data immediately → background fetch → update if changed
```

**Why this matters for UX:** Users never see a loading spinner on a page they've visited before. Data feels instant. The background revalidation handles freshness silently.

SWR source reference: [`src/core/use-swr.ts`](https://github.com/vercel/swr/blob/main/src/core/use-swr.ts) — look for the `revalidate` function and how it checks `config.dedupingInterval`.

### 2. Request Deduplication

If 10 components mount simultaneously and all call `useSWR("/api/posts")`, SWR fires **exactly one network request**. All 10 components share the same in-flight promise.

```typescript
// SWR internally does something equivalent to:
const inflightRequests = new Map<string, Promise<any>>();

function fetchWithDedup(key: string, fetcher: Fetcher) {
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key)!; // reuse in-flight promise
  }
  const promise = fetcher(key).finally(() => inflightRequests.delete(key));
  inflightRequests.set(key, promise);
  return promise;
}
```

With manual `useEffect + fetch`, each component fires its own request independently. 10 components = 10 network requests, 10× the server load.

**To observe this:** Use the Deduplication Demo on the app. Mount 5 SWR consumers, watch the Network tab. Then mount 5 Manual consumers.

### 3. Manual Fetch Problems

The "naive" `useEffect + fetch` pattern has several well-known issues:

#### Race Conditions
```typescript
// BUG: if the user navigates away and back quickly,
// the second fetch might resolve before the first
useEffect(() => {
  fetch("/api/posts")
    .then(r => r.json())
    .then(data => setState(data)); // might be stale!
}, []);

// FIX: use a cleanup flag (see ManualPanel.tsx for requestIdRef pattern)
useEffect(() => {
  let cancelled = false;
  fetch("/api/posts")
    .then(r => r.json())
    .then(data => { if (!cancelled) setState(data); });
  return () => { cancelled = true; };
}, []);
```

#### Excessive Re-renders
Manual state management with `loading/data/error` means at minimum 2 re-renders per fetch: one when `loading → true`, another when data arrives. SWR batches these and often avoids the intermediate state.

#### No Focus Revalidation
SWR automatically refetches when the browser tab regains focus. With manual fetch, you have to implement this yourself using `document.addEventListener("visibilitychange", ...)`.

---

## Profiling with Chrome DevTools

### Performance Tab (Flame Charts)

The Performance tab records a CPU profile and renders it as a flame chart — a visual timeline of every JavaScript function call, React render, and browser paint.

**Step 1: Setup**
1. Open DevTools (F12) → Performance tab
2. Click the ⚙ gear → set CPU throttle to **4x slowdown** (exaggerates JS costs)
3. Make sure "Web Vitals" and "Screenshots" are checked

**Step 2: Record**
1. Click the ● record button
2. Interact: click "Refetch" on SWR panel 3×, then "Refetch" on Manual panel 3×
3. Change the consumer count in the Deduplication Demo and click Mount
4. Stop recording after 5-10 seconds

**Step 3: What to Look For**

```
Timeline rows (top to bottom):
┌─────────────────────────────────────────────────────┐
│ Timings    [SWR fetch] [Manual fetch] [swr-data-ready] ← User Timings (our marks)
│ Network    ████ /api/posts ████ /api/posts             ← HTTP requests
│ Main       ████ Parse HTML ██ JS ████ Render           ← CPU flame chart
│ Frames     [screenshot] [screenshot]                   ← Visual snapshots
└─────────────────────────────────────────────────────┘
```

- **Orange "Timings" row**: These are our custom `performance.mark()` / `performance.measure()` calls from `perf.ts`. Each "SWR fetch" and "Manual fetch" span is visible here.
- **Flame chart**: Click any yellow bar to zoom in. Yellow = JS, Purple = layout, Green = composite. Look at the **call stack depth** — SWR's render path is typically shallower on cache hits.
- **Long Tasks**: Any task >50ms gets a red warning triangle. The slow endpoint demo will reliably produce these.

**Step 4: Compare Render Counts**

With React DevTools installed:
1. Go to Components tab → ⚙ → enable **"Highlight updates when components render"**
2. Interact with the page — green/yellow/red flashes show re-renders
3. SWR panels should flash less frequently than manual panels (especially on repeated refetches)

### Network Tab — Deduplication

1. Open Network tab, filter by **Fetch/XHR**
2. Clear the log (🚫 button)
3. In the Deduplication Demo, set slider to 5, click "Mount" for SWR
4. Count requests to `/api/posts` — should be **1**
5. Clear log, click "Mount" for Manual
6. Count requests — should be **5**

### User Timings in Console

Our `perf.ts` utility adds User Timing marks to the browser's Performance Timeline. You can query them at any time:

```javascript
// In the DevTools Console:

// All timing measures recorded
performance.getEntriesByType("measure")
  .forEach(m => console.log(m.name, Math.round(m.duration) + "ms"));

// Just SWR fetches
performance.getEntriesByType("measure")
  .filter(m => m.name.startsWith("SWR fetch"))
  .map(m => ({ name: m.name, duration: Math.round(m.duration) }));

// Clear everything
performance.clearMarks();
performance.clearMeasures();
```

The console also logs styled perf events (look for `[PERF]` entries):
- 🟢 Green duration = fast (<200ms)
- 🟡 Yellow = medium (<600ms)
- 🔴 Red = slow (≥600ms)
- 🔵 Blue "CACHE HIT" = served from SWR cache

### React DevTools Profiler

1. Install [React DevTools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. Open DevTools → **Profiler** tab
3. Click ● Record, interact with the page, stop
4. Use the flame chart to see which components re-rendered and why
5. Click any component bar → the right panel shows **"Why did this render?"**

SWR components typically show "Props changed: { data }" only when data actually changes. Manual components often show additional renders for the loading state transitions.

---

## What Makes SWR Fast

### Cache Architecture

SWR uses a `Map`-based cache stored in a React context. The cache key is the first argument to `useSWR` (usually a URL string or a function returning one).

```
Cache lifecycle:
  Mount → useSWR("/api/posts")
    → check cache for key "/api/posts"
    → MISS: render with undefined data (loading state)
    → fetch → store in cache → trigger re-render with data

  Re-render (parent re-renders) → useSWR("/api/posts")
    → check cache
    → HIT: return cached data synchronously → zero network cost → one render
```

### Avoiding Waterfalls

When multiple components need the same data, manual fetch creates a waterfall:
```
Component A mounts → fetches → renders
Component B mounts → fetches → renders  (independent, sequential or parallel)
Component C mounts → fetches → renders
```

With SWR, all components with the same key share one request and render together when data arrives — no coordination code needed.

---

## Experiments to Run (Going Deeper)

These are designed to challenge your understanding. Don't skip them.

### Experiment 1: Measure Cache Speedup
1. On the Manual panel, click Refetch 10× quickly. Open Network tab.
2. Do the same on SWR. Notice the `(from memory cache)` indicators on repeated requests.
3. In Console: run `performance.getEntriesByType("measure").filter(m => m.name.startsWith("SWR"))` — compare first vs subsequent durations.

**What to look for:** After the dedupingInterval (2s), subsequent SWR fetches still check the cache. You'll see duration drop to <5ms for cache hits vs 50-150ms for network hits.

### Experiment 2: Force a Race Condition
1. Enable the "slow endpoint" on Manual panel
2. Click Refetch rapidly 5× within 1 second
3. Watch the console for `[PERF] Discarding stale response` warnings
4. Remove the `requestIdRef` race condition guard in `ManualPanel.tsx` and repeat — observe the UI flickering between states as stale responses arrive out of order

**What you learn:** Race conditions in data fetching are real and subtle. SWR handles this internally so you never see it.

### Experiment 3: Tab Focus Revalidation
1. Start polling on SWR panel (5s interval)
2. Switch to another tab for 30 seconds
3. Switch back — SWR immediately revalidates
4. Check Network tab for the request triggered by `visibilitychange`

**Source to read:** Search for `revalidateOnFocus` in [swr/src/core/use-swr.ts](https://github.com/vercel/swr/blob/main/src/core/use-swr.ts) to see how it hooks into `document.addEventListener("visibilitychange")`.

### Experiment 4: Profiling at Scale
1. Open the Deduplication Demo
2. Set Manual consumer count to 8, click Mount
3. Immediately start a Performance recording
4. Watch the Network tab fill with 8 simultaneous requests
5. Measure total time in the Performance Timings row
6. Repeat with SWR — compare total render + network time

### Experiment 5: Memory Leak Hunt
1. Keep the app running, enable the slow endpoint on Manual
2. Click Refetch every 2 seconds for a minute
3. Watch the server memory metrics in the Dashboard
4. Open DevTools → Memory tab → Take heap snapshot
5. Compare with a SWR-only workflow

---

## Key Takeaways

| Dimension | SWR | Manual useEffect |
|---|---|---|
| Network requests (N consumers) | 1 (deduped) | N |
| Cache on re-render | Yes (sync, instant) | No |
| Race condition protection | Built-in | Manual guard required |
| Re-render count | Minimal | More (loading state transitions) |
| Focus revalidation | Automatic | Manual |
| Code complexity | Low | High (grows with requirements) |
| Bundle size cost | ~4KB | 0 (but you'll write more code) |
| Learning curve | Medium (cache model) | Low (familiar) |

**When to use Manual fetch:** Very simple one-shot data loads, server components (App Router `fetch()`), or when you need fine-grained control over every aspect of the request lifecycle.

**When to use SWR:** Any client component that fetches data more than once, shared data used by multiple components, anything that benefits from background refresh or focus revalidation.

---

## Source Code Worth Reading

- [SWR core source](https://github.com/vercel/swr/blob/main/src/core/use-swr.ts) — understand the full cache/revalidation lifecycle
- [SWR cache implementation](https://github.com/vercel/swr/blob/main/src/core/cache.ts) — how the Map-based cache works
- [Web Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API) — what `performance.mark()` and `performance.measure()` actually do
- [React Profiler API](https://react.dev/reference/react/Profiler) — `<Profiler onRender={...}>` for programmatic render tracking

---

## Further Directions

- [ ] Add `<Profiler>` wrapper around panels to log render timing programmatically
- [ ] Explore `useSWRInfinite` for pagination and its performance implications
- [ ] Implement optimistic updates with `mutate(optimisticData, { rollbackOnError: true })`
- [ ] Compare with React Query (TanStack Query) — same ideas, different API surface
- [ ] Add Service Worker caching and compare with SWR cache — different layers, different trade-offs
- [ ] Profile with `PerformanceObserver` instead of polling `getEntriesByType()`

---

*Good POCs take hours, days, and weeks. The more experiments you run and the deeper you read the source, the more these patterns become instinct.*
