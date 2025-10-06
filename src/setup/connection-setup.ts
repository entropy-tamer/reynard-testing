/**
 * Connection Test Setup - For packages that need WebSocket, EventSource, and network APIs
 */

import { vi } from "vitest";
import { setupCoreTest } from "./core-setup.js";

/**
 * Setup for connection packages (reynard-connection, etc.)
 * Includes WebSocket, EventSource, and network-related mocks
 */
export function setupConnectionTest() {
  setupCoreTest();

  // Mock WebSocket
  global.WebSocket = vi.fn().mockImplementation(() => ({
    readyState: WebSocket.CONNECTING,
    url: "",
    protocol: "",
    extensions: "",
    bufferedAmount: 0,
    binaryType: "blob" as BinaryType,
    onopen: null,
    onclose: null,
    onmessage: null,
    onerror: null,
    close: vi.fn(),
    send: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn().mockReturnValue(true),
  })) as any;

  // Mock EventSource
  global.EventSource = vi.fn().mockImplementation(() => ({
    readyState: EventSource.CONNECTING,
    url: "",
    withCredentials: false,
    onopen: null,
    onmessage: null,
    onerror: null,
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn().mockReturnValue(true),
  })) as any;

  // Mock AbortController
  global.AbortController = vi.fn().mockImplementation(() => ({
    signal: {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    },
    abort: vi.fn(),
  }));

  // Mock AbortSignal
  global.AbortSignal = vi.fn().mockImplementation(() => ({
    aborted: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as any;

  // Mock Headers
  global.Headers = vi.fn().mockImplementation(() => ({
    append: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    has: vi.fn(),
    set: vi.fn(),
    forEach: vi.fn(),
    entries: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
  }));

  // Mock Request
  global.Request = vi.fn().mockImplementation(() => ({
    url: "",
    method: "GET",
    headers: new Headers(),
    body: null,
    bodyUsed: false,
    cache: "default",
    credentials: "same-origin",
    destination: "",
    integrity: "",
    keepalive: false,
    mode: "cors",
    redirect: "follow",
    referrer: "",
    referrerPolicy: "",
    signal: new AbortSignal(),
    clone: vi.fn(),
    arrayBuffer: vi.fn(),
    blob: vi.fn(),
    formData: vi.fn(),
    json: vi.fn(),
    text: vi.fn(),
  }));

  // Mock Response
  global.Response = vi.fn().mockImplementation(() => ({
    url: "",
    status: 200,
    statusText: "OK",
    headers: new Headers(),
    ok: true,
    redirected: false,
    type: "basic",
    body: null,
    bodyUsed: false,
    clone: vi.fn(),
    arrayBuffer: vi.fn(),
    blob: vi.fn(),
    formData: vi.fn(),
    json: vi.fn(),
    text: vi.fn(),
  })) as any;
}
