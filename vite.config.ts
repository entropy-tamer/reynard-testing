import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    target: "node18",
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: {
        index: "./src/index.ts",
        "config/index": "./src/config/index.ts",
        "utils/index": "./src/utils/index.ts",
        "mocks/index": "./src/mocks/index.ts",
        "dom/index": "./src/dom/index.ts",
        "fixtures/index": "./src/fixtures/index.ts",
        "doc-tests/index": "./src/doc-tests/index.ts",
        "doc-test-runner": "./src/doc-test-runner.ts",
        "eslint-plugin/index": "./src/eslint-plugin/index.ts",
        "vitest-db-reporter": "./src/vitest-db-reporter.ts",
      },
      formats: ["es"],
      fileName: (format, entryName) => {
        // Handle subpath exports like "config/index" -> "config/index.js"
        if (entryName.includes("/")) {
          return `${entryName}.js`;
        }
        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      external: (id) => {
        // Externalize Node.js built-ins
        if (id.startsWith("node:") || ["fs", "path", "os", "crypto", "util", "events", "stream", "buffer", "url", "querystring", "http", "https", "zlib", "child_process", "worker_threads", "perf_hooks", "assert", "module", "net", "dns", "readline", "tty", "v8", "vm", "fsevents"].includes(id)) {
          return true;
        }
        // Externalize SolidJS
        if (id === "solid-js" || id === "solid-js/web" || id.startsWith("solid-js/")) {
          return true;
        }
        // Externalize testing libraries
        if (id.startsWith("@solidjs/testing-library") || id.startsWith("@testing-library/") || id === "vitest" || id.startsWith("vitest/")) {
          return true;
        }
        // Externalize TypeScript ESLint
        if (id.startsWith("@typescript-eslint/")) {
          return true;
        }
        // Externalize Reynard packages
        if (id.startsWith("@entropy-tamer/reynard-")) {
          return true;
        }
        // Externalize other dependencies
        if (["glob", "std-env", "commander"].includes(id) || id.startsWith("@babel/") || id.startsWith("playwright")) {
          return true;
        }
        // Externalize vite plugin dependencies
        if (id.startsWith("vite-plugin-") || id.startsWith("rollup-plugin-")) {
          return true;
        }
        return false;
      },
    },
  },
  resolve: {
    alias: {
      "~": new URL("./src", import.meta.url).pathname,
    },
    preserveSymlinks: true,
  },
});
