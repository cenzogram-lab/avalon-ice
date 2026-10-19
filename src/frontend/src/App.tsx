import Layout from "@/components/Layout";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: Shop,
});

// The legal pages are long, rarely visited text, so each loads as its own
// chunk instead of growing the bundle every visitor downloads.
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: lazyRouteComponent(() => import("@/pages/PrivacyPolicy")),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: lazyRouteComponent(() => import("@/pages/TermsOfService")),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  shopRoute,
  privacyRoute,
  termsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
