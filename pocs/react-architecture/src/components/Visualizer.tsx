import { useLayoutEffect } from "react";

const SlowItem = () => {
  const start = performance.now();
  while (performance.now() - start < 1) {}
  return <div className="dot" />;
};

export default function Visualizer({
  items,
  label,
}: {
  items: any[];
  label: string;
}) {
  useLayoutEffect(() => {
    if (items.length > 0) console.log(`Render: ${label} - Commit Phase`);
  });

  return (
    <div className="grid-container">
      {items.map((_, i) => (
        <SlowItem key={i} />
      ))}
    </div>
  );
}
