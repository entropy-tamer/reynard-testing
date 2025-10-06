import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockRouter, mockContext, createMockSolidResource } from "../mocks/solidjs-mocks.js";

describe("SolidJS Mocks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("mockRouter", () => {
    it("should provide router location information", () => {
      expect(mockRouter.location.pathname).toBe("/");
      expect(mockRouter.location.search).toBe("");
      expect(mockRouter.location.hash).toBe("");
      expect(mockRouter.location.href).toBe("/");
      expect(mockRouter.location.origin).toBe("http://localhost");
      expect(mockRouter.location.protocol).toBe("http:");
      expect(mockRouter.location.host).toBe("localhost");
      expect(mockRouter.location.hostname).toBe("localhost");
      expect(mockRouter.location.port).toBe("");
      expect(mockRouter.location.state).toBeNull();
    });

    it("should provide router methods", () => {
      expect(mockRouter.navigate).toBeDefined();
      expect(typeof mockRouter.navigate).toBe("function");
    });

    it("should provide router state", () => {
      expect(mockRouter.params).toEqual({});
      expect(mockRouter.query).toEqual({});
    });

    it("should be mockable", () => {
      const mockNavigate = vi.fn();
      mockRouter.navigate = mockNavigate;

      mockRouter.navigate("/test");
      expect(mockNavigate).toHaveBeenCalledWith("/test");
    });
  });

  describe("mockContext", () => {
    it("should provide theme information", () => {
      expect(mockContext.theme).toEqual({ name: "light", colors: {} });
    });

    it("should provide notifications array", () => {
      expect(mockContext.notifications).toEqual([]);
    });

    it("should provide notification methods", () => {
      expect(mockContext.addNotification).toBeDefined();
      expect(mockContext.removeNotification).toBeDefined();
      expect(mockContext.clearNotifications).toBeDefined();
      expect(typeof mockContext.addNotification).toBe("function");
      expect(typeof mockContext.removeNotification).toBe("function");
      expect(typeof mockContext.clearNotifications).toBe("function");
    });

    it("should be mockable", () => {
      const mockAddNotification = vi.fn();
      const mockRemoveNotification = vi.fn();
      const mockClearNotifications = vi.fn();

      mockContext.addNotification = mockAddNotification;
      mockContext.removeNotification = mockRemoveNotification;
      mockContext.clearNotifications = mockClearNotifications;

      mockContext.addNotification("test");
      mockContext.removeNotification("test");
      mockContext.clearNotifications();

      expect(mockAddNotification).toHaveBeenCalledWith("test");
      expect(mockRemoveNotification).toHaveBeenCalledWith("test");
      expect(mockClearNotifications).toHaveBeenCalled();
    });
  });

  describe("createMockSolidResource", () => {
    it("should create a mock resource with provided data", () => {
      const testData = { id: 1, name: "Test Resource" };
      const resource = createMockSolidResource(testData);

      expect(resource.loading).toBe(false);
      expect(resource.error).toBeUndefined();
      expect(resource.latest).toEqual(testData);
      expect(resource.state).toBe("ready");
    });

    it("should provide resource methods", () => {
      const testData = { id: 1, name: "Test Resource" };
      const resource = createMockSolidResource(testData);

      expect(resource.mutate).toBeDefined();
      expect(resource.refetch).toBeDefined();
      expect(typeof resource.mutate).toBe("function");
      expect(typeof resource.refetch).toBe("function");
    });

    it("should provide mockable methods", () => {
      const testData = { id: 1, name: "Test Resource" };
      const resource = createMockSolidResource(testData);

      resource.mutate("new data");
      expect(resource.mutate).toHaveBeenCalledWith("new data");
    });

    it("should return data from refetch", async () => {
      const testData = { id: 1, name: "Test Resource" };
      const resource = createMockSolidResource(testData);

      const result = await resource.refetch();
      expect(result).toEqual(testData);
    });

    it("should work with different data types", () => {
      const stringData = "test string";
      const stringResource = createMockSolidResource(stringData);
      expect(stringResource.latest).toBe(stringData);

      const arrayData = [1, 2, 3];
      const arrayResource = createMockSolidResource(arrayData);
      expect(arrayResource.latest).toEqual(arrayData);

      const nullData = null;
      const nullResource = createMockSolidResource(nullData);
      expect(nullResource.latest).toBeNull();

      const undefinedData = undefined;
      const undefinedResource = createMockSolidResource(undefinedData);
      expect(undefinedResource.latest).toBeUndefined();
    });

    it("should maintain consistent state", () => {
      const testData = { id: 1, name: "Test Resource" };
      const resource = createMockSolidResource(testData);

      // State should remain consistent
      expect(resource.state).toBe("ready");
      expect(resource.loading).toBe(false);
      expect(resource.error).toBeUndefined();

      // Methods should not change the state
      resource.mutate("new data");
      expect(resource.state).toBe("ready");
      expect(resource.loading).toBe(false);
      expect(resource.error).toBeUndefined();
    });

    it("should be independent instances", () => {
      const data1 = { id: 1, name: "Resource 1" };
      const data2 = { id: 2, name: "Resource 2" };

      const resource1 = createMockSolidResource(data1);
      const resource2 = createMockSolidResource(data2);

      expect(resource1.latest).toEqual(data1);
      expect(resource2.latest).toEqual(data2);
      expect(resource1).not.toBe(resource2);

      // Mutating one should not affect the other
      resource1.mutate("new data 1");
      expect(resource2.latest).toEqual(data2);
    });

    it("should handle complex data structures", () => {
      const complexData = {
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
        posts: [
          { id: 1, title: "Post 1", content: "Content 1" },
          { id: 2, title: "Post 2", content: "Content 2" },
        ],
        metadata: {
          total: 2,
          page: 1,
          hasMore: false,
        },
      };

      const resource = createMockSolidResource(complexData);

      expect(resource.latest).toEqual(complexData);
      expect(resource.latest.user.name).toBe("John Doe");
      expect(resource.latest.posts).toHaveLength(2);
      expect(resource.latest.metadata.total).toBe(2);
    });

    it("should work with functions as data", () => {
      const functionData = () => "test function";
      const resource = createMockSolidResource(functionData);

      expect(resource.latest).toBe(functionData);
      expect(typeof resource.latest).toBe("function");
    });

    it("should work with class instances", () => {
      class TestClass {
        constructor(public value: string) {}
        getValue() {
          return this.value;
        }
      }

      const instanceData = new TestClass("test");
      const resource = createMockSolidResource(instanceData);

      expect(resource.latest).toBe(instanceData);
      expect(resource.latest.getValue()).toBe("test");
    });
  });
});
