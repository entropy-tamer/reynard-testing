/**
 * @file Barrel export for ESLint configurations
 * Exports all preset configurations
 */

export { recommended } from "./recommended.js";
export { i18n } from "./i18n.js";
export { accessibility } from "./accessibility.js";
export { performance } from "./performance.js";

// Re-export as default for easier importing
import { recommended } from "./recommended.js";
import { i18n } from "./i18n.js";
import { accessibility } from "./accessibility.js";
import { performance } from "./performance.js";

export default {
  recommended,
  i18n,
  accessibility,
  performance,
};
