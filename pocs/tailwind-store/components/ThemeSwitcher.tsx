"use client";

export default function ThemeSwitcher() {
  return (
    <select
      defaultValue="default"
      onChange={(e) => {
        const theme = e.target.value;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
      }}
      className="
        bg-[rgb(var(--color-surface))]
        border border-[rgb(var(--color-border))]
        rounded-md px-3 py-1 text-sm
      "
    >
      <option value="default">Default</option>
      <option value="blackfriday">Black Friday</option>
      <option value="halloween">Halloween</option>
      <option value="christmas">Christmas</option>
    </select>
  );
}
