/**
 * Test setup file for the testing package
 * This file is imported by vitest configuration
 */

import { cleanup } from "@solidjs/testing-library";
import { afterEach, vi } from "vitest";

// Ensure we're in browser mode for SolidJS
if (!(globalThis as any).import) {
  Object.defineProperty(globalThis, "import", {
    value: {
      meta: {
        env: {
          SSR: false,
          DEV: true,
        },
      },
    },
  });
}

// Simple setup for happy-dom environment
if (typeof document !== "undefined") {
  // Ensure document.body exists
  if (!document.body) {
    const body = document.createElement("body");
    document.documentElement.appendChild(body);
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as typeof globalThis.localStorage;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
