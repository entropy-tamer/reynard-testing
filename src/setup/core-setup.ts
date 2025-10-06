/**
 * Core Test Setup - For packages that need basic browser APIs and storage
 */

import { vi } from "vitest";
import { setupBrowserTest } from "./browser-setup.js";

// Prevent multiple setup calls
let isSetup = false;

/**
 * Setup for core packages (reynard-core, etc.)
 * Includes browser APIs, storage, and common utilities
 */
export function setupCoreTest() {
  if (isSetup) {
    return; // Prevent recursive setup
  }
  isSetup = true;

  setupBrowserTest();

  // Mock process if not available (for Node.js specific code)
  if (typeof process === "undefined") {
    global.process = {
      env: {
        NODE_ENV: "test",
        VITEST: "true",
      },
      memoryUsage: vi.fn(() => ({
        rss: 0,
        heapTotal: 0,
        heapUsed: 0,
        external: 0,
        arrayBuffers: 0,
      })),
      nextTick: vi.fn(callback => {
        // Use a simple callback execution instead of setTimeout to avoid recursion
        try {
          callback();
        } catch (e) {
          // Ignore errors in test environment
        }
      }),
      cwd: vi.fn(() => "/test"),
      platform: "test",
      version: "v18.0.0",
      versions: {
        node: "18.0.0",
        v8: "10.0.0",
        uv: "1.0.0",
        zlib: "1.0.0",
        brotli: "1.0.0",
        ares: "1.0.0",
        modules: "108",
        nghttp2: "1.0.0",
        napi: "8",
        llhttp: "6.0.0",
        openssl: "3.0.0",
        cldr: "41.0",
        icu: "71.0",
        tz: "2022a",
        unicode: "14.0",
      },
    } as any;
  }

  // Note: setTimeout/clearTimeout mocking is handled by vitest's fake timers
  // No need to mock them here as it can cause recursive issues
}
