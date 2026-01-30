import { writable, derived, readable } from "svelte/store";

export const counter = writable(0);

export const doubleCounter = derived(counter, ($c) => $c * 2);

export function createDebugStore(initial: number) {
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set: (v: number) => {
      console.log("SET", v);
      set(v);
    },
    inc: () => update((v) => v + 1),
  };
}

export const debugCount = createDebugStore(5);

export const clock = readable(Date.now(), (set) => {
  const i = setInterval(() => set(Date.now()), 1000);
  return () => clearInterval(i);
});
