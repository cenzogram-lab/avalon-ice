import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Test-only config. Kept separate from `vite.config.js` so the production
 * build's environment plugin (which reads CANISTER_/DFX_ vars) never runs
 * during tests, while the `@` and `declarations` aliases stay identical to
 * the app's real resolution.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    // The sandbox's default worker pool resolves minThreads/maxThreads to a
    // conflicting pair, so pin a single forked worker explicitly.
    pool: "forks",
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 1,
      },
    },
  },
});
