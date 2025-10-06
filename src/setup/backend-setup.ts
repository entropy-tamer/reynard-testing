/**
 * Backend Test Setup - For packages that need backend server mocking
 */

import { afterAll, beforeAll, beforeEach } from "vitest";
import { setupCoreTest } from "./core-setup.js";

/**
 * Mock backend server for testing
 */
class MockBackendServer {
  private isRunning: boolean = false;

  constructor(_port: number) {
    // Port is stored but not used in this mock implementation
  }

  async start(): Promise<void> {
    this.isRunning = true;
    // Mock server start
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    // Mock server stop
  }

  clearData(): void {
    // Mock data clearing
  }

  get isActive(): boolean {
    return this.isRunning;
  }
}

/**
 * Setup for backend packages that need server mocking
 * Includes mock server setup and API request helpers
 */
export function setupBackendTest(port: number = 3000) {
  setupCoreTest();

  // Global test server instance
  let testServer: MockBackendServer | null = null;

  // Helper function to get or create test server
  const getOrCreateTestServer = async (): Promise<MockBackendServer> => {
    if (!testServer) {
      testServer = new MockBackendServer(port);
      await testServer.start();
      (global as Record<string, unknown>).testServer = testServer;
    }
    return testServer;
  };

  beforeAll(async () => {
    // Start the mock server for testing
    await getOrCreateTestServer();
  }, 30000); // 30 second timeout

  afterAll(async () => {
    // Stop the mock server after all tests
    if (testServer) {
      await testServer.stop();
      testServer = null;
    }
  }, 10000); // 10 second timeout

  beforeEach(async () => {
    // Clear data before each test to ensure isolation
    if (testServer) {
      testServer.clearData();
    }
  });

  // Helper function to make API requests
  const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const url = `http://localhost:${port}/api${endpoint}`;
    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  };

  // Helper function to get test server instance
  const getTestServer = async (): Promise<MockBackendServer> => {
    return await getOrCreateTestServer();
  };

  // Export helpers to global scope for tests
  (global as any).apiRequest = apiRequest;
  (global as any).getTestServer = getTestServer;
}
