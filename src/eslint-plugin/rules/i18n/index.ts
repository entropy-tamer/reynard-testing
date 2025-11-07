/**
 * @file Barrel export for i18n rules
 * Exports all i18n-related ESLint rules
 */

import { noHardcodedStrings } from "./no-hardcoded-strings.js";
import { noUntranslatedKeys } from "./no-untranslated-keys.js";
import { preferI18nKeys } from "./prefer-i18n-keys.js";

export { noHardcodedStrings, noUntranslatedKeys, preferI18nKeys };

// Re-export as default for easier importing
export default {
  "no-hardcoded-strings": noHardcodedStrings,
  "no-untranslated-keys": noUntranslatedKeys,
  "prefer-i18n-keys": preferI18nKeys,
};
