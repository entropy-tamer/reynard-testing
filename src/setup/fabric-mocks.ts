/**
 * Fabric.js Mocks - Mock implementations for fabric.js Canvas and objects
 */

import { vi } from "vitest";

/**
 * Creates a mock fabric.js Canvas object
 */
function createMockFabricCanvas(element: any, options: any = {}) {
  const eventHandlers = new Map();
  const canvas = {
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    renderAll: vi.fn(),
    dispose: vi.fn(),
    getPointer: vi.fn(() => ({ x: 100, y: 100 })),
    findTarget: vi.fn(() => null),
    on: vi.fn((event: string, handler: Function) => {
      eventHandlers.set(event, handler);
    }),
    off: vi.fn((event: string) => {
      eventHandlers.delete(event);
    }),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(() => null),
    getElement: vi.fn(() => element),
    width: options?.width || 800,
    height: options?.height || 600,
    backgroundColor: options?.backgroundColor || "transparent",
    selection: options?.selection !== false,
    preserveObjectStacking: options?.preserveObjectStacking !== false,
    // Add method to trigger events for testing
    triggerEvent: vi.fn((event: string, data: any) => {
      const handler = eventHandlers.get(event);
      if (handler) {
        handler(data);
      }
    }),
  };

  // Store the mock canvas globally for testing
  (global as any).mockFabricCanvas = canvas;
  (element as any).__fabricCanvas = canvas;

  return canvas;
}

/**
 * Creates a mock fabric.js Rect object
 */
function createMockFabricRect(options: any = {}) {
  return {
    set: vi.fn(),
    setControlsVisibility: vi.fn(),
    data: options?.data || {},
    left: options?.left || 0,
    top: options?.top || 0,
    width: options?.width || 100,
    height: options?.height || 100,
    fill: options?.fill || "transparent",
    stroke: options?.stroke || "#000",
    strokeWidth: options?.strokeWidth || 1,
    cornerColor: options?.cornerColor || "#000",
    cornerSize: options?.cornerSize || 8,
    transparentCorners: options?.transparentCorners !== false,
    hasRotatingPoint: options?.hasRotatingPoint !== false,
    lockRotation: options?.lockRotation !== false,
    selectable: options?.selectable !== false,
    evented: options?.evented !== false,
    strokeDashArray: options?.strokeDashArray || null,
  };
}

/**
 * Creates a mock fabric.js Circle object
 */
function createMockFabricCircle(options: any = {}) {
  return {
    set: vi.fn(),
    setControlsVisibility: vi.fn(),
    data: options?.data || {},
    left: options?.left || 0,
    top: options?.top || 0,
    radius: options?.radius || 50,
    fill: options?.fill || "transparent",
    stroke: options?.stroke || "#000",
    strokeWidth: options?.strokeWidth || 1,
    cornerColor: options?.cornerColor || "#000",
    cornerSize: options?.cornerSize || 8,
    transparentCorners: options?.transparentCorners !== false,
    hasRotatingPoint: options?.hasRotatingPoint !== false,
    lockRotation: options?.lockRotation !== false,
    selectable: options?.selectable !== false,
    evented: options?.evented !== false,
    strokeDashArray: options?.strokeDashArray || null,
  };
}

/**
 * Creates a mock fabric.js Line object
 */
function createMockFabricLine(options: any = {}) {
  return {
    set: vi.fn(),
    setControlsVisibility: vi.fn(),
    data: options?.data || {},
    x1: options?.x1 || 0,
    y1: options?.y1 || 0,
    x2: options?.x2 || 100,
    y2: options?.y2 || 100,
    stroke: options?.stroke || "#000",
    strokeWidth: options?.strokeWidth || 1,
    cornerColor: options?.cornerColor || "#000",
    cornerSize: options?.cornerSize || 8,
    transparentCorners: options?.transparentCorners !== false,
    hasRotatingPoint: options?.hasRotatingPoint !== false,
    lockRotation: options?.lockRotation !== false,
    selectable: options?.selectable !== false,
    evented: options?.evented !== false,
    strokeDashArray: options?.strokeDashArray || null,
  };
}

/**
 * Sets up fabric.js mocks using vi.mock
 */
export function setupFabricMocks() {
  vi.mock("fabric", () => ({
    Canvas: vi.fn().mockImplementation(createMockFabricCanvas),
    Rect: vi.fn().mockImplementation(createMockFabricRect),
    Circle: vi.fn().mockImplementation(createMockFabricCircle),
    Line: vi.fn().mockImplementation(createMockFabricLine),
  }));

  // Export mock canvas accessor for use in tests
  (global as any).getMockFabricCanvas = () => (global as any).mockFabricCanvas;
}
