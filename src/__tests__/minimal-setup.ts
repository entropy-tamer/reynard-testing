/**
 * Minimal test setup file
 */

import { afterEach, vi } from "vitest";

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

afterEach(() => {
  vi.clearAllMocks();
});

