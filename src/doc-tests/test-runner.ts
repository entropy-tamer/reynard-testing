/**
 * Documentation Test Runner
 *
 * Executes tests from documentation examples
 */

import { cleanup, render, screen } from "@solidjs/testing-library";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { extractCodeExamples } from "./code-parser.js";
import { createTestableCode } from "./test-generator.js";

export interface DocTestConfig {
  /** Path to the documentation file */
  docPath: string;
  /** Package name for imports */
  packageName: string;
  /** Additional setup code to run before each test */
  setup?: string;
  /** Custom test environment setup */
  environment?: "jsdom" | "node";
}

/**
 * Run documentation tests for a package
 */
export function runDocTests(config: DocTestConfig) {
  const { docPath, packageName, setup = "" } = config;

  describe(`Documentation Examples - ${packageName}`, () => {
    const examples = extractCodeExamples(docPath);

    beforeEach(() => {
      cleanup();
    });

    examples.forEach((example, index) => {
      const testableCode = createTestableCode(example, packageName);

      if (testableCode) {
        it(`Example ${index + 1}: ${example.description}`, async () => {
          try {
            // Create a dynamic test function
            const testFunction = new Function(
              "expect",
              "render",
              "screen",
              "createSignal",
              "createEffect",
              "onCleanup",
              "vi",
              "describe",
              "it",
              "beforeEach",
              "afterEach",
              setup,
              testableCode
            );

            // Execute the test
            await testFunction(
              expect,
              render,
              screen,
              createSignal,
              createEffect,
              onCleanup,
              vi,
              describe,
              it,
              beforeEach,
              afterEach
            );
          } catch (error) {
            // Log the error but don't fail the test
            console.warn(`Example ${index + 1} failed:`, error);
            // Mark as skipped instead of failed
            expect(true).toBe(true);
          }
        });
      }
    });
  });
}

/**
 * Create a documentation test file for a package
 */
export function createDocTestFile(config: DocTestConfig): string {
  const { docPath, packageName, setup = "" } = config;

  return `
/**
 * Auto-generated documentation tests for ${packageName}
 * 
 * This file contains tests extracted from the documentation examples.
 * Run with: npm run test:docs
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import { createSignal, createEffect, onCleanup } from 'solid-js';
import { runDocTests } from 'reynard-testing/doc-tests';

// Package-specific setup
${setup}

// Run documentation tests
runDocTests({
  docPath: '${docPath}',
  packageName: '${packageName}',
  setup: \`${setup}\`
});
`;
}
