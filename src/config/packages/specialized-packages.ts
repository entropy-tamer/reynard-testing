/**
 * Specialized Package Configurations
 * Configuration for specialized packages that require i18n testing
 */

import type { PackageI18nConfig } from "../types.js";
import { createIgnorePatterns } from "../ignore-patterns.js";

export const specializedPackages: PackageI18nConfig[] = [
  {
    name: "monaco",
    path: "packages/ui/monaco",
    enabled: true,
    ignorePatterns: createIgnorePatterns("monaco"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["monaco", "common"],
  },
  {
    name: "3d",
    path: "packages/media/3d",
    enabled: true,
    ignorePatterns: createIgnorePatterns("threeD"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["3d", "common"],
  },
  {
    name: "games",
    path: "packages/ui/games",
    enabled: true,
    ignorePatterns: createIgnorePatterns("games"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["games", "common"],
  },
  {
    name: "i18n",
    path: "packages/core/i18n",
    enabled: true,
    ignorePatterns: createIgnorePatterns("i18n"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["i18n", "common"],
  },
  {
    name: "core",
    path: "packages/core/core",
    enabled: true,
    ignorePatterns: createIgnorePatterns("core"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["core", "common"],
  },
];
