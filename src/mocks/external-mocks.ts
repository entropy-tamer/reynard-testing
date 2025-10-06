import { vi } from "vitest";

/**
 * External library mocks for testing
 */

/**
 * Mock Fabric.js
 */
export const mockFabric = {
  Canvas: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    renderAll: vi.fn(),
    dispose: vi.fn(),
    getPointer: vi.fn(() => ({ x: 100, y: 100 })),
    findTarget: vi.fn(() => null),
    on: vi.fn(),
    off: vi.fn(),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(() => null),
  })),
  Rect: vi.fn().mockImplementation(() => ({
    set: vi.fn(),
    setControlsVisibility: vi.fn(),
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  })),
};

/**
 * Mock Monaco Editor
 */
export const mockMonaco = {
  editor: {
    create: vi.fn(),
    setModel: vi.fn(),
    getModel: vi.fn(),
    dispose: vi.fn(),
  },
  languages: {
    register: vi.fn(),
    setLanguageConfiguration: vi.fn(),
  },
};

/**
 * Mock D3.js
 */
export const mockD3 = {
  select: vi.fn(() => ({
    append: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    style: vi.fn().mockReturnThis(),
    data: vi.fn().mockReturnThis(),
    enter: vi.fn().mockReturnThis(),
    exit: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    transition: vi.fn().mockReturnThis(),
    duration: vi.fn().mockReturnThis(),
    delay: vi.fn().mockReturnThis(),
    ease: vi.fn().mockReturnThis(),
  })),
  scaleLinear: vi.fn(() => ({
    domain: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
  })),
  scaleBand: vi.fn(() => ({
    domain: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    padding: vi.fn().mockReturnThis(),
  })),
};
