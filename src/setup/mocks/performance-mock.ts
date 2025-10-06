/**
 * Performance API Mock - Provides performance monitoring for tests
 */

import { vi } from "vitest";

/**
 * Mock performance API with timing and memory information
 */
export function mockPerformance() {
  global.performance = {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  } as any;
}
