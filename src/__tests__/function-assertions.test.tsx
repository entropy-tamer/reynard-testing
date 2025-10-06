import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  expectFunctionNotToBeCalled,
  expectFunctionToBeCalled,
  expectFunctionToBeCalledTimes,
  expectFunctionToBeCalledWith,
} from "../utils/assertion-utils.js";

describe("Function Assertions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("expectFunctionToBeCalled", () => {
    it("should pass when function is called", () => {
      const mockFn = vi.fn();
      mockFn();

      expectFunctionToBeCalled(mockFn);
    });

    it("should pass when function is called multiple times", () => {
      const mockFn = vi.fn();
      mockFn();
      mockFn();
      mockFn();

      expectFunctionToBeCalled(mockFn);
    });

    it("should fail when function is not called", () => {
      const mockFn = vi.fn();

      expect(() => expectFunctionToBeCalled(mockFn)).toThrow();
    });
  });

  describe("expectFunctionNotToBeCalled", () => {
    it("should pass when function is not called", () => {
      const mockFn = vi.fn();

      expectFunctionNotToBeCalled(mockFn);
    });

    it("should fail when function is called", () => {
      const mockFn = vi.fn();
      mockFn();

      expect(() => expectFunctionNotToBeCalled(mockFn)).toThrow();
    });

    it("should fail when function is called multiple times", () => {
      const mockFn = vi.fn();
      mockFn();
      mockFn();

      expect(() => expectFunctionNotToBeCalled(mockFn)).toThrow();
    });
  });

  describe("expectFunctionToBeCalledTimes", () => {
    it("should pass when function is called exact number of times", () => {
      const mockFn = vi.fn();
      mockFn();
      mockFn();

      expectFunctionToBeCalledTimes(mockFn, 2);
    });

    it("should pass when function is called once", () => {
      const mockFn = vi.fn();
      mockFn();

      expectFunctionToBeCalledTimes(mockFn, 1);
    });

    it("should pass when function is not called", () => {
      const mockFn = vi.fn();

      expectFunctionToBeCalledTimes(mockFn, 0);
    });

    it("should fail when function is called wrong number of times", () => {
      const mockFn = vi.fn();
      mockFn();

      expect(() => expectFunctionToBeCalledTimes(mockFn, 2)).toThrow();
    });
  });

  describe("expectFunctionToBeCalledWith", () => {
    it("should pass when function is called with correct arguments", () => {
      const mockFn = vi.fn();
      mockFn("arg1", "arg2");

      expectFunctionToBeCalledWith(mockFn, "arg1", "arg2");
    });

    it("should pass when function is called with object arguments", () => {
      const mockFn = vi.fn();
      const obj = { id: 1, name: "test" };
      mockFn(obj);

      expectFunctionToBeCalledWith(mockFn, obj);
    });

    it("should pass when function is called with array arguments", () => {
      const mockFn = vi.fn();
      const arr = [1, 2, 3];
      mockFn(arr);

      expectFunctionToBeCalledWith(mockFn, arr);
    });

    it("should fail when function is called with wrong arguments", () => {
      const mockFn = vi.fn();
      mockFn("arg1", "arg2");

      expect(() => expectFunctionToBeCalledWith(mockFn, "arg1", "arg3")).toThrow();
    });

    it("should fail when function is not called", () => {
      const mockFn = vi.fn();

      expect(() => expectFunctionToBeCalledWith(mockFn, "arg1")).toThrow();
    });

    it("should pass when function is called with no arguments", () => {
      const mockFn = vi.fn();
      mockFn();

      expectFunctionToBeCalledWith(mockFn);
    });
  });
});
