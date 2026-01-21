"use client";

const THEMES = ["default", "blackfriday", "halloween", "christmas"];

export default function ThemeChaos() {
  function startChaos() {
    let i = 0;

    const interval = setInterval(() => {
      const theme = THEMES[i % THEMES.length];
      document.documentElement.setAttribute("data-theme", theme);
      i++;
    }, 300);

    setTimeout(() => clearInterval(interval), 5000);
  }

  return (
    <button
      onClick={startChaos}
      className="
        bg-[rgb(var(--color-accent))]
        text-white
        px-4 py-2
        rounded-md
        text-sm
      "
    >
      Chaos Mode
    </button>
  );
}
