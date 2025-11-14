/**
 * Main exports for reynard-testing
 */

export * from "./config/index.js";
export * from "./config/vitest.base.js";
export * from "./doc-test-runner.js";
export * from "./doc-tests.js";
export * from "./mocks/index.js";

// Main testing utilities
export * from "./test-utils.jsx";

// Assertion utilities (also exported from utils, but available from main package for convenience)
export * from "./utils/assertion-utils.js";

// Unified test setup system
export * from "./setup/index.js";

// Harmonized DOM testing utilities
export * from "./dom/index.js";

// i18n testing utilities
export * from "./utils/i18n-testing.js";
export * from "./utils/i18n-eslint-plugin.js";
export * from "./utils/i18n-lint-script.js";
export * from "./utils/i18n-ci-checks.js";
export * from "./utils/i18n-package-orchestrator.js";
export * from "./config/i18n-testing-config.js";

// Test setup functions for specific packages
export function setup3DTest(): void {
  // Minimal 3D test setup
  console.log("3D test setup initialized");
}

export function setupMediaTest(): void {
  // Minimal media test setup
  console.log("Media test setup initialized");
}
