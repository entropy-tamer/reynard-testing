/**
 * Package Configuration Aggregator
 * Combines all package configurations into a single export
 */

import { uiPackages } from "./ui-packages.js";
import { featurePackages } from "./feature-packages.js";
import { mediaPackages } from "./media-packages.js";
import { specializedPackages } from "./specialized-packages.js";
import { disabledPackages } from "./disabled-packages.js";

export const allPackages = [
  ...uiPackages,
  ...featurePackages,
  ...mediaPackages,
  ...specializedPackages,
  ...disabledPackages,
];

export * from "./ui-packages.js";
export * from "./feature-packages.js";
export * from "./media-packages.js";
export * from "./specialized-packages.js";
export * from "./disabled-packages.js";
