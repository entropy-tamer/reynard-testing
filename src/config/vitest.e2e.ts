import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for E2E testing with Playwright
 * This is a minimal config since E2E tests typically use Playwright directly
 */
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    // E2E specific configuration
    testTimeout: 60000, // 1 minute timeout for E2E tests
    hookTimeout: 60000,
    maxConcurrency: 1, // Run E2E tests sequentially
    // Exclude from coverage since E2E tests are typically not unit tested
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: ["**/*"],
    },
  },
});
