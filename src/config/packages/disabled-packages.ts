/**
 * Disabled Package Configurations
 * Configuration for packages that don't require i18n testing
 */

import type { PackageI18nConfig } from "../types.js";

export const disabledPackages: PackageI18nConfig[] = [
  {
    name: "algorithms",
    path: "packages/core/algorithms",
    enabled: false, // Algorithms package likely doesn't need i18n
    ignorePatterns: [],
    failOnHardcodedStrings: false,
    validateCompleteness: false,
    testRTL: false,
    namespaces: [],
  },
  {
    name: "api-client",
    path: "packages/api-client",
    enabled: false, // API client likely doesn't need i18n
    ignorePatterns: [],
    failOnHardcodedStrings: false,
    validateCompleteness: false,
    testRTL: false,
    namespaces: [],
  },
  {
    name: "colors",
    path: "packages/colors",
    enabled: false, // Colors package likely doesn't need i18n
    ignorePatterns: [],
    failOnHardcodedStrings: false,
    validateCompleteness: false,
    testRTL: false,
    namespaces: [],
  },
  {
    name: "composables",
    path: "packages/composables",
    enabled: false, // Composables package likely doesn't need i18n
    ignorePatterns: [],
    failOnHardcodedStrings: false,
    validateCompleteness: false,
    testRTL: false,
    namespaces: [],
  },
  {
    name: "config",
    path: "packages/config",
    enabled: false, // Config package likely doesn't need i18n
    ignorePatterns: [],
    failOnHardcodedStrings: false,
    validateCompleteness: false,
    testRTL: false,
    namespaces: [],
  },
  {
    name: "connection",
    path: "packages/connection",
    enabled: false, // Connection package likely doesn't need i18n
    ignorePatterns: [],
    failOnHardcodedStrings: false,
    validateCompleteness: false,
    testRTL: false,
    namespaces: [],
  },
  {
    name: "fluent-icons",
    path: "packages/fluent-icons",
    enabled: false, // Icons package likely doesn't need i18n
    ignorePatterns: [],
    failOnHardcodedStrings: false,
    validateCompleteness: false,
    testRTL: false,
    namespaces: [],
  },
];
