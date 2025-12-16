"use client";

export function RunPipelineButton() {
  async function run() {
    await fetch("/api/run-pipeline", {
      method: "POST",
    });

    alert("Pipeline job triggered");
  }

  return <button onClick={run}>Run</button>;
}
