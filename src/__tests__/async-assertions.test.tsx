/**
 * Async Assertions Test Suite
 * Tests for async/promise-specific assertion utilities
 */

import { describe, it, expect } from "vitest";

describe("Async Assertions", () => {
  it("should handle resolved promises", async () => {
    const promise = Promise.resolve("test value");
    await expect(promise).resolves.toBe("test value");
  });

  it("should handle rejected promises", async () => {
    const promise = Promise.reject(new Error("test error"));
    await expect(promise).rejects.toThrow("test error");
  });

  it("should handle async functions", async () => {
    const asyncFunction = async () => {
      return "async result";
    };

    const result = await asyncFunction();
    expect(result).toBe("async result");
  });
});
