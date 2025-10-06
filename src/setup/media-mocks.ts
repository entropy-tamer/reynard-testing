/**
 * Media Element Mocks - For testing Image, Audio, Video operations
 */

import { vi } from "vitest";

/**
 * Setup Image, Audio, and Video mocks for testing
 */
export function setupMediaMocks() {
  // Mock Image for image processing
  global.Image = class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src: string = "";
    width: number = 0;
    height: number = 0;
    naturalWidth: number = 0;
    naturalHeight: number = 0;
    complete: boolean = false;

    constructor() {
      setTimeout(() => {
        this.width = 100;
        this.height = 100;
        this.naturalWidth = 100;
        this.naturalHeight = 100;
        this.complete = true;
        this.onload?.();
      }, 0);
    }
  } as typeof Image;

  // Mock Audio for audio processing
  global.Audio = class MockAudio {
    onloadedmetadata: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src: string = "";
    duration: number = 0;
    currentTime: number = 0;
    volume: number = 1;
    muted: boolean = false;
    paused: boolean = true;
    ended: boolean = false;

    constructor() {
      setTimeout(() => {
        this.duration = 120;
        this.onloadedmetadata?.();
      }, 0);
    }

    play(): Promise<void> {
      this.paused = false;
      return Promise.resolve();
    }

    pause(): void {
      this.paused = true;
    }

    load(): void {
      // Mock implementation
    }
  } as typeof Audio;

  // Mock Video for video processing
  global.HTMLVideoElement.prototype.load = vi.fn();
  global.HTMLVideoElement.prototype.play = vi.fn(() => Promise.resolve());
  global.HTMLVideoElement.prototype.pause = vi.fn();
  global.HTMLVideoElement.prototype.addEventListener = vi.fn();
  global.HTMLVideoElement.prototype.removeEventListener = vi.fn();
}
