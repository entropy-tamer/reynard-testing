/**
 * Fetch API Mock - Provides comprehensive fetch mocking for tests
 */

import { vi } from "vitest";

/**
 * Mock fetch globally with comprehensive response methods
 */
export function mockFetch() {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(""),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      formData: () => Promise.resolve(new FormData()),
      bytes: () => Promise.resolve(new Uint8Array(0)),
      clone: vi.fn().mockReturnThis(),
      url: "",
      redirected: false,
      type: "basic" as ResponseType,
      body: null,
      bodyUsed: false,
    } as Response)
  ) as any;
}
