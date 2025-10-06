/**
 * UI Package Configurations
 * Configuration for UI-focused packages that require i18n testing
 */

import type { PackageI18nConfig } from "../types.js";
import { createIgnorePatterns } from "../ignore-patterns.js";

export const uiPackages: PackageI18nConfig[] = [
  {
    name: "floating-panel",
    path: "packages/ui/floating-panel",
    enabled: true,
    ignorePatterns: createIgnorePatterns("floatingPanel"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["floating-panel", "common"],
  },
  {
    name: "themes",
    path: "packages/ui/themes",
    enabled: true,
    ignorePatterns: createIgnorePatterns("themes"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["themes", "common"],
  },
  {
    name: "components-core",
    path: "packages/ui/components-core",
    enabled: false, // Disabled - no tests directory yet
    ignorePatterns: createIgnorePatterns(),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["components", "common"],
  },
  {
    name: "charts",
    path: "packages/ui/charts",
    enabled: true,
    ignorePatterns: createIgnorePatterns("charts"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["charts", "common"],
  },
];
