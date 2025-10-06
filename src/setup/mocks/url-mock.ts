/**
 * URL API Mock - Provides URL utilities for tests
 */

import { vi } from "vitest";

/**
 * Mock URL API methods
 */
export function mockUrl() {
  global.URL.createObjectURL = vi.fn(() => "mock-url");
  global.URL.revokeObjectURL = vi.fn();
}
