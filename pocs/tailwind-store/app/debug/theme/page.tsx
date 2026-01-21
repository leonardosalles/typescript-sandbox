"use client";

const TOKENS = [
  "--color-bg",
  "--color-surface",
  "--color-text",
  "--color-text-muted",
  "--color-primary",
  "--color-accent",
  "--color-border",
  "--shadow-sm",
  "--shadow-md",
];

export default function ThemeDebugPage() {
  const isClient = typeof window !== "undefined";

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Theme Debug</h1>

      <p className="text-[rgb(var(--color-text-muted))]">
        Inspect current CSS variables resolved at runtime.
      </p>

      <div className="space-y-2">
        {TOKENS.map((token) => (
          <div
            key={token}
            className="
              flex justify-between
              bg-[rgb(var(--color-surface))]
              border border-[rgb(var(--color-border))]
              rounded-md
              px-4 py-2
              text-sm
            "
          >
            <span>{token}</span>
            <code>
              {isClient
                ? getComputedStyle(document.documentElement).getPropertyValue(
                    token,
                  )
                : "N/A"}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
