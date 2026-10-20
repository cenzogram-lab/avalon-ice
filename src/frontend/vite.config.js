import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import { ROUTES, renderRouteHtml } from "./src/lib/seo.ts";

/**
 * Emit dist/<route>/index.html for every public route, each with its own
 * title, description, canonical, OpenGraph/Twitter tags and breadcrumb
 * schema. The app is a single-page app, so without these every URL would
 * serve the home page's tags to crawlers that don't run JavaScript (link
 * previews, many SEO tools). Hosts that resolve /shop to shop.html or
 * shop/index.html serve them; any other host still works via the SPA
 * fallback plus the runtime head manager (useDocumentHead).
 */
function seoRoutePages() {
  let outDir = "";
  return {
    name: "avalon-seo-route-pages",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const home = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const route of ROUTES) {
        if (route.path === "/") continue;
        // Both shapes, since hosts differ in how /shop is resolved: some
        // try /shop.html, others /shop/index.html. Each page's canonical
        // points at the clean /shop URL either way.
        const name = route.path.replace(/^\//, "");
        const html = renderRouteHtml(home, route);
        fs.mkdirSync(path.join(outDir, name), { recursive: true });
        fs.writeFileSync(path.join(outDir, name, "index.html"), html);
        fs.writeFileSync(path.join(outDir, `${name}.html`), html);
      }
    },
  };
}

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://uqzsh-gqaaa-aaaaq-qaada-cai.localhost:8081/authorize`
    : `https://id.ai/authorize`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    // The template shipped production builds unminified, which was the bulk
    // of the payload. esbuild minification is vite's default.
    minify: "esbuild",
    rollupOptions: {
      output: {
        // Split long-lived vendor code out of the app chunk so a copy
        // tweak doesn't invalidate the whole download.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // three/@react-three are intentionally NOT split out: naming them
          // turns the lazy map's dependency into a static entry import,
          // which drags the whole 3D stack into the first paint.
          if (/[\\/]node_modules[\\/](@icp-sdk|@caffeineai|@dfinity)[\\/]/.test(id))
            return "icp";
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id))
            return "react";
          if (/[\\/]node_modules[\\/](@tanstack)[\\/]/.test(id))
            return "tanstack";
          if (/[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id))
            return "motion";
        },
      },
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
    seoRoutePages(),
  ],
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
    dedupe: ["@icp-sdk/core"]
  },
});
