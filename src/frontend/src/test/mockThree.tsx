import type { ReactNode } from "react";
import { vi } from "vitest";

/**
 * jsdom has no WebGL, so `@react-three/fiber`'s real `Canvas` never mounts
 * its scene graph and none of the map's in-scene DOM labels exist. These
 * factories replace the renderer with plain DOM so the scene's `Html`
 * labels (town names, county names, the Ocean View HQ tag) become
 * observable, while leaving the rest of each module intact.
 *
 * Call `vi.mock("@react-three/fiber", mockReactThreeFiber)` and
 * `vi.mock("@react-three/drei", mockReactThreeDrei)` at the top of a test
 * file. `vi.mock` factories are hoisted, so the factory must not close over
 * test-local variables.
 */
export const mockReactThreeFiber = async (
  importOriginal: () => Promise<typeof import("@react-three/fiber")>,
) => {
  const actual = await importOriginal();
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
};

export const mockReactThreeDrei = async (
  importOriginal: () => Promise<typeof import("@react-three/drei")>,
) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Html: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Billboard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    OrbitControls: () => null,
  };
};
