import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  const posts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Slow Post #${i + 1}`,
    body: "This data came from a slow endpoint with no cache strategy.",
    userId: (i % 5) + 1,
    fetchedAt: Date.now(),
  }));

  return NextResponse.json({
    posts,
    meta: {
      duration: Date.now() - start,
      count: posts.length,
      strategy: "slow",
      timestamp: Date.now(),
    },
  });
}
