import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// jsdom has no WebGL, so the real Canvas never mounts its scene graph.
// These factories render the scene's DOM labels inline instead. They are
// inlined because `vi.mock` factories are hoisted above the module's imports.
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

import NJDeliveryMap from "@/components/home/NJDeliveryMap";

/**
 * The map's overlay controls are the keyboard-accessible surface for the
 * scene. This file covers their observable state transitions; the scene's
 * labels and town selector live in NJDeliveryMap.test.tsx.
 */
describe("NJDeliveryMap overlay controls", () => {
  function renderMap() {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    return render(<NJDeliveryMap />);
  }

  it("toggles between the service-area and full-state views", async () => {
    const user = userEvent.setup();
    renderMap();
    await screen.findByText("Ocean View HQ");

    const toggle = screen.getByRole("button", { name: "Full NJ map" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);
    const back = screen.getByRole("button", { name: "Service area" });
    expect(back).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles county lines on and off", async () => {
    const user = userEvent.setup();
    renderMap();
    await screen.findByText("Ocean View HQ");

    const toggle = screen.getByRole("button", { name: "County lines" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("resets the view and clears any selected town", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderMap();
    await screen.findByText("Ocean View HQ");

    await user.click(screen.getByRole("combobox", { name: /select a town/i }));
    await user.click(await screen.findByRole("option", { name: "Ocean View" }));
    expect(await screen.findByText("Origin Hub")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset view" }));
    expect(screen.queryByText("Origin Hub")).not.toBeInTheDocument();
  });
});
