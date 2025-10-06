/**
 * Media Test Setup - For packages that need File, Image, Audio, Video, and media processing APIs
 */

import { setupBrowserTest } from "./browser-setup.js";
import { setupFileMocks } from "./file-mocks.js";
import { setupMediaMocks } from "./media-mocks.js";
import { setupCanvasMocks } from "./canvas-mocks.js";

/**
 * Setup for media processing packages (reynard-file-processing, etc.)
 * Includes File, Image, Audio, Video, Canvas, and media processing mocks
 */
export function setupMediaTest() {
  setupBrowserTest();
  setupFileMocks();
  setupMediaMocks();
  setupCanvasMocks();
}
