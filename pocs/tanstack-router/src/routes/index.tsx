import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/store/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
});
