/* eslint-disable @reynard/i18n/no-hardcoded-strings */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockCrypto,
  mockHeaders,
  mockURL,
  mockURLSearchParams,
  mockFormData,
  mockNavigator,
  mockPerformance,
  resetBrowserMocks,
} from "../mocks/browser-mocks.js";

describe("Browser API Mocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  describe("mockCrypto", () => {
    it("should provide crypto methods", () => {
      expect(mockCrypto.getRandomValues).toBeDefined();
      expect(mockCrypto.randomUUID).toBeDefined();
      expect(typeof mockCrypto.getRandomValues).toBe("function");
      expect(typeof mockCrypto.randomUUID).toBe("function");
    });

    it("should generate random values", () => {
      const array = new Uint8Array(16);
      const result = mockCrypto.getRandomValues(array);
      expect(result).toBe(array);
    });

    it("should generate UUIDs", () => {
      const uuid = mockCrypto.randomUUID();
      expect(typeof uuid).toBe("string");
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });

  describe("mockHeaders", () => {
    it("should provide Headers constructor", () => {
      expect(mockHeaders).toBeDefined();
      expect(typeof mockHeaders).toBe("function");
    });

    it("should create Headers instances", () => {
      const headers = new mockHeaders();
      expect(headers).toBeDefined();
      expect(typeof headers.get).toBe("function");
      expect(typeof headers.set).toBe("function");
      expect(typeof headers.has).toBe("function");
      expect(typeof headers.delete).toBe("function");
    });

    it("should handle header operations", () => {
      const headers = new mockHeaders();
      headers.set("Content-Type", "application/json");
      expect(headers.get("Content-Type")).toBe("application/json");
      expect(headers.has("Content-Type")).toBe(true);

      headers.delete("Content-Type");
      expect(headers.has("Content-Type")).toBe(false);
    });
  });

  describe("mockURL", () => {
    it("should provide URL constructor", () => {
      expect(mockURL).toBeDefined();
      expect(typeof mockURL).toBe("function");
    });

    it("should create URL instances", () => {
      const url = new mockURL("https://example.com/path?query=value");
      expect(url).toBeDefined();
      expect(url.href).toBe("https://example.com/path?query=value");
      expect(url.protocol).toBe("https:");
      expect(url.hostname).toBe("example.com");
      expect(url.pathname).toBe("/path");
      expect(url.search).toBe("?query=value");
    });
  });

  describe("mockURLSearchParams", () => {
    it("should provide URLSearchParams constructor", () => {
      expect(mockURLSearchParams).toBeDefined();
      expect(typeof mockURLSearchParams).toBe("function");
    });

    it("should create URLSearchParams instances", () => {
      const params = new mockURLSearchParams("key=value&other=test");
      expect(params).toBeDefined();
      expect(params.get("key")).toBe("value");
      expect(params.get("other")).toBe("test");
    });

    it("should handle parameter operations", () => {
      const params = new mockURLSearchParams();
      params.set("newKey", "newValue");
      expect(params.get("newKey")).toBe("newValue");

      params.delete("newKey");
      expect(params.get("newKey")).toBeNull();
    });
  });

  describe("mockFormData", () => {
    it("should provide FormData constructor", () => {
      expect(mockFormData).toBeDefined();
      expect(typeof mockFormData).toBe("function");
    });

    it("should create FormData instances", () => {
      const formData = new mockFormData();
      expect(formData).toBeDefined();
      expect(typeof formData.append).toBe("function");
      expect(typeof formData.get).toBe("function");
      expect(typeof formData.has).toBe("function");
      expect(typeof formData.delete).toBe("function");
    });

    it("should handle form data operations", () => {
      const formData = new mockFormData();
      formData.append("field", "value");
      expect(formData.get("field")).toBe("value");
      expect(formData.has("field")).toBe(true);

      formData.delete("field");
      expect(formData.has("field")).toBe(false);
    });
  });

  describe("mockNavigator", () => {
    it("should provide navigator properties", () => {
      expect(mockNavigator.userAgent).toBeDefined();
      expect(mockNavigator.language).toBeDefined();
      expect(mockNavigator.onLine).toBeDefined();
    });

    it("should be mockable", () => {
      mockNavigator.userAgent = "Test User Agent";
      mockNavigator.language = "en-US";
      mockNavigator.onLine = true;

      expect(mockNavigator.userAgent).toBe("Test User Agent");
      expect(mockNavigator.language).toBe("en-US");
      expect(mockNavigator.onLine).toBe(true);
    });
  });

  describe("mockPerformance", () => {
    it("should provide performance methods", () => {
      expect(mockPerformance.now).toBeDefined();
      expect(typeof mockPerformance.now).toBe("function");
    });

    it("should return timestamps", () => {
      const timestamp = mockPerformance.now();
      expect(typeof timestamp).toBe("number");
      expect(timestamp).toBeGreaterThanOrEqual(0);
    });
  });
});
