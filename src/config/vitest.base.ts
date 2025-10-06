import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";

// Types
export interface VitestConfigOptions {
  packageName: string;
  setupFiles?: string[];
  additionalPlugins?: Plugin[];
  coverageThresholds?: {
    branches?: number;
    functions?: number;
    lines?: number;
    statements?: number;
  };
  excludeFromCoverage?: string[];
}

// Vitest-specific types
type VitestPool = "forks" | "threads" | "vmThreads" | "browser";

// Default configuration values
const DEFAULT_COVERAGE_THRESHOLDS = {
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80,
};

const DEFAULT_SETUP_FILES = ["./src/test-setup.ts"];

// Test configuration builders
const createTestConfig = (options: VitestConfigOptions) => {
  const { setupFiles = DEFAULT_SETUP_FILES } = options;

  return {
    environment: "happy-dom" as const,
    globals: true,
    setupFiles,
    reporters: ["default"],
    ...createProcessConfig(),
    ...createTimeoutConfig(),
    environmentOptions: createEnvironmentOptions(),
    coverage: createCoverageConfig(options),
  };
};

const createProcessConfig = () => ({
  maxWorkers: process.env.VITEST_MAX_WORKERS ? parseInt(process.env.VITEST_MAX_WORKERS) : 1,
  pool: (process.env.VITEST_POOL as VitestPool) || "forks",
  poolOptions: {
    forks: {
      maxForks: process.env.VITEST_MAX_FORKS ? parseInt(process.env.VITEST_MAX_FORKS) : 1,
      singleFork: process.env.VITEST_SINGLE_FORK === "true" ? true : false,
    },
  },
  fileParallelism: process.env.VITEST_FILE_PARALLELISM === "false" ? false : true,
  isolate: process.env.VITEST_ISOLATE === "false" ? false : true,
});

const createTimeoutConfig = () => ({
  testTimeout: process.env.VITEST_TEST_TIMEOUT ? parseInt(process.env.VITEST_TEST_TIMEOUT) : 10000,
  hookTimeout: process.env.VITEST_HOOK_TIMEOUT ? parseInt(process.env.VITEST_HOOK_TIMEOUT) : 10000,
});

const createEnvironmentOptions = () => ({
  happyDOM: {
    url: "http://localhost:3000",
    settings: {
      disableJavaScriptFileLoading: true,
      disableJavaScriptEvaluation: true,
      disableCSSFileLoading: true,
    },
  },
});

const createCoverageConfig = (options: VitestConfigOptions) => {
  const { coverageThresholds = DEFAULT_COVERAGE_THRESHOLDS, excludeFromCoverage = [] } = options;

  return {
    provider: (process.env.VITEST_COVERAGE_PROVIDER as "v8" | "istanbul" | "c8") || "v8",
    reporter: process.env.VITEST_COVERAGE_REPORTER?.split(",") || ["text", "html", "lcov"],
    reportsDirectory: process.env.VITEST_COVERAGE_DIR || "coverage",
    thresholds: {
      global: coverageThresholds,
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
      ...excludeFromCoverage,
    ],
  };
};

/**
 * Base Vitest configuration for all Reynard packages
 * Provides common settings and can be extended by individual packages
 */
export const createBaseVitestConfig = (options: VitestConfigOptions = { packageName: "unknown" }) => {
  const { additionalPlugins = [] } = options;

  return defineConfig({
    plugins: [solid() as any, ...additionalPlugins],
    test: createTestConfig(options) as Record<string, unknown>,
  });
};

/**
 * Standard Vitest configuration for component testing
 */
export const createComponentTestConfig = (packageName: string) =>
  createBaseVitestConfig({
    packageName,
    setupFiles: ["./src/test-setup.ts"],
    coverageThresholds: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  });

/**
 * Standard Vitest configuration for utility/algorithm testing
 */
export const createUtilityTestConfig = (packageName: string) =>
  createBaseVitestConfig({
    packageName,
    setupFiles: ["./src/test-setup.ts"],
    coverageThresholds: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  });

/**
 * Standard Vitest configuration for integration testing
 */
export const createIntegrationTestConfig = (packageName: string) =>
  createBaseVitestConfig({
    packageName,
    setupFiles: ["./src/test-setup.ts"],
    coverageThresholds: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  });
