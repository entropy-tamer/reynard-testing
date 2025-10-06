/* eslint-disable @reynard/i18n/no-hardcoded-strings */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockFetch, mockWebSocket, mockEventSource, resetBrowserMocks } from "../mocks/browser-mocks.js";

describe("Network Mocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  describe("mockFetch", () => {
    it("should provide fetch method", () => {
      expect(mockFetch).toBeDefined();
      expect(typeof mockFetch).toBe("function");
    });

    it("should be mockable", () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValue({ error: "Not found" }),
        text: vi.fn().mockResolvedValue("Not found"),
        blob: vi.fn().mockResolvedValue(new Blob()),
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
        formData: vi.fn().mockResolvedValue(new FormData()),
        clone: vi.fn().mockReturnThis(),
      });

      expect(mockFetch).toHaveBeenCalledTimes(0);
    });

    it("should handle successful responses", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ data: "success" }),
        text: vi.fn().mockResolvedValue("success"),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const response = await mockFetch("/api/test");
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    it("should handle error responses", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ error: "Internal server error" }),
        text: vi.fn().mockResolvedValue("Internal server error"),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const response = await mockFetch("/api/error");
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe("mockWebSocket", () => {
    it("should provide WebSocket constructor", () => {
      expect(mockWebSocket).toBeDefined();
      expect(typeof mockWebSocket).toBe("function");
    });

    it("should create WebSocket instances", () => {
      const ws = new mockWebSocket("ws://localhost:8080");
      expect(ws).toBeDefined();
      expect(ws.readyState).toBe(mockWebSocket.CONNECTING);
    });

    it("should provide WebSocket constants", () => {
      expect(mockWebSocket.CONNECTING).toBe(0);
      expect(mockWebSocket.OPEN).toBe(1);
      expect(mockWebSocket.CLOSING).toBe(2);
      expect(mockWebSocket.CLOSED).toBe(3);
    });

    it("should provide WebSocket methods", () => {
      const ws = new mockWebSocket("ws://localhost:8080");
      expect(typeof ws.send).toBe("function");
      expect(typeof ws.close).toBe("function");
      expect(typeof ws.addEventListener).toBe("function");
      expect(typeof ws.removeEventListener).toBe("function");
    });
  });

  describe("mockEventSource", () => {
    it("should provide EventSource constructor", () => {
      expect(mockEventSource).toBeDefined();
      expect(typeof mockEventSource).toBe("function");
    });

    it("should create EventSource instances", () => {
      const es = new mockEventSource("http://localhost:8080/events");
      expect(es).toBeDefined();
      expect(es.readyState).toBe(globalThis.EventSource.CONNECTING);
    });

    it("should provide EventSource constants", () => {
      expect(mockEventSource.CONNECTING).toBe(0);
      expect(mockEventSource.OPEN).toBe(1);
      expect(mockEventSource.CLOSED).toBe(2);
    });

    it("should provide EventSource methods", () => {
      const es = new mockEventSource("http://localhost:8080/events");
      expect(typeof es.close).toBe("function");
      expect(typeof es.addEventListener).toBe("function");
      expect(typeof es.removeEventListener).toBe("function");
    });
  });
});
