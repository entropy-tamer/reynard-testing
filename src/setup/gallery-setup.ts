/**
 * Gallery Test Setup - For packages that need gallery and media display functionality
 */

import { setupBrowserTest } from "./browser-setup.js";

/**
 * Setup for gallery packages (reynard-gallery-ai, etc.)
 * Includes gallery-specific mocks like IntersectionObserver, matchMedia, and storage
 */
export function setupGalleryTest() {
  setupBrowserTest();

  // Mock window.matchMedia for responsive tests
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}
