/**
 * Canvas Mocks - For testing Canvas and OffscreenCanvas operations
 */

import { vi } from "vitest";

/**
 * Create a mock canvas rendering context
 */
function createMockCanvasContext() {
  return {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(100),
      width: 10,
      height: 10,
    })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(100),
      width: 10,
      height: 10,
    })),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    transform: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    clip: vi.fn(),
    isPointInPath: vi.fn(() => false),
    isPointInStroke: vi.fn(() => false),
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
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "inherit",
    filter: "none",
  } as unknown as CanvasRenderingContext2D;
}

/**
 * Setup Canvas and OffscreenCanvas mocks for testing
 */
export function setupCanvasMocks() {
  // Mock canvas for image processing
  global.HTMLCanvasElement.prototype.getContext = vi.fn(() =>
    createMockCanvasContext()
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  global.HTMLCanvasElement.prototype.toBlob = vi.fn(callback => {
    const blob = new Blob(["mock-image"], { type: "image/png" });
    callback(blob);
  });

  global.HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,mock");

  // Mock createImageBitmap
  global.createImageBitmap = vi.fn(() =>
    Promise.resolve({
      width: 100,
      height: 100,
      close: vi.fn(),
    } as ImageBitmap)
  );

  // Mock OffscreenCanvas if not available
  if (!global.OffscreenCanvas) {
    global.OffscreenCanvas = class MockOffscreenCanvas {
      width: number;
      height: number;

      constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
      }

      getContext() {
        return createMockCanvasContext() as unknown as OffscreenCanvasRenderingContext2D;
      }

      convertToBlob() {
        return Promise.resolve(new Blob(["mock"], { type: "image/png" }));
      }
    } as unknown as typeof OffscreenCanvas;
  }
}
