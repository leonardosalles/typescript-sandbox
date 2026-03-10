import type { getAuth } from "@/store/auth";

export interface RouterContext {
  auth: ReturnType<typeof getAuth>;
}
