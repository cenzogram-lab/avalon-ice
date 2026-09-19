import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// jsdom has no WebGL, so the real Canvas never mounts its scene graph.
// These factories render the scene's DOM labels inline instead. They are
// inlined rather than imported because `vi.mock` factories are hoisted above
// the module's own imports, so a factory cannot close over an imported helper.
vi.mock("@react-three/fiber", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@react-three/fiber")>();
  return {
    ...actual,
    Canvas: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    useFrame: () => {},
    useThree: (selector?: (state: unknown) => unknown) => {
      const state = {
        camera: {
          position: { x: 0, y: 0, z: 0, set: () => {} },
          zoom: 1,
          updateProjectionMatrix: () => {},
        },
        size: { height: 500, width: 800 },
      };
      return selector ? selector(state) : state;
    },
    useLoader: () => ({ name: "stub-texture" }),
  };
});

vi.mock("@react-three/drei", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@react-three/drei")>();
  return {
    ...actual,
    Html: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Billboard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    OrbitControls: () => null,
  };
});

// Importing the module runs `routeOf(...)` for every declared route at module
// load, so a route naming a town that is not in TOWNS throws here and fails
// the whole file before a single assertion runs.
import NJDeliveryMap from "@/components/home/NJDeliveryMap";

/** The map fetches real us-atlas geometry; keep the suite offline. */
function stubOfflineFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.reject(new Error("offline"))),
  );
}

describe("NJDeliveryMap", () => {
  it("labels the origin hub and stat counter as Ocean View HQ", async () => {
    stubOfflineFetch();
    render(<NJDeliveryMap />);

    // The in-scene beacon label.
    expect(await screen.findByText("Ocean View HQ")).toBeInTheDocument();
    // The stats card's origin row.
    expect(screen.getByText("origin · Ocean View HQ")).toBeInTheDocument();
  });

  it("renders no user-visible 'Woodbine' reference", async () => {
    stubOfflineFetch();
    const { container } = render(<NJDeliveryMap />);

    await screen.findByText("Ocean View HQ");
    expect(container.textContent ?? "").not.toMatch(/Woodbine/i);
  });

  it("lists every town exactly once in the town selector", async () => {
    stubOfflineFetch();
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<NJDeliveryMap />);

    await screen.findByText("Ocean View HQ");
    await user.click(screen.getByRole("combobox", { name: /select a town/i }));

    const options = await screen.findAllByRole("option");
    const names = options.map((o) => o.textContent?.trim() ?? "");

    expect(names.length).toBeGreaterThan(0);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("Ocean View");
    expect(names.some((n) => /Woodbine/i.test(n))).toBe(false);
  });

  it("selects a town and shows its detail card", async () => {
    stubOfflineFetch();
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<NJDeliveryMap />);

    await screen.findByText("Ocean View HQ");
    await user.click(screen.getByRole("combobox", { name: /select a town/i }));
    const option = await screen.findByRole("option", { name: "Ocean View" });
    await user.click(option);

    expect(await screen.findByText("Origin Hub")).toBeInTheDocument();
  });
});
