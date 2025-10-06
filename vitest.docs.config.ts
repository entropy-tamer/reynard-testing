import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.doc-tests.test.ts"],
    exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "reynard-core": new URL("../core/src", import.meta.url).pathname,
      "reynard-components-core": new URL("../components-core/src", import.meta.url).pathname,
      "reynard-auth": new URL("../auth/src", import.meta.url).pathname,
      "reynard-chat": new URL("../chat/src", import.meta.url).pathname,
      "reynard-testing": new URL("./src", import.meta.url).pathname,
      "reynard-algorithms": new URL("../algorithms/src", import.meta.url).pathname,
      "reynard-file-processing": new URL("../file-processing/src", import.meta.url).pathname,
    },
  },
});
