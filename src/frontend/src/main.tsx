import ErrorBoundary from "@/components/ErrorBoundary";
import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

/**
 * Dismiss the driving-truck loading screen inlined in index.html.
 *
 * Held for a short minimum so a warm cache shows a deliberate beat of
 * brand rather than a one-frame flicker, which reads as a glitch.
 */
const MIN_BOOT_MS = 750;

function hideBootScreen() {
  const boot = document.getElementById("boot");
  if (!boot || boot.dataset.hidden === "true") return;
  boot.dataset.hidden = "true";
  // Drop it from the DOM once the fade finishes so its fixed overlay can
  // never intercept clicks.
  window.setTimeout(() => boot.remove(), 600);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </InternetIdentityProvider>
  </QueryClientProvider>,
);

// Two frames after render puts us safely past React's first paint, so the
// truck gives way to a drawn page rather than an empty one.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.setTimeout(hideBootScreen, Math.max(0, MIN_BOOT_MS - performance.now()));
  });
});
