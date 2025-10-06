import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  expectArrayToContain,
  expectArrayToHaveLength,
  expectObjectToHaveProperties,
  expectObjectToHaveValues,
  expectStringToContain,
  expectStringToMatch,
  expectValueToBeApproximately,
  expectValueToBeInRange,
} from "../utils/assertion-utils.js";

describe("Value Assertions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Array Assertions", () => {
    describe("expectArrayToContain", () => {
      it("should pass when array contains value", () => {
        const arr = [1, 2, 3, 4, 5];
        expectArrayToContain(arr, 3);
      });

      it("should pass when array contains string", () => {
        const arr = ["apple", "banana", "cherry"];
        expectArrayToContain(arr, "banana");
      });

      it("should pass when array contains object", () => {
        const obj = { id: 1, name: "test" };
        const arr = [obj, { id: 2, name: "test2" }];
        expectArrayToContain(arr, obj);
      });

      it("should fail when array does not contain value", () => {
        const arr = [1, 2, 3, 4, 5];
        expect(() => expectArrayToContain(arr, 6)).toThrow();
      });

      it("should fail when array is empty", () => {
        const arr: number[] = [];
        expect(() => expectArrayToContain(arr, 1)).toThrow();
      });
    });

    describe("expectArrayToHaveLength", () => {
      it("should pass when array has correct length", () => {
        const arr = [1, 2, 3];
        expectArrayToHaveLength(arr, 3);
      });

      it("should pass when array is empty", () => {
        const arr: number[] = [];
        expectArrayToHaveLength(arr, 0);
      });

      it("should fail when array has wrong length", () => {
        const arr = [1, 2, 3];
        expect(() => expectArrayToHaveLength(arr, 2)).toThrow();
      });
    });
  });

  describe("Object Assertions", () => {
    describe("expectObjectToHaveProperties", () => {
      it("should pass when object has all properties", () => {
        const obj = { id: 1, name: "test", active: true };
        expectObjectToHaveProperties(obj, ["id", "name", "active"]);
      });

      it("should pass when object has single property", () => {
        const obj = { id: 1 };
        expectObjectToHaveProperties(obj, ["id"]);
      });

      it("should fail when object is missing properties", () => {
        const obj = { id: 1, name: "test" };
        expect(() => expectObjectToHaveProperties(obj, ["id", "name", "active"])).toThrow();
      });

      it("should fail when object is empty", () => {
        const obj = {};
        expect(() => expectObjectToHaveProperties(obj, ["id"])).toThrow();
      });
    });

    describe("expectObjectToHaveValues", () => {
      it("should pass when object has all values", () => {
        const obj = { id: 1, name: "test", active: true };
        expectObjectToHaveValues(obj, [1, "test", true]);
      });

      it("should pass when object has single value", () => {
        const obj = { id: 1 };
        expectObjectToHaveValues(obj, [1]);
      });

      it("should fail when object is missing values", () => {
        const obj = { id: 1, name: "test" };
        expect(() => expectObjectToHaveValues(obj, [1, "test", true])).toThrow();
      });

      it("should fail when object is empty", () => {
        const obj = {};
        expect(() => expectObjectToHaveValues(obj, [1])).toThrow();
      });
    });
  });

  describe("String Assertions", () => {
    describe("expectStringToContain", () => {
      it("should pass when string contains substring", () => {
        const str = "Hello World";
        expectStringToContain(str, "World");
      });

      it("should pass when string contains exact match", () => {
        const str = "Hello World";
        expectStringToContain(str, "Hello World");
      });

      it("should fail when string does not contain substring", () => {
        const str = "Hello World";
        expect(() => expectStringToContain(str, "Universe")).toThrow();
      });

      it("should fail when string is empty", () => {
        const str = "";
        expect(() => expectStringToContain(str, "test")).toThrow();
      });
    });

    describe("expectStringToMatch", () => {
      it("should pass when string matches regex", () => {
        const str = "test@example.com";
        expectStringToMatch(str, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });

      it("should pass when string matches simple pattern", () => {
        const str = "Hello World";
        expectStringToMatch(str, /Hello/);
      });

      it("should fail when string does not match regex", () => {
        const str = "invalid-email";
        expect(() => expectStringToMatch(str, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).toThrow();
      });

      it("should fail when string is empty", () => {
        const str = "";
        expect(() => expectStringToMatch(str, /test/)).toThrow();
      });
    });
  });

  describe("Numeric Assertions", () => {
    describe("expectValueToBeApproximately", () => {
      it("should pass when values are approximately equal", () => {
        expectValueToBeApproximately(3.14159, 3.14, 0.01);
      });

      it("should pass when values are exactly equal", () => {
        expectValueToBeApproximately(5, 5, 0);
      });

      it("should fail when values are not approximately equal", () => {
        expect(() => expectValueToBeApproximately(3.14159, 3.0, 0.01)).toThrow();
      });

      it("should pass with large tolerance", () => {
        expectValueToBeApproximately(10, 5, 10);
      });
    });

    describe("expectValueToBeInRange", () => {
      it("should pass when value is in range", () => {
        expectValueToBeInRange(5, 1, 10);
      });

      it("should pass when value is at lower bound", () => {
        expectValueToBeInRange(1, 1, 10);
      });

      it("should pass when value is at upper bound", () => {
        expectValueToBeInRange(10, 1, 10);
      });

      it("should fail when value is below range", () => {
        expect(() => expectValueToBeInRange(0, 1, 10)).toThrow();
      });

      it("should fail when value is above range", () => {
        expect(() => expectValueToBeInRange(11, 1, 10)).toThrow();
      });
    });
  });
});
