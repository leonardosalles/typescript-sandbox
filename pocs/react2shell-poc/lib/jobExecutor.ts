import { runTransformer } from "./executor";
import { db } from "./db";
import fs from "fs";
import path from "path";

export async function executePipelineJob(
  pipelineId: string,
  inputPayload: unknown
) {
  const pipeline = db.pipeline.find(pipelineId);

  console.log("[executor] starting job", pipelineId);

  const result = runTransformer(pipeline.transformer, {
    input: inputPayload,
    env: {
      node: process.version,
      cwd: process.cwd(),
    },
  });

  const outDir = path.join(process.cwd(), "executions");
  fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(
    outDir,
    `pipeline-${pipelineId}-${Date.now()}.json`
  );

  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));

  console.log("[executor] wrote execution to", outFile);
  console.log("[executor] finished job");
}
