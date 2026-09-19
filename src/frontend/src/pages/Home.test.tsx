import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// The homepage lazy-loads the 3D delivery map once it nears the viewport
// (the setup file's IntersectionObserver stub reports it as visible). jsdom
// has no WebGL, so the real Canvas never mounts its scene graph; these
// factories render the scene's DOM labels inline instead. They are inlined
// because `vi.mock` factories are hoisted above the module's own imports.
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

// ContactSection (rendered by Home) calls useSubmitInquiry, which reaches for
// the backend actor. A null actor keeps the forms inert with no network call.
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: null, isFetching: false }),
}));

import Home from "@/pages/Home";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("Home", () => {
  it("states the network is based in Ocean View", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    renderWithRouter(<Home />);

    expect(
      await screen.findByText(
        "Based in Ocean View, Avalon Ice is built to serve the shore.",
        { exact: false },
      ),
    ).toBeInTheDocument();
  });

  it("headlines the network as born in the Pines", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    renderWithRouter(<Home />);

    expect(
      await screen.findByText("Born in the Pines. Bound for the Shore."),
    ).toBeInTheDocument();
  });

  it("renders no user-visible 'Woodbine' reference", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    const { container } = renderWithRouter(<Home />);

    // Wait for the lazy map to mount so its labels are part of the DOM.
    await screen.findByText("Ocean View HQ");
    expect(container.textContent ?? "").not.toMatch(/Woodbine/i);
  });
});
