/**
 * Component Test Setup - For packages that need component testing utilities
 */

import { vi } from "vitest";
import { setupBrowserTest } from "./browser-setup.js";

/**
 * Setup for component packages (reynard-caption, reynard-annotating-core, etc.)
 * Includes component-specific mocks like File API, timers, and observers
 */
export function setupComponentTest() {
  setupBrowserTest();

  // Mock console methods to reduce noise in tests
  global.console = {
    ...console,
    debug: vi.fn(),
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  // Mock timers
  vi.useFakeTimers();

  // Mock File API for file upload tests
  global.File = class File {
    constructor(
      public content: string[],
      public name: string,
      public options: { type?: string } = {}
    ) {
      this.type = options.type || "text/plain";
    }

    type: string;
    size: number = 0;

    static fromString(content: string, name: string, type?: string) {
      return new File([content], name, { type });
    }
  } as any;

  // Mock URL.createObjectURL for image preview tests
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
}
