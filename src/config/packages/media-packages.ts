/**
 * Media Package Configurations
 * Configuration for media and visualization packages that require i18n testing
 */

import type { PackageI18nConfig } from "../types.js";
import { createIgnorePatterns } from "../ignore-patterns.js";

export const mediaPackages: PackageI18nConfig[] = [
  {
    name: "caption",
    path: "packages/ai/caption",
    enabled: true,
    ignorePatterns: createIgnorePatterns("caption"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["caption", "common"],
  },
  {
    name: "boundingbox",
    path: "packages/media/boundingbox",
    enabled: true,
    ignorePatterns: createIgnorePatterns("boundingBox"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["boundingbox", "common"],
  },
  {
    name: "audio",
    path: "packages/media/audio",
    enabled: true,
    ignorePatterns: createIgnorePatterns("audio"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["audio", "common"],
  },
  {
    name: "video",
    path: "packages/media/video",
    enabled: true,
    ignorePatterns: createIgnorePatterns("video"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["video", "common"],
  },
  {
    name: "image",
    path: "packages/media/image",
    enabled: true,
    ignorePatterns: createIgnorePatterns("image"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["image", "common"],
  },
  {
    name: "multimodal",
    path: "packages/ai/multimodal",
    enabled: true,
    ignorePatterns: createIgnorePatterns("multimodal"),
    failOnHardcodedStrings: false, // Temporarily disabled for CI
    validateCompleteness: true,
    testRTL: true,
    namespaces: ["multimodal", "common"],
  },
];
