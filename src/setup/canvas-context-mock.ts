/**
 * Canvas Context Mock - Mock implementation of HTML5 Canvas 2D context
 */

import { vi } from "vitest";
import {
  createDrawingMethods,
  createPathMethods,
  createDrawingOperations,
  createTextMethods,
  createTransformMethods,
  createGradientMethods,
  createAdditionalMethods,
  createContextAttributes,
} from "./canvas-context-helpers.js";

/**
 * Creates a comprehensive mock of HTML5 Canvas 2D context
 * Includes all drawing methods, path operations, text rendering, and transforms
 */
export function createMockCanvasContext() {
  return {
    // Canvas properties
    canvas: {} as HTMLCanvasElement,

    // Combine all method groups
    ...createDrawingMethods(),
    ...createPathMethods(),
    ...createDrawingOperations(),
    ...createTextMethods(),
    ...createTransformMethods(),
    ...createGradientMethods(),
    ...createAdditionalMethods(),
    ...createContextAttributes(),
  } as any;
}

/**
 * Sets up HTML5 Canvas element mock with getContext method
 */
export function setupCanvasElementMock() {
  const mockContext = createMockCanvasContext();
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext) as any;
  return mockContext;
}
