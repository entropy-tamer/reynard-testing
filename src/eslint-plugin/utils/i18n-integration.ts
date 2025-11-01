/**
 * @file Deep integration with Reynard i18n type system
 * Provides comprehensive translation file parsing and validation
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
// import type { LanguageCode, Translations } from '@entropy-tamer/reynard-i18n';

// Temporary type definitions until i18n package is built
type LanguageCode = string;
type Translations = Record<string, any>;

// ============================================================================
// Types for i18n Integration
// ============================================================================

export interface TranslationFile {
  path: string;
  locale: LanguageCode;
  namespace: string;
  content: Record<string, any>;
  lastModified: number;
}

export interface TranslationKey {
  key: string;
  namespace: string;
  locale: LanguageCode;
  value: string;
  file: string;
  line?: number;
  column?: number;
}

export interface TranslationNamespace {
  name: string;
  keys: string[];
  locales: LanguageCode[];
  files: TranslationFile[];
}

export interface I18nValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingKeys: string[];
  unusedKeys: string[];
  inconsistentKeys: string[];
}

// ============================================================================
// Translation File Discovery and Loading
// ============================================================================

/**
 * Find all translation files in the project
 * Supports the Reynard structure: packages/any/src/lang/locale/namespace.ts
 */
export function findTranslationFiles(patterns: string[] = [
  'packages/*/src/lang/**/*.ts',
  'src/lang/**/*.ts',
  'examples/*/src/lang/**/*.ts'
]): string[] {
  const files: string[] = [];
  
  for (const pattern of patterns) {
    try {
      const matches = glob.sync(pattern, { 
        cwd: process.cwd(),
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
      });
      files.push(...matches);
    } catch (error) {
      console.warn(`Failed to search pattern ${pattern}:`, error);
    }
  }
  
  return [...new Set(files)]; // Remove duplicates
}

/**
 * Parse a translation file and extract its content
 */
export function parseTranslationFile(filePath: string): TranslationFile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);
    
    // Extract locale and namespace from path
    const pathParts = filePath.split(path.sep);
    const langIndex = pathParts.findIndex(part => part === 'lang');
    
    if (langIndex === -1 || langIndex + 2 >= pathParts.length) {
      return null;
    }
    
    const locale = pathParts[langIndex + 1] as LanguageCode;
    const namespace = pathParts[langIndex + 2].replace('.ts', '');
    
    // Parse the TypeScript file content
    const parsedContent = parseTranslationContent(content);
    
    return {
      path: filePath,
      locale,
      namespace,
      content: parsedContent,
      lastModified: stats.mtime.getTime()
    };
  } catch (error) {
    console.warn(`Failed to parse translation file ${filePath}:`, error);
    return null;
  }
}

/**
 * Parse TypeScript translation file content
 * Handles both named exports and default exports
 */
function parseTranslationContent(content: string): Record<string, any> {
  try {
    // Simple regex-based parsing for translation objects
    // This is a simplified approach - in production, you might want to use a proper TypeScript parser
    
    // Look for named exports like: export const commonTranslations = { ... }
    const namedExportMatch = content.match(/export\s+const\s+(\w+)\s*=\s*\{([\s\S]*?)\};/);
    if (namedExportMatch) {
      const objectContent = namedExportMatch[2];
      return parseObjectContent(objectContent);
    }
    
    // Look for default exports like: export default { ... }
    const defaultExportMatch = content.match(/export\s+default\s*\{([\s\S]*?)\};/);
    if (defaultExportMatch) {
      const objectContent = defaultExportMatch[1];
      return parseObjectContent(objectContent);
    }
    
    return {};
  } catch (error) {
    console.warn('Failed to parse translation content:', error);
    return {};
  }
}

/**
 * Parse object content from TypeScript file
 * Handles simple key-value pairs
 */
function parseObjectContent(objectContent: string): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Simple regex to match key-value pairs
  const keyValueRegex = /(\w+(?:-\w+)*)\s*:\s*["'`]([^"'`]*?)["'`]/g;
  let match;
  
  while ((match = keyValueRegex.exec(objectContent)) !== null) {
    const [, key, value] = match;
    result[key] = value;
  }
  
  return result;
}

// ============================================================================
// Translation Key Management
// ============================================================================

/**
 * Extract all translation keys from a translation file
 */
export function extractTranslationKeys(file: TranslationFile): TranslationKey[] {
  const keys: TranslationKey[] = [];
  
  function extractKeysFromObject(obj: any, prefix = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        keys.push({
          key: fullKey,
          namespace: file.namespace,
          locale: file.locale,
          value,
          file: file.path
        });
      } else if (typeof value === 'object' && value !== null) {
        extractKeysFromObject(value, fullKey);
      }
    }
  }
  
  extractKeysFromObject(file.content);
  return keys;
}

/**
 * Load all translation files and extract keys
 */
export function loadAllTranslationKeys(patterns?: string[]): TranslationKey[] {
  const files = findTranslationFiles(patterns);
  const allKeys: TranslationKey[] = [];
  
  for (const filePath of files) {
    const file = parseTranslationFile(filePath);
    if (file) {
      const keys = extractTranslationKeys(file);
      allKeys.push(...keys);
    }
  }
  
  return allKeys;
}

/**
 * Check if a translation key exists in the loaded translations
 */
export function hasTranslationKey(key: string, translationKeys: TranslationKey[]): boolean {
  return translationKeys.some(tk => tk.key === key);
}

/**
 * Find similar translation keys for suggestions
 */
export function findSimilarKeys(key: string, translationKeys: TranslationKey[], maxResults = 5): string[] {
  const keyParts = key.toLowerCase().split('.');
  const similar: { key: string; score: number }[] = [];
  
  for (const tk of translationKeys) {
    const tkParts = tk.key.toLowerCase().split('.');
    let score = 0;
    
    // Exact match
    if (tk.key === key) {
      score = 100;
    }
    // Same namespace
    else if (keyParts[0] === tkParts[0]) {
      score += 50;
      
      // Similar key name
      if (keyParts.length > 1 && tkParts.length > 1) {
        const keyName = keyParts[1];
        const tkName = tkParts[1];
        
        if (keyName === tkName) {
          score += 30;
        } else if (keyName.includes(tkName) || tkName.includes(keyName)) {
          score += 20;
        }
      }
    }
    
    if (score > 0) {
      similar.push({ key: tk.key, score });
    }
  }
  
  return similar
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.key);
}

// ============================================================================
// Namespace Management
// ============================================================================

/**
 * Get all available namespaces
 */
export function getAvailableNamespaces(translationKeys: TranslationKey[]): string[] {
  const namespaces = new Set<string>();
  for (const tk of translationKeys) {
    namespaces.add(tk.namespace);
  }
  return Array.from(namespaces).sort();
}

/**
 * Get all available locales
 */
export function getAvailableLocales(translationKeys: TranslationKey[]): LanguageCode[] {
  const locales = new Set<LanguageCode>();
  for (const tk of translationKeys) {
    locales.add(tk.locale);
  }
  return Array.from(locales).sort();
}

/**
 * Get translation keys for a specific namespace
 */
export function getKeysForNamespace(namespace: string, translationKeys: TranslationKey[]): TranslationKey[] {
  return translationKeys.filter(tk => tk.namespace === namespace);
}

/**
 * Get translation keys for a specific locale
 */
export function getKeysForLocale(locale: LanguageCode, translationKeys: TranslationKey[]): TranslationKey[] {
  return translationKeys.filter(tk => tk.locale === locale);
}

// ============================================================================
// Validation and Analysis
// ============================================================================

/**
 * Validate translation consistency across locales
 */
export function validateTranslationConsistency(translationKeys: TranslationKey[]): I18nValidationResult {
  const result: I18nValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    missingKeys: [],
    unusedKeys: [],
    inconsistentKeys: []
  };
  
  const namespaces = getAvailableNamespaces(translationKeys);
  const locales = getAvailableLocales(translationKeys);
  
  // Check for missing keys across locales
  for (const namespace of namespaces) {
    const namespaceKeys = getKeysForNamespace(namespace, translationKeys);
    const keysByLocale = new Map<LanguageCode, Set<string>>();
    
    for (const tk of namespaceKeys) {
      if (!keysByLocale.has(tk.locale)) {
        keysByLocale.set(tk.locale, new Set());
      }
      keysByLocale.get(tk.locale)!.add(tk.key);
    }
    
    // Find missing keys
    const allKeys = new Set<string>();
    for (const keys of keysByLocale.values()) {
      for (const key of keys) {
        allKeys.add(key);
      }
    }
    
    for (const locale of locales) {
      const localeKeys = keysByLocale.get(locale) || new Set();
      for (const key of allKeys) {
        if (!localeKeys.has(key)) {
          result.missingKeys.push(`${key} (${locale})`);
          result.isValid = false;
        }
      }
    }
  }
  
  return result;
}

/**
 * Check if a key follows the expected namespace pattern
 */
export function validateKeyFormat(key: string, expectedNamespaces: string[]): boolean {
  const parts = key.split('.');
  if (parts.length < 2) {
    return false;
  }
  
  const namespace = parts[0];
  return expectedNamespaces.includes(namespace);
}

// ============================================================================
// Caching and Performance
// ============================================================================

/**
 * Generate a cache key for translation files
 */
export function generateTranslationCacheKey(patterns: string[]): string {
  const sortedPatterns = patterns.sort();
  return `translation-files:${sortedPatterns.join(',')}`;
}

/**
 * Check if translation files have been modified since last cache
 */
export function checkTranslationFilesModified(patterns: string[], lastCacheTime: number): boolean {
  const files = findTranslationFiles(patterns);
  
  for (const filePath of files) {
    try {
      const stats = fs.statSync(filePath);
      if (stats.mtime.getTime() > lastCacheTime) {
        return true;
      }
    } catch (error) {
      // File might have been deleted
      return true;
    }
  }
  
  return false;
}

// ============================================================================
// Integration with Reynard Types
// ============================================================================

/**
 * Convert loaded translation keys to Reynard Translations format
 */
export function convertToReynardTranslations(translationKeys: TranslationKey[]): Partial<Translations> {
  const result: Partial<Translations> = {};
  
  for (const tk of translationKeys) {
    const namespace = tk.namespace as keyof Translations;
    if (!result[namespace]) {
      result[namespace] = {} as any;
    }
    
    // Convert dot notation to nested object
    const keyParts = tk.key.split('.');
    if (keyParts.length > 1) {
      const keyName = keyParts[1];
      (result[namespace] as any)[keyName] = tk.value;
    }
  }
  
  return result;
}

/**
 * Validate against Reynard translation types
 */
export function validateAgainstReynardTypes(translationKeys: TranslationKey[]): I18nValidationResult {
  const result: I18nValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    missingKeys: [],
    unusedKeys: [],
    inconsistentKeys: []
  };
  
  // This would integrate with the actual Reynard type system
  // For now, we'll do basic validation
  
  const namespaces = getAvailableNamespaces(translationKeys);
  const expectedNamespaces = ['common', 'themes', 'core', 'components', 'gallery', 'charts', 'auth', 'chat', 'monaco'];
  
  for (const namespace of namespaces) {
    if (!expectedNamespaces.includes(namespace)) {
      result.warnings.push(`Unknown namespace: ${namespace}`);
    }
  }
  
  return result;
}
