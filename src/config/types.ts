/**
 * Core i18n Testing Types
 * Type definitions for translation testing across all Reynard packages
 */

export interface PackageI18nConfig {
  /** Package name */
  name: string;
  /** Package path relative to workspace root */
  path: string;
  /** Whether this package should be tested for i18n */
  enabled: boolean;
  /** Custom ignore patterns for this package */
  ignorePatterns: string[];
  /** Whether to fail tests on hardcoded strings */
  failOnHardcodedStrings: boolean;
  /** Whether to validate translation completeness */
  validateCompleteness: boolean;
  /** Whether to test RTL support */
  testRTL: boolean;
  /** Custom translation namespaces for this package */
  namespaces: string[];
}

export interface I18nTestingConfig {
  /** All packages to test */
  packages: PackageI18nConfig[];
  /** Supported locales */
  locales: string[];
  /** Default ignore patterns applied to all packages */
  defaultIgnorePatterns: string[];
  /** Whether to generate coverage reports */
  generateCoverageReport: boolean;
  /** Whether to fail CI on any i18n issues */
  failOnCI: boolean;
  /** ESLint configuration for i18n rules */
  eslintConfig: {
    enabled: boolean;
    rules: Record<string, any>;
  };
}
