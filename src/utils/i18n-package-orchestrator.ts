/**
 * i18n Package Testing Orchestrator
 * Main entry point for i18n testing coordination across all Reynard packages
 */

// Export types
export type { PackageI18nTestResult, GlobalI18nTestResult } from "./i18n-orchestrator-types";

// Export core functionality
export { runAllPackageI18nTests, runPackageI18nTests } from "./i18n-package-orchestrator-core";

// Export utility functions
export { createPackageI18nTestFiles, generatePackageTestFile } from "./i18n-orchestrator-test-generator";

export { validatePackageI18nSetup } from "./i18n-orchestrator-validation";

// Export summary and reporting
export { generateSummary, generateGlobalReport } from "./i18n-orchestrator-summary";
