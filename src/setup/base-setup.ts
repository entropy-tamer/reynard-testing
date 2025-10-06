/**
 * Base Test Setup - Common mocking patterns used across all packages
 */

import { cleanup } from "@solidjs/testing-library";
import { afterEach, beforeEach, vi } from "vitest";
import {
  mockFetch,
  mockCrypto,
  mockPerformance,
  mockResizeObserver,
  mockIntersectionObserver,
  mockUrl,
  mockBase64,
  mockTextEncoding,
  mockAnimationFrame,
} from "./mocks";

// Prevent multiple setup calls
let isBaseSetup = false;

/**
 * Base test setup that all other setups extend
 * Provides common mocking patterns and cleanup
 */
export function setupBaseTest() {
  if (isBaseSetup) {
    return; // Prevent recursive setup
  }
  isBaseSetup = true;

  // Apply all mocks
  mockFetch();
  mockCrypto();
  mockPerformance();
  mockResizeObserver();
  mockIntersectionObserver();
  mockUrl();
  mockBase64();
  mockTextEncoding();
  mockAnimationFrame();

  // Setup cleanup
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
}

/**
 * Suppress console warnings in tests
 */
export function suppressConsoleWarnings() {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("computations created outside a `createRoot`") ||
        args[0].includes("Warning:") ||
        args[0].includes("Deprecated:"))
    ) {
      return; // Suppress these warnings
    }
    originalWarn(...args);
  };

  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Error: computations created outside a `createRoot`")) {
      return; // Suppress SolidJS lifecycle errors
    }
    originalError(...args);
  };
}
