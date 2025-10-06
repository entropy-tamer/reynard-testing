/**
 * Assertion Utilities Test Suite
 *
 * This test suite orchestrates all assertion utility tests by importing
 * and running the specialized test modules for different assertion categories.
 *
 * The test suite is split into focused modules:
 * - Component assertions for SolidJS component testing
 * - Async assertions for promises, functions, and value testing
 * - DOM assertions for element and accessibility testing
 *
 * @module testing/assertion-utils-test
 */

import { describe, it, expect } from "vitest";

// Import all specialized test modules
import "./component-assertions.test";
import "./async-assertions.test";
import "./dom-assertions.test";

describe("Assertion Utilities - Test Orchestrator", () => {
  // This test suite serves as an orchestrator that runs all specialized tests
  // The actual test implementations are in the imported modules above

  it("should run all assertion utility tests", () => {
    // This test ensures the orchestrator runs successfully
    // All actual tests are in the imported modules
    expect(true).toBe(true);
  });
});
