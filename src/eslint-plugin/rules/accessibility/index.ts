/**
 * @file Barrel export for accessibility rules
 * Exports all accessibility-related ESLint rules
 */

import { noMissingAlt } from "./no-missing-alt.js";
import { ariaProps } from "./aria-props.js";
import { keyboardNavigation } from "./keyboard-navigation.js";

export { noMissingAlt, ariaProps, keyboardNavigation };

// Re-export as default for easier importing
export default {
  "no-missing-alt": noMissingAlt,
  "aria-props": ariaProps,
  "keyboard-navigation": keyboardNavigation,
};
