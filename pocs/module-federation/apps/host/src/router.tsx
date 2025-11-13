import { createRootRoute, createRoute, Router } from "@tanstack/react-router";
import CartPage from "checkout/CartPage";
import HomePage from "./pages/Home";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const routeTree = rootRoute.addChildren([indexRoute, cartRoute]);

export const router = new Router({ routeTree });
