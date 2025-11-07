/**
 * @file Accessibility-focused ESLint configuration for Reynard projects
 * Emphasizes accessibility best practices
 */

import type { PluginConfig } from "../types.js";

export const accessibility: PluginConfig = {
  plugins: ["@reynard/testing"],
  rules: {
    // i18n rules - basic enforcement
    "@reynard/testing/i18n/no-hardcoded-strings": "warn",
    "@reynard/testing/i18n/no-untranslated-keys": "off",
    "@reynard/testing/i18n/prefer-i18n-keys": "off",

    // accessibility rules - strict enforcement
    "@reynard/testing/accessibility/no-missing-alt": "error",
    "@reynard/testing/accessibility/aria-props": "error",
    "@reynard/testing/accessibility/keyboard-navigation": "error",

    // performance rules - basic enforcement
    "@reynard/testing/performance/no-unnecessary-rerenders": "warn",
    "@reynard/testing/performance/prefer-memo": "off",
  },
};
