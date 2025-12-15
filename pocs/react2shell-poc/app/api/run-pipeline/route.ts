import { executePipelineJob } from "@/lib/jobExecutor";
import { NextResponse } from "next/server";

export async function POST() {
  await executePipelineJob("1", {
    userId: "123",
    action: "sync",
  });

  return NextResponse.json({ status: "queued" });
}
