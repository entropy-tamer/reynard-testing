/**
 * Canvas Context Helper Functions - Helper functions for creating canvas context mocks
 */

import { vi } from "vitest";

// Type definitions for better compatibility
type PredefinedColorSpace = "srgb" | "display-p3" | "rec2020";

/**
 * Creates drawing methods for canvas context mock
 */
export function createDrawingMethods(): Record<string, any> {
  return {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    strokeRect: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
      colorSpace: "srgb" as PredefinedColorSpace,
    })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
      colorSpace: "srgb" as PredefinedColorSpace,
    })),
    drawImage: vi.fn(),
  };
}

/**
 * Creates path methods for canvas context mock
 */
export function createPathMethods(): Record<string, any> {
  return {
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    arcTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    rect: vi.fn(),
    roundRect: vi.fn(),
  };
}

/**
 * Creates drawing operations for canvas context mock
 */
export function createDrawingOperations(): Record<string, any> {
  return {
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    isPointInPath: vi.fn(() => false),
    isPointInStroke: vi.fn(() => false),
  };
}

/**
 * Creates text methods for canvas context mock
 */
export function createTextMethods(): Record<string, any> {
  return {
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({
      width: 0,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 0,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: 0,
      fontBoundingBoxAscent: 0,
      fontBoundingBoxDescent: 0,
    })),
  };
}

/**
 * Creates transform methods for canvas context mock
 */
export function createTransformMethods(): Record<string, any> {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    transform: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
  };
}

/**
 * Creates gradient and pattern methods for canvas context mock
 */
export function createGradientMethods(): Record<string, any> {
  return {
    createLinearGradient: vi.fn(),
    createRadialGradient: vi.fn(),
    createConicGradient: vi.fn(),
    createPattern: vi.fn(),
  };
}

/**
 * Creates additional required methods for canvas context mock
 */
export function createAdditionalMethods(): Record<string, any> {
  return {
    getLineDash: vi.fn(() => []),
    setLineDash: vi.fn(),
    getTransform: vi.fn(() => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })),
    drawFocusIfNeeded: vi.fn(),
    ellipse: vi.fn(),
    reset: vi.fn(),
  };
}

/**
 * Creates context attributes for canvas context mock
 */
export function createContextAttributes(): Record<string, any> {
  return {
    getContextAttributes: vi.fn(() => ({})),
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low",
    lineCap: "butt",
    lineDashOffset: 0,
    lineJoin: "miter",
    lineWidth: 1,
    miterLimit: 10,
    shadowBlur: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    strokeStyle: "#000000",
    fillStyle: "#000000",
    font: "10px sans-serif",
    fontKerning: "auto",
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "inherit",
    filter: "none",
  };
}
