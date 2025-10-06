import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMockCancelAnimationFrame,
  createMockCrypto,
  createMockDataTransfer,
  createMockEventSource,
  createMockFetch,
  createMockFile,
  createMockFileList,
  createMockFn,
  createMockIntersectionObserver,
  createMockMatchMedia,
  createMockMutationObserver,
  createMockObject,
  createMockPerformanceObserver,
  createMockRequestAnimationFrame,
  createMockResizeObserver,
  createMockResponse,
  createMockWebSocket,
} from "../utils/mock-utils.js";

describe("Mock Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createMockFn", () => {
    it("should create a mock function with additional properties", () => {
      const mockFn = createMockFn();

      expect(mockFn).toBeDefined();
      expect(mockFn.mockClear).toBeDefined();
      expect(mockFn.mockReset).toBeDefined();
      expect(typeof mockFn.mockClear).toBe("function");
      expect(typeof mockFn.mockReset).toBe("function");
    });

    it("should create a mock function with implementation", () => {
      const implementation = (x: number) => x * 2;
      const mockFn = createMockFn(implementation);

      expect(mockFn(5)).toBe(10);
    });

    it("should allow clearing and resetting", () => {
      const mockFn = createMockFn();
      mockFn("test");

      expect(mockFn).toHaveBeenCalledWith("test");

      mockFn.mockClear();
      expect(mockFn).not.toHaveBeenCalled();

      mockFn.mockReset();
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe("createMockObject", () => {
    it("should create a mock object with specified methods", () => {
      const mockObj = createMockObject<{
        method1: () => void;
        method2: (x: number) => number;
      }>(["method1", "method2"]);

      expect(mockObj.method1).toBeDefined();
      expect(mockObj.method2).toBeDefined();
      expect(typeof mockObj.method1).toBe("function");
      expect(typeof mockObj.method2).toBe("function");
    });

    it("should create mock functions for each method", () => {
      const mockObj = createMockObject<{ test: () => string }>(["test"]);

      mockObj.test.mockReturnValue("mocked");
      expect(mockObj.test()).toBe("mocked");
    });
  });

  describe("createMockResponse", () => {
    it("should create a mock response with default options", () => {
      const data = { message: "test" };
      const response = createMockResponse(data);

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
      expect(response.json).toBeDefined();
      expect(response.text).toBeDefined();
      expect(response.blob).toBeDefined();
    });

    it("should create a mock response with custom options", () => {
      const data = { error: "not found" };
      const response = createMockResponse(data, {
        status: 404,
        statusText: "Not Found",
        headers: { "Content-Type": "application/json" },
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(response.statusText).toBe("Not Found");
      expect(response.headers.get("Content-Type")).toBe("application/json");
    });

    it("should set ok based on status code", () => {
      const successResponse = createMockResponse({}, { status: 200 });
      const errorResponse = createMockResponse({}, { status: 400 });

      expect(successResponse.ok).toBe(true);
      expect(errorResponse.ok).toBe(false);
    });

    it("should provide mock methods that return promises", async () => {
      const data = { test: "data" };
      const response = createMockResponse(data);

      const jsonResult = await response.json();
      const textResult = await response.text();

      expect(jsonResult).toEqual(data);
      expect(textResult).toBe(JSON.stringify(data));
    });
  });

  describe("createMockFetch", () => {
    it("should create a mock fetch function", () => {
      const mockFetch = createMockFetch();

      expect(typeof mockFetch).toBe("function");
    });

    it("should return responses for configured URLs", async () => {
      const responses = {
        "/api/test": { data: { message: "test" } },
        "*": { data: { default: "response" } },
      };
      const mockFetch = createMockFetch(responses);

      const response1 = await mockFetch("/api/test");
      const response2 = await mockFetch("/api/other");

      expect(response1.ok).toBe(true);
      expect(response2.ok).toBe(true);
    });

    it("should reject with error when configured", async () => {
      const responses = {
        "/api/error": new Error("Network error"),
      };
      const mockFetch = createMockFetch(responses);

      await expect(mockFetch("/api/error")).rejects.toThrow("Network error");
    });

    it("should handle URL objects", async () => {
      const responses = {
        "http://example.com/test": { data: { message: "test" } },
      };
      const mockFetch = createMockFetch(responses);

      const response = await mockFetch(new URL("http://example.com/test"));
      expect(response.ok).toBe(true);
    });
  });

  describe("createMockWebSocket", () => {
    it("should create a mock WebSocket", () => {
      const mockWs = createMockWebSocket();

      expect(mockWs.readyState).toBe(0); // CONNECTING
      expect(mockWs.close).toBeDefined();
      expect(mockWs.send).toBeDefined();
      expect(mockWs.addEventListener).toBeDefined();
      expect(mockWs.removeEventListener).toBeDefined();
    });

    it("should simulate connection after creation", async () => {
      const mockWs = createMockWebSocket();

      await new Promise<void>(resolve => {
        mockWs.onopen = event => {
          expect(mockWs.readyState).toBe(1); // OPEN
          expect(event.type).toBe("open");
          resolve();
        };
      });
    });

    it("should provide all required WebSocket properties", () => {
      const mockWs = createMockWebSocket();

      expect(mockWs.url).toBeDefined();
      expect(mockWs.protocol).toBeDefined();
      expect(mockWs.extensions).toBeDefined();
      expect(mockWs.bufferedAmount).toBeDefined();
      expect(mockWs.binaryType).toBeDefined();
    });
  });

  describe("createMockEventSource", () => {
    it("should create a mock EventSource", () => {
      const mockEs = createMockEventSource();

      expect(mockEs.readyState).toBe(0); // CONNECTING
      expect(mockEs.close).toBeDefined();
      expect(mockEs.addEventListener).toBeDefined();
      expect(mockEs.removeEventListener).toBeDefined();
    });

    it("should simulate connection after creation", async () => {
      const mockEs = createMockEventSource();

      await new Promise<void>(resolve => {
        mockEs.onopen = event => {
          expect(mockEs.readyState).toBe(1); // OPEN
          expect(event.type).toBe("open");
          resolve();
        };
      });
    });

    it("should provide all required EventSource properties", () => {
      const mockEs = createMockEventSource();

      expect(mockEs.url).toBeDefined();
      expect(mockEs.withCredentials).toBeDefined();
    });
  });

  describe("createMockFile", () => {
    it("should create a mock File with string content", () => {
      const file = createMockFile("test.txt", "Hello World");

      expect(file.name).toBe("test.txt");
      expect(file.lastModified).toBeDefined();
      expect(file.webkitRelativePath).toBe("");
    });

    it("should create a mock File with Blob content", () => {
      const blob = new Blob(["Hello World"], { type: "text/plain" });
      const file = createMockFile("test.txt", blob);

      expect(file.name).toBe("test.txt");
      expect(file.lastModified).toBeDefined();
    });

    it("should create a mock File with custom options", () => {
      const file = createMockFile("test.txt", "Hello World", {
        type: "text/html",
        lastModified: 1234567890,
      });

      expect(file.name).toBe("test.txt");
      expect(file.lastModified).toBe(1234567890);
    });
  });

  describe("createMockFileList", () => {
    it("should create a mock FileList", () => {
      const files = [createMockFile("file1.txt", "content1"), createMockFile("file2.txt", "content2")];
      const fileList = createMockFileList(files);

      expect(fileList.length).toBe(2);
      expect(fileList.item(0)).toBe(files[0]);
      expect(fileList.item(1)).toBe(files[1]);
      expect(fileList.item(2)).toBeNull();
    });

    it("should support iteration", () => {
      const files = [createMockFile("file1.txt", "content1"), createMockFile("file2.txt", "content2")];
      const fileList = createMockFileList(files);

      const iteratedFiles = Array.from(fileList);
      expect(iteratedFiles).toEqual(files);
    });

    it("should support numeric indexing", () => {
      const files = [createMockFile("file1.txt", "content1"), createMockFile("file2.txt", "content2")];
      const fileList = createMockFileList(files);

      expect(fileList[0]).toBe(files[0]);
      expect(fileList[1]).toBe(files[1]);
    });
  });

  describe("createMockDataTransfer", () => {
    it("should create a mock DataTransfer", () => {
      const files = [createMockFile("test.txt", "content")];
      const dataTransfer = createMockDataTransfer(files);

      expect(dataTransfer.dropEffect).toBe("none");
      expect(dataTransfer.effectAllowed).toBe("none");
      expect(dataTransfer.files).toBeDefined();
      expect(dataTransfer.types).toEqual(["Files"]);
    });

    it("should create a mock DataTransfer with no files", () => {
      const dataTransfer = createMockDataTransfer();

      expect(dataTransfer.files.length).toBe(0);
      expect(dataTransfer.types).toEqual([]);
    });

    it("should provide mock methods", () => {
      const dataTransfer = createMockDataTransfer();

      expect(dataTransfer.getData).toBeDefined();
      expect(dataTransfer.setData).toBeDefined();
      expect(dataTransfer.clearData).toBeDefined();
      expect(dataTransfer.setDragImage).toBeDefined();
    });

    it("should provide mock items", () => {
      const files = [createMockFile("test.txt", "content")];
      const dataTransfer = createMockDataTransfer(files);

      expect(dataTransfer.items.length).toBe(1);
      expect(dataTransfer.items.add).toBeDefined();
      expect(dataTransfer.items.clear).toBeDefined();
      expect(dataTransfer.items.remove).toBeDefined();
    });
  });

  describe("createMockIntersectionObserver", () => {
    it("should create a mock IntersectionObserver", () => {
      const MockIntersectionObserver = createMockIntersectionObserver();
      const observer = new MockIntersectionObserver(() => {});

      expect(observer.observe).toBeDefined();
      expect(observer.unobserve).toBeDefined();
      expect(observer.disconnect).toBeDefined();
      expect(observer.root).toBeNull();
      expect(observer.rootMargin).toBe("");
      expect(observer.thresholds).toEqual([]);
    });

    it("should be callable as constructor", () => {
      const MockIntersectionObserver = createMockIntersectionObserver();

      expect(() => new MockIntersectionObserver(() => {})).not.toThrow();
    });
  });

  describe("createMockResizeObserver", () => {
    it("should create a mock ResizeObserver", () => {
      const MockResizeObserver = createMockResizeObserver();
      const observer = new MockResizeObserver(() => {});

      expect(observer.observe).toBeDefined();
      expect(observer.unobserve).toBeDefined();
      expect(observer.disconnect).toBeDefined();
    });

    it("should be callable as constructor", () => {
      const MockResizeObserver = createMockResizeObserver();

      expect(() => new MockResizeObserver(() => {})).not.toThrow();
    });
  });

  describe("createMockMutationObserver", () => {
    it("should create a mock MutationObserver", () => {
      const MockMutationObserver = createMockMutationObserver();
      const observer = new MockMutationObserver(() => {});

      expect(observer.observe).toBeDefined();
      expect(observer.disconnect).toBeDefined();
      expect(observer.takeRecords).toBeDefined();
    });

    it("should return empty records from takeRecords", () => {
      const MockMutationObserver = createMockMutationObserver();
      const observer = new MockMutationObserver(() => {});

      expect(observer.takeRecords()).toEqual([]);
    });
  });

  describe("createMockPerformanceObserver", () => {
    it("should create a mock PerformanceObserver", () => {
      const MockPerformanceObserver = createMockPerformanceObserver();
      const observer = new MockPerformanceObserver(() => {});

      expect(observer.observe).toBeDefined();
      expect(observer.disconnect).toBeDefined();
      expect(observer.takeRecords).toBeDefined();
    });

    it("should return empty records from takeRecords", () => {
      const MockPerformanceObserver = createMockPerformanceObserver();
      const observer = new MockPerformanceObserver(() => {});

      expect(observer.takeRecords()).toEqual([]);
    });
  });

  describe("createMockCrypto", () => {
    it("should create a mock crypto object", () => {
      const mockCrypto = createMockCrypto();

      expect(mockCrypto.randomUUID).toBeDefined();
      expect(mockCrypto.getRandomValues).toBeDefined();
      expect(mockCrypto.subtle).toBeDefined();
    });

    it("should generate predictable UUID", () => {
      const mockCrypto = createMockCrypto();

      expect(mockCrypto.randomUUID()).toBe("00000000-0000-4000-8000-000000000000");
    });

    it("should fill array with random values", () => {
      const mockCrypto = createMockCrypto();
      const array = new Uint8Array(4);

      const result = mockCrypto.getRandomValues(array);

      expect(result).toBe(array);
      expect(array.length).toBe(4);
    });
  });

  describe("createMockMatchMedia", () => {
    it("should create a mock matchMedia function", () => {
      const mockMatchMedia = createMockMatchMedia();

      expect(typeof mockMatchMedia).toBe("function");
    });

    it("should return MediaQueryList with default matches=false", () => {
      const mockMatchMedia = createMockMatchMedia();
      const result = mockMatchMedia("(min-width: 768px)");

      expect(result.matches).toBe(false);
      expect(result.media).toBe("(min-width: 768px)");
      expect(result.onchange).toBeNull();
    });

    it("should return MediaQueryList with custom matches value", () => {
      const mockMatchMedia = createMockMatchMedia(true);
      const result = mockMatchMedia("(min-width: 768px)");

      expect(result.matches).toBe(true);
    });

    it("should provide mock methods", () => {
      const mockMatchMedia = createMockMatchMedia();
      const result = mockMatchMedia("(min-width: 768px)");

      expect(result.addListener).toBeDefined();
      expect(result.removeListener).toBeDefined();
      expect(result.addEventListener).toBeDefined();
      expect(result.removeEventListener).toBeDefined();
      expect(result.dispatchEvent).toBeDefined();
    });
  });

  describe("createMockRequestAnimationFrame", () => {
    it("should create a mock requestAnimationFrame function", () => {
      const mockRAF = createMockRequestAnimationFrame();

      expect(typeof mockRAF).toBe("function");
    });

    it("should call callback asynchronously", async () => {
      const mockRAF = createMockRequestAnimationFrame();

      await new Promise<void>(resolve => {
        mockRAF(timestamp => {
          expect(typeof timestamp).toBe("number");
          resolve();
        });
      });
    });

    it("should return a number", () => {
      const mockRAF = createMockRequestAnimationFrame();

      const id = mockRAF(() => {});
      expect(typeof id).toBe("number");
    });
  });

  describe("createMockCancelAnimationFrame", () => {
    it("should create a mock cancelAnimationFrame function", () => {
      const mockCAF = createMockCancelAnimationFrame();

      expect(typeof mockCAF).toBe("function");
    });

    it("should not throw when called", () => {
      const mockCAF = createMockCancelAnimationFrame();

      expect(() => mockCAF(1)).not.toThrow();
    });
  });
});
