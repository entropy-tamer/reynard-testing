/**
 * DOM Testing Module - Barrel Export
 *
 * Exports for all harmonized DOM testing utilities in the Reynard testing framework.
 * This provides a unified API for DOM testing across vitest and playwright environments.
 *
 * @author 🦊 The Cunning Fox
 */

// Core unified DOM assertions
export * from "./unified-dom-assertions";

// Shared test fixtures and utilities
export * from "./dom-test-fixtures";

// Environment adapters
export * from "./adapters/playwright-adapter";

// Complex interactions
export * from "./interactions/complex-interactions";

// Accessibility testing
export * from "./accessibility/accessibility-testing";

// Performance monitoring
export * from "./performance/performance-monitoring";

// Re-export commonly used types for convenience
export type { DOMTestEnvironment, DOMElement, InteractionOptions } from "./unified-dom-assertions";

export type { DragDropOptions, KeyboardOptions } from "./interactions/complex-interactions";

export type { MutationRecord } from "./performance/performance-monitoring";
