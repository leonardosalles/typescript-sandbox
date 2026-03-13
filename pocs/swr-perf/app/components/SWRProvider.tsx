"use client";

import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          console.error(
            `%c[SWR ERROR] key: ${key}`,
            "color: #ff4060; font-weight: bold",
            error,
          );
        },
        onSuccess: (_data, key) => {
          console.log(`%c[SWR CACHE] ${key}`, "color: #4080ff", "→ data ready");
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
