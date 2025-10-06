import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

/**
 * Vitest configuration specifically for component testing
 * Includes additional setup for UI component testing
 */
export default defineConfig({
  plugins: [solid() as any],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    environmentOptions: {
      happyDOM: {
        url: "http://localhost:3000",
        settings: {
          disableJavaScriptFileLoading: true,
          disableJavaScriptEvaluation: true,
          disableCSSFileLoading: true,
        },
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        global: {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/test-setup.ts",
        "**/fixtures/**",
        "**/mocks/**",
      ],
    },
    // Component-specific test configuration
    testTimeout: 10000, // Longer timeout for component tests
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "~": new URL("./src", import.meta.url).pathname,
    },
  },
});
