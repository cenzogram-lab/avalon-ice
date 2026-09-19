import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// The homepage gates its lazy 3D map on an IntersectionObserver. jsdom has
// no implementation, so this stub reports every observed target as already
// intersecting — the same state a visitor scrolled to the map is in.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private readonly callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element): void {
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// @react-three/fiber's Canvas measures its container with ResizeObserver,
// which jsdom does not provide.
class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
globalThis.ResizeObserver =
  MockResizeObserver as unknown as typeof ResizeObserver;

// Radix UI's Select calls the Pointer Events capture API, which jsdom does
// not implement. Without these the select throws on open and its options are
// never observable.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
// Radix Select scrolls the active option into view when it opens.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom 26 exposes a `matchMedia` property that is not callable, so guard on
// the type rather than on the property's presence.
if (typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!("scrollTo" in window)) {
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: () => {},
  });
}

// jsdom's HTMLMediaElement.play() throws "Not implemented" and returns
// undefined, which the brand video's `.catch(...)` then trips over. Return a
// resolved promise so the component's autoplay path behaves like a browser
// that simply declined to start playback.
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  writable: true,
  value: () => Promise.resolve(),
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  writable: true,
  value: () => {},
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
