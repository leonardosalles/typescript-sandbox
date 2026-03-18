"use client";

import { useState } from "react";

const steps = [
  {
    title: "Open DevTools Performance Tab",
    tag: "SETUP",
    color: "var(--blue)",
    content: [
      'Press F12 → "Performance" tab (or Cmd+Shift+P → "Show Performance")',
      'Click the ⚙ gear icon → Enable "Web Vitals" and "Screenshots"',
      "Set CPU throttle to 4x slowdown to exaggerate differences",
      'Check "Disable JavaScript samples" OFF so you get full flame charts',
    ],
  },
  {
    title: "Record a Profiling Session",
    tag: "RECORD",
    color: "var(--green)",
    content: [
      "Click the ● record button, then interact with the page",
      "Click Refetch on SWR panel 5×, then Manual panel 5×",
      "Stop recording — wait a few seconds for processing",
      'Look for the orange "Timings" row — these are our User Timing marks',
    ],
  },
  {
    title: "Read the Flame Chart",
    tag: "ANALYZE",
    color: "var(--yellow)",
    content: [
      "Yellow = JavaScript execution. Long yellow bars = jank (>50ms = long task)",
      "Purple = rendering/layout. Pink = painting. Green = compositing",
      'Zoom into a "SWR fetch" timing to see React fiber reconciliation',
      "Compare call stack depth: SWR vs manual have very different shapes",
    ],
  },
  {
    title: "Network Tab — Deduplication",
    tag: "NETWORK",
    color: "var(--purple)",
    content: [
      "Open Network tab, filter by Fetch/XHR",
      "Mount 5 SWR consumers via the Deduplication Demo → count requests",
      "Unmount and mount 5 Manual consumers → count requests again",
      "SWR: 1 request. Manual: 5 requests. This is deduplication in action.",
    ],
  },
  {
    title: "React DevTools Profiler",
    tag: "REACT",
    color: "var(--green)",
    content: [
      "Install React DevTools Chrome extension if you haven't",
      'Go to Components tab → ⚙ → check "Highlight updates when components render"',
      "Interact with both panels — notice SWR panels flash less (fewer re-renders)",
      'In Profiler tab, record and look at "why did this render?" for each component',
    ],
  },
  {
    title: "User Timings in Console",
    tag: "CONSOLE",
    color: "var(--red)",
    content: [
      "Open Console tab — our perf.ts logs colored fetch events",
      "Green = fast (<200ms), Yellow = medium (<600ms), Red = slow",
      'Run: performance.getEntriesByType("measure") to see all timing measures',
      'Or: performance.getEntriesByName("SWR fetch: /api/posts") for specific marks',
    ],
  },
];

export function ProfilingGuide() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="metric-card p-5 flex flex-col gap-3">
      <h2 className="font-bold text-sm" style={{ color: "var(--text)", letterSpacing: "0.05em" }}>
        PROFILING GUIDE
      </h2>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Step-by-step instructions for profiling this app with Chrome DevTools.
      </p>

      <div className="flex flex-col gap-1">
        {steps.map((step, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-3 p-3 rounded text-left transition-all"
              style={{ background: open === i ? "var(--surface2)" : "transparent" }}>
              <span className="text-xs mono px-2 py-0.5 rounded shrink-0"
                style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30`, fontSize: "10px" }}>
                {step.tag}
              </span>
              <span className="text-xs font-medium flex-1" style={{ color: "var(--text)" }}>{step.title}</span>
              <span className="text-xs mono" style={{ color: "var(--text-muted)" }}>{open === i ? "▲" : "▼"}</span>
            </button>

            {open === i && (
              <div className="mx-3 mb-2 terminal p-3 flex flex-col gap-1.5 animate-slide-in">
                {step.content.map((line, j) => (
                  <p key={j} className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    <span style={{ color: step.color }}>→</span> {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
