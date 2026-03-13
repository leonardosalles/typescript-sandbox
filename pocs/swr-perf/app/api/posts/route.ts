import { NextResponse } from "next/server";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  fetchedAt: number;
}

export async function GET() {
  const start = Date.now();

  await new Promise((r) => setTimeout(r, 50 + Math.random() * 50));

  const posts: Post[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Post #${i + 1}: ${titles[i % titles.length]}`,
    body: bodies[i % bodies.length],
    userId: (i % 5) + 1,
    fetchedAt: Date.now(),
  }));

  return NextResponse.json({
    posts,
    meta: {
      duration: Date.now() - start,
      count: posts.length,
      strategy: "fast",
      timestamp: Date.now(),
    },
  });
}

const titles = [
  "Understanding React rendering cycles",
  "Why memoization matters at scale",
  "Deep dive into SWR cache invalidation",
  "Profiling with Chrome DevTools",
  "The cost of unnecessary re-renders",
];

const bodies = [
  "React's reconciliation algorithm is fundamentally about minimizing DOM mutations. Each render creates a virtual tree compared against the previous one.",
  "Memoization trades memory for speed. In large component trees, this trade-off almost always wins — but measure before you optimize.",
  "SWR's stale-while-revalidate pattern means users see content instantly while fresh data loads silently in the background.",
  "The Performance tab in Chrome DevTools records CPU flame charts. Every yellow bar is JavaScript execution. Look for long tasks over 50ms.",
];
