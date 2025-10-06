/**
 * Test Environment Configuration
 * Provides utilities for managing different DOM testing environments
 */

export type DOMEnvironment = "happy-dom" | "jsdom" | "browser";

export interface TestEnvironmentConfig {
  environment: DOMEnvironment;
  fallbackToJsdom: boolean;
  skipFocusTests: boolean;
  skipComputedStyleTests: boolean;
}

/**
 * Default configuration for the testing environment
 */
export const defaultTestConfig: TestEnvironmentConfig = {
  environment: "happy-dom",
  fallbackToJsdom: true,
  skipFocusTests: false,
  skipComputedStyleTests: false,
};

/**
 * Get the current test environment configuration
 */
export function getTestEnvironmentConfig(): TestEnvironmentConfig {
  // Check for environment variables or test configuration
  const env = (process.env.TEST_DOM_ENVIRONMENT as DOMEnvironment) || "happy-dom";
  const fallbackToJsdom = process.env.TEST_FALLBACK_JSDOM !== "false";
  const skipFocusTests = process.env.TEST_SKIP_FOCUS === "true";
  const skipComputedStyleTests = process.env.TEST_SKIP_COMPUTED_STYLES === "true";

  return {
    environment: env,
    fallbackToJsdom,
    skipFocusTests,
    skipComputedStyleTests,
  };
}

/**
 * Check if the current environment supports a specific feature
 */
export function supportsFeature(feature: "focus" | "computedStyles" | "documentContains"): boolean {
  const config = getTestEnvironmentConfig();

  switch (feature) {
    case "focus":
      return !config.skipFocusTests && config.environment !== "happy-dom";
    case "computedStyles":
      return !config.skipComputedStyleTests && config.environment !== "happy-dom";
    case "documentContains":
      return config.environment !== "happy-dom";
    default:
      return false;
  }
}

/**
 * Skip test if feature is not supported
 */
export function skipIfUnsupported(feature: "focus" | "computedStyles" | "documentContains"): void {
  if (!supportsFeature(feature)) {
    const config = getTestEnvironmentConfig();
    throw new Error(`Test skipped: ${feature} not supported in ${config.environment} environment`);
  }
}

/**
 * Get environment-specific test utilities
 */
export function getEnvironmentUtils() {
  const config = getTestEnvironmentConfig();

  return {
    config,
    supportsFocus: supportsFeature("focus"),
    supportsComputedStyles: supportsFeature("computedStyles"),
    supportsDocumentContains: supportsFeature("documentContains"),
    skipIfUnsupported,
  };
}
