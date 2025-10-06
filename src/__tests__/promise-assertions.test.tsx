import { beforeEach, describe, expect, it, vi } from "vitest";
import { expectPromiseToReject, expectPromiseToResolve } from "../utils/assertion-utils.js";

describe("Promise Assertions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("expectPromiseToResolve", () => {
    it("should resolve successfully", async () => {
      const promise = Promise.resolve("test value");

      const result = await expectPromiseToResolve(promise);
      expect(result).toBe("test value");
    });

    it("should resolve with object", async () => {
      const promise = Promise.resolve({ id: 1, name: "test" });

      const result = await expectPromiseToResolve(promise);
      expect(result).toEqual({ id: 1, name: "test" });
    });

    it("should resolve with array", async () => {
      const promise = Promise.resolve([1, 2, 3]);

      const result = await expectPromiseToResolve(promise);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should resolve with null", async () => {
      const promise = Promise.resolve(null);

      const result = await expectPromiseToResolve(promise);
      expect(result).toBeNull();
    });

    it("should resolve with undefined", async () => {
      const promise = Promise.resolve(undefined);

      const result = await expectPromiseToResolve(promise);
      expect(result).toBeUndefined();
    });

    it("should resolve with number", async () => {
      const promise = Promise.resolve(42);

      const result = await expectPromiseToResolve(promise);
      expect(result).toBe(42);
    });

    it("should resolve with boolean", async () => {
      const promise = Promise.resolve(true);

      const result = await expectPromiseToResolve(promise);
      expect(result).toBe(true);
    });

    it("should resolve with string", async () => {
      const promise = Promise.resolve("hello world");

      const result = await expectPromiseToResolve(promise);
      expect(result).toBe("hello world");
    });
  });

  describe("expectPromiseToReject", () => {
    it("should reject with error", async () => {
      const promise = Promise.reject(new Error("test error"));

      const error = await expectPromiseToReject(promise);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("test error");
    });

    it("should reject with string", async () => {
      const promise = Promise.reject("test rejection");

      const error = await expectPromiseToReject(promise);
      expect(error).toBe("test rejection");
    });

    it("should reject with object", async () => {
      const promise = Promise.reject({ code: 500, message: "server error" });

      const error = await expectPromiseToReject(promise);
      expect(error).toEqual({ code: 500, message: "server error" });
    });

    it("should reject with null", async () => {
      const promise = Promise.reject(null);

      const error = await expectPromiseToReject(promise);
      expect(error).toBeNull();
    });

    it("should reject with undefined", async () => {
      const promise = Promise.reject(undefined);

      const error = await expectPromiseToReject(promise);
      expect(error).toBeUndefined();
    });

    it("should reject with number", async () => {
      const promise = Promise.reject(404);

      const error = await expectPromiseToReject(promise);
      expect(error).toBe(404);
    });

    it("should reject with boolean", async () => {
      const promise = Promise.reject(false);

      const error = await expectPromiseToReject(promise);
      expect(error).toBe(false);
    });
  });
});
