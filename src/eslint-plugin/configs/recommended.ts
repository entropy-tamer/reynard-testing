/**
 * @file Recommended ESLint configuration for Reynard projects
 * Provides a balanced set of rules for general development
 */

import type { PluginConfig } from '../types.js';

export const recommended: PluginConfig = {
  plugins: ['@reynard/testing'],
  rules: {
    // i18n rules
    '@reynard/testing/i18n/no-hardcoded-strings': 'warn',
    '@reynard/testing/i18n/no-untranslated-keys': 'warn',
    '@reynard/testing/i18n/prefer-i18n-keys': 'warn',

    // accessibility rules
    '@reynard/testing/accessibility/no-missing-alt': 'error',
    '@reynard/testing/accessibility/aria-props': 'warn',
    '@reynard/testing/accessibility/keyboard-navigation': 'warn',

    // performance rules
    '@reynard/testing/performance/no-unnecessary-rerenders': 'warn',
    '@reynard/testing/performance/prefer-memo': 'warn',
  },
};
