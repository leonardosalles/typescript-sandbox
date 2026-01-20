import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  return (
    <header className="bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))]">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-semibold">NextStore</span>

        <ul className="hidden md:flex gap-6 text-sm text-[rgb(var(--color-text-muted))]">
          <li className="hover:text-text cursor-pointer">Men</li>
          <li className="hover:text-text cursor-pointer">Women</li>
          <li className="hover:text-text cursor-pointer">Electronics</li>
        </ul>

        <ThemeSwitcher />
      </nav>
    </header>
  );
}
