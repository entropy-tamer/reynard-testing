/**
 * Documentation Test Runner
 *
 * This module provides utilities to extract and run code examples from documentation
 * as executable tests, ensuring all examples in README files actually work.
 */

export * from "./doc-tests/index.js";

// Legacy exports for backward compatibility
export type { DocTestConfig } from "./doc-tests/test-runner";
export type { CodeExample } from "./doc-tests/code-parser";
export type { ValidationResult } from "./doc-tests/validator";
