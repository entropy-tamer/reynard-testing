/**
 * Observer API Mock - Provides ResizeObserver and IntersectionObserver for tests
 */

import { vi } from "vitest";

/**
 * Mock ResizeObserver API
 */
export function mockResizeObserver() {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

/**
 * Mock IntersectionObserver API
 */
export function mockIntersectionObserver() {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}
