/**
 * Main Test Suite for i18n ESLint Plugin
 * Runs all plugin tests in organized modules
 */
/* eslint-disable @reynard/i18n/no-hardcoded-strings */

import { describe, it, expect } from "vitest";

// Import all test modules
import "./i18n-eslint-plugin-ast-parsing.test.js";
import "./i18n-eslint-plugin-real-world.test.js";
import "./i18n-eslint-plugin-edge-cases.test.js";
import "./i18n-eslint-plugin-translation-keys.test.js";
import "./i18n-eslint-plugin-helper-functions.test.js";
import "./i18n-eslint-plugin-positive-detection.test.js";
import "./i18n-eslint-plugin-translation-detection.test.js";
import "./i18n-eslint-plugin-translation-files.test.js";
import "./i18n-eslint-plugin-logical-errors.test.js";

describe("i18n ESLint Plugin - Complete Test Suite", () => {
  // This file serves as the main entry point for all plugin tests
  // Individual test modules are imported above and will run automatically

  it("should have all test modules loaded", () => {
    // This test ensures all modules are properly imported
    expect(true).toBe(true);
  });
});
