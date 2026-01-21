import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[rgb(var(--color-surface))] border-t border-[rgb(var(--color-border))]">
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm flex justify-between">
        <span className="text-[rgb(var(--color-text-muted))]">
          © 2026 NextStore
        </span>

        <Link
          href="/debug/theme"
          className="text-[rgb(var(--color-primary))] hover:underline"
        >
          Theme Debug
        </Link>
      </div>
    </footer>
  );
}
