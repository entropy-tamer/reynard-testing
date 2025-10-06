import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    target: "node18",
    lib: {
      entry: {
        index: "./src/index.ts",
        config: "./src/config/index.ts",
        utils: "./src/utils/index.ts",
        mocks: "./src/mocks/index.ts",
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        "solid-js",
        "solid-js/web",
        "@solidjs/testing-library",
        "@testing-library/user-event",
        "vitest",
        "vitest/utils",
        "fsevents",
        "fs",
        "path",
        "os",
        "crypto",
        "util",
        "events",
        "stream",
        "buffer",
        "url",
        "querystring",
        "http",
        "https",
        "zlib",
        "child_process",
        "worker_threads",
        "perf_hooks",
        "assert",
        "module",
        "net",
        "dns",
        "readline",
        "tty",
        "v8",
        "vm",
        "node:*",
      ],
    },
  },
  resolve: {
    alias: {
      "~": new URL("./src", import.meta.url).pathname,
    },
  },
});
