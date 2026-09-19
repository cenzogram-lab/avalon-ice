import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * Render a page component inside the providers the real app mounts.
 *
 * - A memory-history TanStack router gives `Link`/`useRouterState` their
 *   context without touching the browser URL.
 * - A fresh `QueryClient` per render backs the react-query hooks the
 *   inquiry forms use, with retries off so a rejected mock fails fast.
 *
 * The InternetIdentity provider is intentionally omitted: tests that render
 * actor-backed components mock `useActor` at the module seam instead, so no
 * real identity or network call is involved.
 */
export function renderWithRouter(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const rootRoute = createRootRoute({ component: () => ui });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => ui,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
