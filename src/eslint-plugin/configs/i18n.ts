/**
 * @file i18n-focused ESLint configuration for Reynard projects
 * Emphasizes internationalization best practices
 */

import type { PluginConfig } from '../types.js';

export const i18n: PluginConfig = {
  plugins: ['@reynard/testing'],
  rules: {
    // i18n rules - strict enforcement
    '@reynard/testing/i18n/no-hardcoded-strings': 'error',
    '@reynard/testing/i18n/no-untranslated-keys': 'error',
    '@reynard/testing/i18n/prefer-i18n-keys': 'error',

    // accessibility rules - basic enforcement
    '@reynard/testing/accessibility/no-missing-alt': 'warn',
    '@reynard/testing/accessibility/aria-props': 'off',
    '@reynard/testing/accessibility/keyboard-navigation': 'off',

    // performance rules - basic enforcement
    '@reynard/testing/performance/no-unnecessary-rerenders': 'warn',
    '@reynard/testing/performance/prefer-memo': 'off',
  },
};
