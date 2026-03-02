import { useState, useTransition } from "react";

export function useHeavyCompute(mode: "fiber" | "legacy") {
  const [text, setText] = useState("");
  const [items, setItems] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();

  const updateData = (value: string) => {
    setText(value);

    if (mode === "fiber") {
      startTransition(() => {
        const data = Array.from({ length: 5000 }) as number[];
        setItems(data);
      });
    } else {
      const data = Array.from({ length: 1000 }) as number[];
      setItems(data);
    }
  };

  return { text, items, isPending, updateData };
}
