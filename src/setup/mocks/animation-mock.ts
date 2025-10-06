/**
 * Animation API Mock - Provides requestAnimationFrame for tests
 */

import { vi } from "vitest";

/**
 * Mock requestAnimationFrame and cancelAnimationFrame
 */
export function mockAnimationFrame() {
  global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    return setTimeout(callback, 16) as any;
  });

  global.cancelAnimationFrame = vi.fn((id: number) => {
    clearTimeout(id);
  });
}
