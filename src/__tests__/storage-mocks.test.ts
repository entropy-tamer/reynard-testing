/* eslint-disable @reynard/i18n/no-hardcoded-strings */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockLocalStorage, mockSessionStorage, resetBrowserMocks } from "../mocks/browser-mocks.js";

describe("Storage Mocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  describe("mockLocalStorage", () => {
    it("should provide localStorage methods", () => {
      expect(mockLocalStorage.getItem).toBeDefined();
      expect(mockLocalStorage.setItem).toBeDefined();
      expect(mockLocalStorage.removeItem).toBeDefined();
      expect(mockLocalStorage.clear).toBeDefined();
      expect(mockLocalStorage.key).toBeDefined();
      expect(mockLocalStorage.length).toBe(0);
    });

    it("should be mockable", () => {
      const mockGetItem = vi.fn().mockReturnValue("test-value");
      const mockSetItem = vi.fn();
      const mockRemoveItem = vi.fn();
      const mockClear = vi.fn();
      const mockKey = vi.fn().mockReturnValue("test-key");

      mockLocalStorage.getItem = mockGetItem;
      mockLocalStorage.setItem = mockSetItem;
      mockLocalStorage.removeItem = mockRemoveItem;
      mockLocalStorage.clear = mockClear;
      mockLocalStorage.key = mockKey;

      expect(mockLocalStorage.getItem("test-key")).toBe("test-value");
      expect(mockGetItem).toHaveBeenCalledWith("test-key");

      mockLocalStorage.setItem("key", "value");
      expect(mockSetItem).toHaveBeenCalledWith("key", "value");

      mockLocalStorage.removeItem("key");
      expect(mockRemoveItem).toHaveBeenCalledWith("key");

      mockLocalStorage.clear();
      expect(mockClear).toHaveBeenCalled();

      expect(mockLocalStorage.key(0)).toBe("test-key");
      expect(mockKey).toHaveBeenCalledWith(0);
    });

    it("should handle storage operations", () => {
      mockLocalStorage.setItem("test-key", "test-value");
      expect(mockLocalStorage.getItem("test-key")).toBe("test-value");
      expect(mockLocalStorage.length).toBe(1);

      mockLocalStorage.removeItem("test-key");
      expect(mockLocalStorage.getItem("test-key")).toBeNull();
      expect(mockLocalStorage.length).toBe(0);
    });
  });

  describe("mockSessionStorage", () => {
    it("should provide sessionStorage methods", () => {
      expect(mockSessionStorage.getItem).toBeDefined();
      expect(mockSessionStorage.setItem).toBeDefined();
      expect(mockSessionStorage.removeItem).toBeDefined();
      expect(mockSessionStorage.clear).toBeDefined();
      expect(mockSessionStorage.key).toBeDefined();
      expect(mockSessionStorage.length).toBe(0);
    });

    it("should be mockable", () => {
      const mockGetItem = vi.fn().mockReturnValue("session-value");
      const mockSetItem = vi.fn();
      const mockRemoveItem = vi.fn();
      const mockClear = vi.fn();
      const mockKey = vi.fn().mockReturnValue("session-key");

      mockSessionStorage.getItem = mockGetItem;
      mockSessionStorage.setItem = mockSetItem;
      mockSessionStorage.removeItem = mockRemoveItem;
      mockSessionStorage.clear = mockClear;
      mockSessionStorage.key = mockKey;

      expect(mockSessionStorage.getItem("session-key")).toBe("session-value");
      expect(mockGetItem).toHaveBeenCalledWith("session-key");

      mockSessionStorage.setItem("key", "value");
      expect(mockSetItem).toHaveBeenCalledWith("key", "value");

      mockSessionStorage.removeItem("key");
      expect(mockRemoveItem).toHaveBeenCalledWith("key");

      mockSessionStorage.clear();
      expect(mockClear).toHaveBeenCalled();

      expect(mockSessionStorage.key(0)).toBe("session-key");
      expect(mockKey).toHaveBeenCalledWith(0);
    });

    it("should handle session storage operations", () => {
      mockSessionStorage.setItem("session-key", "session-value");
      expect(mockSessionStorage.getItem("session-key")).toBe("session-value");
      expect(mockSessionStorage.length).toBe(1);

      mockSessionStorage.removeItem("session-key");
      expect(mockSessionStorage.getItem("session-key")).toBeNull();
      expect(mockSessionStorage.length).toBe(0);
    });
  });
});
