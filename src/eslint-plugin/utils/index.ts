/**
 * @file Barrel export for ESLint plugin utilities
 * Exports all utility functions and classes
 */

// AST parsing utilities
export * from "./ast-parser.js";

// File loading utilities
export * from "./file-loader.js";

// Caching system
export * from "./cache.js";

// i18n integration - explicit exports to avoid conflicts
export {
  findTranslationFiles as findTranslationFilesAdvanced,
  parseTranslationFile,
  loadAllTranslationKeys,
  hasTranslationKey as hasTranslationKeyAdvanced,
  extractTranslationKeys as extractTranslationKeysAdvanced,
  findSimilarKeys,
  getAvailableNamespaces,
  getAvailableLocales,
  getKeysForNamespace,
  getKeysForLocale,
  validateTranslationConsistency,
  validateKeyFormat,
  generateTranslationCacheKey as generateTranslationCacheKeyAdvanced,
  checkTranslationFilesModified,
  convertToReynardTranslations,
  validateAgainstReynardTypes,
  type TranslationFile as TranslationFileAdvanced,
  type TranslationKey,
  type TranslationNamespace,
  type I18nValidationResult,
} from "./i18n-integration.js";
