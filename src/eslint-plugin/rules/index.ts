/**
 * @file Barrel export for all ESLint rules
 * Exports all rules organized by category
 */

// i18n rules
export * from './i18n/index.js';

// accessibility rules
export * from './accessibility/index.js';

// performance rules
export * from './performance/index.js';

// Re-export as default for easier importing
import i18nRules from './i18n/index.js';
import accessibilityRules from './accessibility/index.js';
import performanceRules from './performance/index.js';

export default {
  ...i18nRules,
  ...accessibilityRules,
  ...performanceRules,
};
