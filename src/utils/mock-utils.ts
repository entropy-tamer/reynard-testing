import { vi } from "vitest";

/**
 * Utility functions for creating and managing mocks in tests
 */

/**
 * Create a mock function with additional properties for testing
 */
export function createMockFn<T extends (...args: any[]) => any>(
  implementation?: T
): T & { mockClear: () => void; mockReset: () => void } {
  const mockFn = vi.fn(implementation) as any;
  // vi.fn() already provides mockClear and mockReset methods
  return mockFn;
}

/**
 * Create a mock object with all methods mocked
 */
export function createMockObject<T extends Record<string, unknown>>(
  methods: (keyof T)[]
): {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K] & {
        mockClear: () => void;
        mockReset: () => void;
        mockReturnValue: (value: ReturnType<T[K]>) => any;
      }
    : T[K];
} {
  const mockObj = {} as any;
  methods.forEach(method => {
    mockObj[method] = createMockFn();
  });
  return mockObj;
}

/**
 * Create a mock API response
 */
export function createMockResponse(
  data: any,
  options: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
  } = {}
) {
  const { status = 200, statusText = "OK", headers = {} } = options;

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: new Headers(headers),
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    blob: vi.fn().mockResolvedValue(new Blob([JSON.stringify(data)])),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    formData: vi.fn().mockResolvedValue(new FormData()),
    clone: vi.fn().mockReturnThis(),
    redirected: false,
    type: "basic",
    url: "",
    body: null,
    bodyUsed: false,
    bytes: vi.fn().mockResolvedValue(new Uint8Array()),
  } as Response;
}

/**
 * Create a mock fetch function
 */
export function createMockFetch(responses: Record<string, unknown> = {}): typeof fetch {
  return vi.fn().mockImplementation((url: string | URL | Request) => {
    const urlString = url.toString();
    const response = responses[urlString] || responses["*"] || { data: {} };

    if (response instanceof Error) {
      return Promise.reject(response);
    }

    return Promise.resolve(createMockResponse((response as any).data, (response as any).options));
  });
}

/**
 * Create a mock WebSocket
 */
export function createMockWebSocket(): WebSocket {
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
}

/**
 * Create a mock EventSource (Server-Sent Events)
 */
export function createMockEventSource(): EventSource {
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
}

/**
 * Create a mock File object
 */
export function createMockFile(
  name: string,
  content: string | Blob,
  options: {
    type?: string;
    lastModified?: number;
  } = {}
): File {
  const { type = "text/plain", lastModified = Date.now() } = options;

  const blob = content instanceof Blob ? content : new Blob([content], { type });

  return Object.assign(blob, {
    name,
    lastModified,
    webkitRelativePath: "",
  }) as File;
}

/**
 * Create a mock FileList
 */
export function createMockFileList(files: File[]): FileList {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      for (const file of files) {
        yield file;
      }
    },
  } as any;

  // Add numeric indices
  files.forEach((file, index) => {
    fileList[index] = file;
  });

  return fileList;
}

/**
 * Create a mock DataTransfer object
 */
export function createMockDataTransfer(files: File[] = [], t?: (key: string) => string): DataTransfer {
  return {
    dropEffect: "none",
    effectAllowed: "none",
    items: {
      length: files.length,
      add: vi.fn(),
      clear: vi.fn(),
      remove: vi.fn(),
      [Symbol.iterator]: function* () {
        for (let i = 0; i < files.length; i++) {
          yield {
            kind: "file",
            type: files[i].type,
            getAsFile: () => files[i],
            getAsString: vi.fn(),
          };
        }
      },
    },
    files: createMockFileList(files),
    types: files.length > 0 ? [t ? t("testing.mockUtils.files") : "Files"] : [],
    getData: vi.fn().mockReturnValue(""),
    setData: vi.fn(),
    clearData: vi.fn(),
    setDragImage: vi.fn(),
  } as any;
}

/**
 * Create a mock IntersectionObserver
 */
export function createMockIntersectionObserver(
  _entries: IntersectionObserverEntry[] = []
): typeof IntersectionObserver {
  const MockIntersectionObserver = vi.fn().mockImplementation(_callback => {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: "",
      thresholds: [],
    };
  });

  MockIntersectionObserver.mockReturnValue = vi.fn();

  return MockIntersectionObserver as any;
}

/**
 * Create a mock ResizeObserver
 */
export function createMockResizeObserver(): typeof ResizeObserver {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as any;
}

/**
 * Create a mock MutationObserver
 */
export function createMockMutationObserver(): typeof MutationObserver {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn().mockReturnValue([]),
  })) as any;
}

/**
 * Create a mock PerformanceObserver
 */
export function createMockPerformanceObserver(): typeof PerformanceObserver {
  return vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn().mockReturnValue([]),
  })) as any;
}

/**
 * Create a mock crypto object
 */
export function createMockCrypto(): Crypto {
  return {
    randomUUID: vi.fn().mockReturnValue("00000000-0000-4000-8000-000000000000"),
    getRandomValues: vi.fn().mockImplementation(array => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }),
    subtle: {} as SubtleCrypto,
  } as any;
}

/**
 * Create a mock matchMedia function
 */
export function createMockMatchMedia(matches: boolean = false): typeof window.matchMedia {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/**
 * Create a mock requestAnimationFrame
 */
export function createMockRequestAnimationFrame(): typeof requestAnimationFrame {
  return vi.fn().mockImplementation((callback: FrameRequestCallback) => {
    setTimeout(() => callback(performance.now()), 0);
    return 1;
  });
}

/**
 * Create a mock cancelAnimationFrame
 */
export function createMockCancelAnimationFrame(): typeof cancelAnimationFrame {
  return vi.fn().mockImplementation((id: number) => {
    clearTimeout(id);
  });
}
