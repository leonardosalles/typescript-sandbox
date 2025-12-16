import { db } from "@/lib/db";
import { saveTransformer } from "@/app/actions/saveTransformer";
import { RunPipelineButton } from "./RunButton";

export const revalidate = 0;

export default async function PipelinePage() {
  const pipeline = db.pipeline.find("1");

  return (
    <>
      <form action={saveTransformer}>
        <h2>Pipeline Transformer</h2>
        <textarea
          name="transformer"
          rows={10}
          cols={80}
          defaultValue={pipeline.transformer}
        />
        <br />
        <button type="submit">Save Transformer</button>
      </form>

      <RunPipelineButton />
    </>
  );
}
