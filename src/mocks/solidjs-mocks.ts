import { vi } from "vitest";

/**
 * SolidJS-specific mocks for testing
 */

/**
 * Mock SolidJS router
 */
export const mockRouter = {
  location: {
    pathname: "/",
    search: "",
    hash: "",
    href: "/",
    origin: "http://localhost",
    protocol: "http:",
    host: "localhost",
    hostname: "localhost",
    port: "",
    state: null,
  },
  navigate: vi.fn(),
  params: {},
  query: {},
};

/**
 * Mock SolidJS context
 */
export const mockContext = {
  theme: { name: "light", colors: {} },
  notifications: [],
  addNotification: vi.fn(),
  removeNotification: vi.fn(),
  clearNotifications: vi.fn(),
};

/**
 * Mock SolidJS resource
 */
export function createMockSolidResource<T>(data: T) {
  return {
    loading: false,
    error: undefined,
    latest: data,
    state: "ready" as const,
    mutate: vi.fn(),
    refetch: vi.fn().mockResolvedValue(data),
  };
}
