/**
 * @file Barrel export for performance rules
 * Exports all performance-related ESLint rules
 */

import { noUnnecessaryRerenders } from "./no-unnecessary-rerenders.js";
import { preferMemo } from "./prefer-memo.js";

export { noUnnecessaryRerenders, preferMemo };

// Re-export as default for easier importing
export default {
  "no-unnecessary-rerenders": noUnnecessaryRerenders,
  "prefer-memo": preferMemo,
};
