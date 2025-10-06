/**
 * Browser Test Setup - localStorage, sessionStorage, and browser APIs
 */

import { vi } from "vitest";
import { setupBaseTest } from "./base-setup.js";

// Prevent multiple setup calls
let isBrowserSetup = false;

/**
 * Create a mock storage implementation
 */
function createStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
  };
}

/**
 * Setup browser-specific mocks (localStorage, sessionStorage, etc.)
 */
export function setupBrowserTest() {
  if (isBrowserSetup) {
    return; // Prevent recursive setup
  }
  isBrowserSetup = true;

  setupBaseTest();

  // Mock localStorage
  Object.defineProperty(window, "localStorage", {
    value: createStorageMock(),
    writable: true,
  });

  // Mock sessionStorage
  Object.defineProperty(window, "sessionStorage", {
    value: createStorageMock(),
    writable: true,
  });

  // Mock window.location
  Object.defineProperty(window, "location", {
    value: {
      href: "http://localhost:3000",
      origin: "http://localhost:3000",
      protocol: "http:",
      host: "localhost:3000",
      hostname: "localhost",
      port: "3000",
      pathname: "/",
      search: "",
      hash: "",
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
    },
    writable: true,
  });

  // Mock window.history
  Object.defineProperty(window, "history", {
    value: {
      length: 1,
      state: null,
      back: vi.fn(),
      forward: vi.fn(),
      go: vi.fn(),
      pushState: vi.fn(),
      replaceState: vi.fn(),
    },
    writable: true,
  });

  // Mock window.navigator
  Object.defineProperty(window, "navigator", {
    value: {
      userAgent: "Mozilla/5.0 (Test Browser)",
      language: "en-US",
      languages: ["en-US", "en"],
      platform: "TestOS",
      onLine: true,
      cookieEnabled: true,
      geolocation: {
        getCurrentPosition: vi.fn(),
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
    },
    writable: true,
  });
}
