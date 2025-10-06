/**
 * Canvas Test Setup - For packages that need canvas, fabric.js, and 2D graphics APIs
 */

import { vi } from "vitest";
import { setupBrowserTest } from "./browser-setup.js";
import { setupCanvasElementMock } from "./canvas-context-mock.js";
import { setupFabricMocks } from "./fabric-mocks.js";

/**
 * Setup for canvas packages (reynard-boundingbox, etc.)
 * Includes canvas, fabric.js, and 2D graphics mocks
 */
export function setupCanvasTest() {
  setupBrowserTest();

  // Mock getBoundingClientRect
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 800,
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
    right: 800,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  }));

  // Setup canvas context mock
  setupCanvasElementMock();

  // Setup fabric.js mocks
  setupFabricMocks();
}
