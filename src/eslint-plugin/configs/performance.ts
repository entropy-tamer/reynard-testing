/**
 * @file Performance-focused ESLint configuration for Reynard projects
 * Emphasizes performance optimization best practices
 */

import type { PluginConfig } from "../types.js";

export const performance: PluginConfig = {
  plugins: ["@reynard/testing"],
  rules: {
    // i18n rules - basic enforcement
    "@reynard/testing/i18n/no-hardcoded-strings": "warn",
    "@reynard/testing/i18n/no-untranslated-keys": "off",
    "@reynard/testing/i18n/prefer-i18n-keys": "off",

    // accessibility rules - basic enforcement
    "@reynard/testing/accessibility/no-missing-alt": "warn",
    "@reynard/testing/accessibility/aria-props": "off",
    "@reynard/testing/accessibility/keyboard-navigation": "off",

    // performance rules - strict enforcement
    "@reynard/testing/performance/no-unnecessary-rerenders": "error",
    "@reynard/testing/performance/prefer-memo": "error",
  },
};
