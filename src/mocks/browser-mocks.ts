import { vi } from "vitest";

/**
 * Browser API mocks for testing
 */

/**
 * Mock localStorage
 */
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

/**
 * Mock sessionStorage
 */
export const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

/**
 * Mock matchMedia
 */
export const mockMatchMedia = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

/**
 * Mock ResizeObserver
 */
export const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

/**
 * Mock IntersectionObserver
 */
export const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

/**
 * Mock MutationObserver
 */
export const mockMutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
}));

/**
 * Mock PerformanceObserver
 */
export const mockPerformanceObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
  supportedEntryTypes: [],
}));

/**
 * Mock requestAnimationFrame
 */
export const mockRequestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
  setTimeout(() => cb(performance.now()), 0);
  return 1; // Return a proper frame ID
});

/**
 * Mock cancelAnimationFrame
 */
export const mockCancelAnimationFrame = vi.fn((id: number) => clearTimeout(id));

/**
 * Mock fetch
 */
export const mockFetch = vi.fn((_url?: string) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({}),
    text: vi.fn().mockResolvedValue(""),
    blob: vi.fn().mockResolvedValue(new Blob()),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    formData: vi.fn().mockResolvedValue({}),
    clone: vi.fn().mockReturnThis(),
  })
);

/**
 * Mock WebSocket
 */
export const mockWebSocket = vi.fn().mockImplementation(() => {
  const mockWs = {
    readyState: 0, // CONNECTING
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
  } as any;

  // Simulate connection
  setTimeout(() => {
    mockWs.readyState = 1; // OPEN
    if (mockWs.onopen) {
      mockWs.onopen(new Event("open"));
    }
  }, 0);

  return mockWs;
});

/**
 * Mock EventSource
 */
export const mockEventSource = vi.fn().mockImplementation(() => {
  const mockEs = {
    readyState: 0, // CONNECTING
    url: "",
    withCredentials: false,
    onopen: null,
    onmessage: null,
    onerror: null,
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn().mockReturnValue(true),
  } as any;

  // Simulate connection
  setTimeout(() => {
    mockEs.readyState = 1; // OPEN
    if (mockEs.onopen) {
      mockEs.onopen(new Event("open"));
    }
  }, 0);

  return mockEs;
});

/**
 * Mock crypto
 */
export const mockCrypto = {
  randomUUID: vi.fn().mockReturnValue("00000000-0000-4000-8000-000000000000"),
  getRandomValues: vi.fn().mockImplementation(array => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
  subtle: {} as SubtleCrypto,
};

/**
 * Mock performance
 */
export const mockPerformance = {
  now: vi.fn().mockReturnValue(Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn().mockReturnValue([]),
  getEntriesByName: vi.fn().mockReturnValue([]),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  clearResourceTimings: vi.fn(),
  getEntries: vi.fn().mockReturnValue([]),
  toJSON: vi.fn().mockReturnValue({}),
};

/**
 * Mock URL
 */
export const mockURL = vi.fn().mockImplementation((url: string, base?: string) => {
  // Simple URL parsing without circular dependencies
  let fullUrl = url;
  if (base && !url.startsWith("http") && !url.startsWith("//")) {
    // Parse base URL manually to avoid circular dependency
    const baseMatch = base.match(/^(https?:)\/\/([^\/]+)/) || [];
    const baseOrigin = baseMatch[0] || "http://localhost";
    fullUrl = baseOrigin + (url.startsWith("/") ? "" : "/") + url;
  }

  // Parse URL parts
  const match = fullUrl.match(/^(https?:)\/\/([^\/]+)(\/[^?]*)?(\?[^#]*)?(#.*)?$/) || [];
  const protocol = match[1] || "http:";
  const host = match[2] || "localhost";
  const pathname = match[3] || "/";
  const search = match[4] || "";
  const hash = match[5] || "";

  const urlObj = {
    href: fullUrl,
    origin: `${protocol}//${host}`,
    protocol,
    host,
    hostname: host.split(":")[0],
    port: host.includes(":") ? host.split(":")[1] : "",
    pathname,
    search,
    hash,
    searchParams: mockURLSearchParams(search.slice(1)),
  };
  return urlObj;
});

/**
 * Mock URLSearchParams
 */
export const mockURLSearchParams = vi.fn().mockImplementation((init?: string | string[][] | Record<string, string>) => {
  // Create a simple mock URLSearchParams object to avoid circular references
  const params = new Map<string, string>();
  if (typeof init === "string") {
    // Simple parsing for test purposes
    init.split("&").forEach(pair => {
      const [key, value] = pair.split("=");
      if (key) params.set(key, value || "");
    });
  } else if (Array.isArray(init)) {
    init.forEach(([key, value]) => {
      if (key) params.set(key, value || "");
    });
  } else if (init && typeof init === "object") {
    Object.entries(init).forEach(([key, value]) => {
      params.set(key, value);
    });
  }

  return {
    get: (name: string) => params.get(name) || null,
    set: (name: string, value: string) => params.set(name, value),
    has: (name: string) => params.has(name),
    delete: (name: string) => params.delete(name),
    append: (name: string, value: string) => {
      const existing = params.get(name);
      params.set(name, existing ? `${existing},${value}` : value);
    },
    toString: () =>
      Array.from(params.entries())
        .map(([k, v]) => `${k}=${v}`)
        .join("&"),
    entries: () => params.entries(),
    keys: () => params.keys(),
    values: () => params.values(),
    forEach: (callback: (value: string, key: string) => void) => {
      params.forEach(callback);
    },
  };
});

/**
 * Mock FormData
 */
export const mockFormData = vi.fn().mockImplementation(() => {
  return {
    append: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    set: vi.fn(),
    entries: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    forEach: vi.fn(),
  };
});

/**
 * Mock Headers
 */
export const mockHeaders = vi.fn().mockImplementation((init?: HeadersInit) => {
  const headers = new Map<string, string>();

  // Initialize with provided headers
  if (init) {
    if (Array.isArray(init)) {
      init.forEach(([key, value]) => headers.set(key.toLowerCase(), value));
    } else if (init instanceof Map) {
      init.forEach((value, key) => headers.set(key.toLowerCase(), value));
    } else {
      Object.entries(init).forEach(([key, value]) => headers.set(key.toLowerCase(), value));
    }
  }

  return {
    append: vi.fn((name: string, value: string) => {
      const existing = headers.get(name.toLowerCase());
      headers.set(name.toLowerCase(), existing ? `${existing}, ${value}` : value);
    }),
    delete: vi.fn((name: string) => headers.delete(name.toLowerCase())),
    get: vi.fn((name: string) => headers.get(name.toLowerCase()) || null),
    has: vi.fn((name: string) => headers.has(name.toLowerCase())),
    set: vi.fn((name: string, value: string) => headers.set(name.toLowerCase(), value)),
    entries: vi.fn(() => headers.entries()),
    keys: vi.fn(() => headers.keys()),
    values: vi.fn(() => headers.values()),
    forEach: vi.fn((callback: (value: string, key: string) => void) => {
      headers.forEach((value, key) => callback(value, key));
    }),
  };
});

/**
 * Mock AbortController
 */
export const mockAbortController = vi.fn().mockImplementation(() => {
  return {
    abort: vi.fn(),
    signal: {
      aborted: false,
      reason: undefined,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    },
  };
});

/**
 * Mock AbortSignal
 */
export const mockAbortSignal = vi.fn().mockImplementation(() => {
  return {
    aborted: false,
    reason: undefined,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
});

/**
 * Mock navigator
 */
export const mockNavigator = {
  userAgent: "Mozilla/5.0 (Test Browser)",
  language: "en-US",
  languages: ["en-US", "en"],
  platform: "Test Platform",
  onLine: true,
  cookieEnabled: true,
  doNotTrack: "1",
  maxTouchPoints: 0,
  hardwareConcurrency: 4,
  deviceMemory: 8,
  connection: {
    effectiveType: "4g",
    downlink: 10,
    rtt: 50,
  },
  geolocation: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  mediaDevices: {
    getUserMedia: vi.fn(),
    enumerateDevices: vi.fn(),
  },
  clipboard: {
    readText: vi.fn(),
    writeText: vi.fn(),
    read: vi.fn(),
    write: vi.fn(),
  },
  permissions: {
    query: vi.fn(),
    request: vi.fn(),
  },
  serviceWorker: {
    register: vi.fn(),
    getRegistration: vi.fn(),
    getRegistrations: vi.fn(),
  },
};

/**
 * Mock window
 */
export const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  outerWidth: 1024,
  outerHeight: 768,
  devicePixelRatio: 1,
  screen: {
    width: 1024,
    height: 768,
    availWidth: 1024,
    availHeight: 768,
    colorDepth: 24,
    pixelDepth: 24,
  },
  location: {
    href: "http://localhost:3000/",
    origin: "http://localhost:3000",
    protocol: "http:",
    host: "localhost:3000",
    hostname: "localhost",
    port: "3000",
    pathname: "/",
    search: "",
    hash: "",
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  history: {
    length: 1,
    state: null,
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    pushState: vi.fn(),
    replaceState: vi.fn(),
  },
  document: {
    title: "Test Document",
    body: {
      scrollTop: 0,
      scrollLeft: 0,
    },
    documentElement: {
      scrollTop: 0,
      scrollLeft: 0,
    },
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  open: vi.fn(),
  close: vi.fn(),
  focus: vi.fn(),
  blur: vi.fn(),
  scroll: vi.fn(),
  scrollTo: vi.fn(),
  scrollBy: vi.fn(),
  alert: vi.fn(),
  confirm: vi.fn(),
  prompt: vi.fn(),
  setTimeout: vi.fn(),
  clearTimeout: vi.fn(),
  setInterval: vi.fn(),
  clearInterval: vi.fn(),
  requestAnimationFrame: mockRequestAnimationFrame,
  cancelAnimationFrame: mockCancelAnimationFrame,
  fetch: mockFetch,
  WebSocket: mockWebSocket,
  EventSource: mockEventSource,
  crypto: mockCrypto,
  performance: mockPerformance,
  URL: mockURL,
  URLSearchParams: mockURLSearchParams,
  FormData: mockFormData,
  Headers: mockHeaders,
  AbortController: mockAbortController,
  AbortSignal: mockAbortSignal,
  navigator: mockNavigator,
  localStorage: mockLocalStorage,
  sessionStorage: mockSessionStorage,
  matchMedia: mockMatchMedia,
  ResizeObserver: mockResizeObserver,
  IntersectionObserver: mockIntersectionObserver,
  MutationObserver: mockMutationObserver,
  PerformanceObserver: mockPerformanceObserver,
};

/**
 * Setup all browser mocks
 */
export function setupBrowserMocks() {
  // Mock global objects
  Object.defineProperty(global, "window", {
    value: mockWindow,
    writable: true,
  });

  Object.defineProperty(global, "document", {
    value: mockWindow.document,
    writable: true,
  });

  Object.defineProperty(global, "navigator", {
    value: mockNavigator,
    writable: true,
  });

  Object.defineProperty(global, "localStorage", {
    value: mockLocalStorage,
    writable: true,
  });

  Object.defineProperty(global, "sessionStorage", {
    value: mockSessionStorage,
    writable: true,
  });

  Object.defineProperty(global, "matchMedia", {
    value: mockMatchMedia,
    writable: true,
  });

  Object.defineProperty(global, "fetch", {
    value: mockFetch,
    writable: true,
  });

  Object.defineProperty(global, "WebSocket", {
    value: mockWebSocket,
    writable: true,
  });

  Object.defineProperty(global, "EventSource", {
    value: mockEventSource,
    writable: true,
  });

  Object.defineProperty(global, "crypto", {
    value: mockCrypto,
    writable: true,
  });

  Object.defineProperty(global, "performance", {
    value: mockPerformance,
    writable: true,
  });

  Object.defineProperty(global, "URL", {
    value: mockURL,
    writable: true,
  });

  Object.defineProperty(global, "URLSearchParams", {
    value: mockURLSearchParams,
    writable: true,
  });

  Object.defineProperty(global, "FormData", {
    value: mockFormData,
    writable: true,
  });

  Object.defineProperty(global, "Headers", {
    value: mockHeaders,
    writable: true,
  });

  Object.defineProperty(global, "AbortController", {
    value: mockAbortController,
    writable: true,
  });

  Object.defineProperty(global, "AbortSignal", {
    value: mockAbortSignal,
    writable: true,
  });

  // Mock global functions
  global.ResizeObserver = mockResizeObserver;
  global.IntersectionObserver = mockIntersectionObserver;
  global.MutationObserver = mockMutationObserver;
  global.PerformanceObserver = mockPerformanceObserver as any;
  global.requestAnimationFrame = mockRequestAnimationFrame;
  global.cancelAnimationFrame = mockCancelAnimationFrame;
}

/**
 * Reset all browser mocks
 */
export function resetBrowserMocks() {
  vi.clearAllMocks();
  mockLocalStorage.getItem.mockReturnValue(null);
  mockSessionStorage.getItem.mockReturnValue(null);
  mockMatchMedia.mockReturnValue({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}
