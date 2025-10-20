/**
 * @file Main ESLint plugin export for Reynard testing framework
 * Provides comprehensive ESLint rules for i18n, accessibility, and performance
 */

import type { PluginExport } from './types.js';

// Import all rules
import { noHardcodedStrings } from './rules/i18n/no-hardcoded-strings.js';
import { noUntranslatedKeys } from './rules/i18n/no-untranslated-keys.js';
import { preferI18nKeys } from './rules/i18n/prefer-i18n-keys.js';
import { noMissingAlt } from './rules/accessibility/no-missing-alt.js';
import { ariaProps } from './rules/accessibility/aria-props.js';
import { keyboardNavigation } from './rules/accessibility/keyboard-navigation.js';
import { noUnnecessaryRerenders } from './rules/performance/no-unnecessary-rerenders.js';
import { preferMemo } from './rules/performance/prefer-memo.js';

// Import all configurations
import { recommended } from './configs/recommended.js';
import { i18n } from './configs/i18n.js';
import { accessibility } from './configs/accessibility.js';
import { performance } from './configs/performance.js';

// ============================================================================
// Plugin Definition
// ============================================================================

export const plugin: PluginExport = {
  meta: {
    name: '@reynard/testing',
    version: '0.2.0',
    description: 'Comprehensive ESLint plugin for Reynard projects with i18n, accessibility, and performance rules',
  },
  rules: {
    // i18n rules
    'no-hardcoded-strings': noHardcodedStrings,
    'no-untranslated-keys': noUntranslatedKeys,
    'prefer-i18n-keys': preferI18nKeys,

    // accessibility rules
    'no-missing-alt': noMissingAlt,
    'aria-props': ariaProps,
    'keyboard-navigation': keyboardNavigation,

    // performance rules
    'no-unnecessary-rerenders': noUnnecessaryRerenders,
    'prefer-memo': preferMemo,
  },
  configs: {
    recommended,
    i18n,
    accessibility,
    performance,
  },
};

// ============================================================================
// Default Export
// ============================================================================

export default plugin;

// ============================================================================
// Named Exports for Convenience
// ============================================================================

// Export individual rule categories
export { 
  noHardcodedStrings, 
  noUntranslatedKeys, 
  preferI18nKeys,
  noMissingAlt,
  ariaProps,
  keyboardNavigation,
  noUnnecessaryRerenders,
  preferMemo
};

// Export configurations
export { recommended, i18n, accessibility, performance };

// Export types
export type * from './types.js';
