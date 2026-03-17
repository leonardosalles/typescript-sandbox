import { NextResponse } from "next/server";
export async function GET() {
  const mem = process.memoryUsage();
  return NextResponse.json({
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
    rss: Math.round(mem.rss / 1024 / 1024),
    uptime: Math.round(process.uptime()),
    timestamp: Date.now(),
  });
}
