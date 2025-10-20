/**
 * @file File loading and translation parsing utilities for the Reynard ESLint plugin
 * Provides robust file system operations and translation file parsing
 */

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import type { TranslationFile } from '../types.js';
import {
  findTranslationFiles as findTranslationFilesAdvanced,
  parseTranslationFile,
  loadAllTranslationKeys,
  hasTranslationKey as hasTranslationKeyAdvanced,
  extractTranslationKeys as extractTranslationKeysAdvanced
} from './i18n-integration.js';

// ============================================================================
// File System Utilities
// ============================================================================

/**
 * Check if a file exists
 * @param filePath - Path to check
 * @returns True if file exists
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read file content synchronously
 * @param filePath - Path to file
 * @returns File content as string
 */
export function readFileSync(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get file stats
 * @param filePath - Path to file
 * @returns File stats
 */
export function getFileStats(filePath: string): fs.Stats | null {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

/**
 * Find files matching patterns
 * @param patterns - Glob patterns to match
 * @param options - Glob options
 * @returns Array of matching file paths
 */
export function findFiles(patterns: string[], options: any = {}): string[] {
  const files: string[] = [];
  
  for (const pattern of patterns) {
    try {
      const matches = glob.sync(pattern, {
        cwd: process.cwd(),
        absolute: true,
        ...options,
      });
      files.push(...matches);
    } catch (error) {
      console.warn(`Failed to match pattern ${pattern}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return [...new Set(files)]; // Remove duplicates
}

// ============================================================================
// Translation File Loading
// ============================================================================

/**
 * Load translation files from patterns
 * @param patterns - File patterns to load
 * @returns Array of loaded translation files
 */
export async function loadTranslationFiles(patterns: string[]): Promise<TranslationFile[]> {
  const files = findFiles(patterns);
  const translationFiles: TranslationFile[] = [];

  for (const filePath of files) {
    try {
      const content = readFileSync(filePath);
      const parsed = parseTranslationModule(content);
      const stats = getFileStats(filePath);
      
      // Extract locale from path (e.g., /path/to/en/common.ts -> en)
      const locale = extractLocaleFromPath(filePath);
      const namespace = extractNamespaceFromPath(filePath);

      translationFiles.push({
        path: filePath,
        content: parsed,
        locale,
        namespace,
        lastModified: stats?.mtime.getTime() || Date.now(),
      });
    } catch (error) {
      console.warn(`Failed to load translation file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return translationFiles;
}

/**
 * Load translation files synchronously
 * @param patterns - File patterns to load
 * @returns Array of loaded translation files
 */
export function loadTranslationFilesSync(patterns: string[]): TranslationFile[] {
  const files = findFiles(patterns);
  const translationFiles: TranslationFile[] = [];

  for (const filePath of files) {
    try {
      const content = readFileSync(filePath);
      const parsed = parseTranslationModule(content);
      const stats = getFileStats(filePath);
      
      // Extract locale from path (e.g., /path/to/en/common.ts -> en)
      const locale = extractLocaleFromPath(filePath);
      const namespace = extractNamespaceFromPath(filePath);

      translationFiles.push({
        path: filePath,
        content: parsed,
        locale,
        namespace,
        lastModified: stats?.mtime.getTime() || Date.now(),
      });
    } catch (error) {
      console.warn(`Failed to load translation file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return translationFiles;
}

// ============================================================================
// Translation Module Parsing
// ============================================================================

/**
 * Parse a translation module file
 * @param content - File content
 * @returns Parsed translation object
 */
export function parseTranslationModule(content: string): Record<string, any> {
  try {
    // Remove TypeScript/JavaScript syntax and extract the object
    const exportMatch = content.match(/export\s+default\s+(\{[\s\S]*?\});?\s*$/m);
    if (!exportMatch) {
      return {};
    }

    const objectString = exportMatch[1];
    return parseNestedObject(objectString);
  } catch (error) {
    console.warn(`Failed to parse translation module: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {};
  }
}

/**
 * Parse nested object from string representation
 * @param objectString - Object string to parse
 * @returns Parsed object
 */
export function parseNestedObject(objectString: string): Record<string, any> {
  const result: Record<string, any> = {};
  
  try {
    // Simple regex-based parsing for translation objects
    // This handles the most common patterns in translation files
    const keyValueRegex = /(\w+):\s*(\{[^}]*\}|"[^"]*"|'[^']*'|\d+|true|false|null)/g;
    let match;

    while ((match = keyValueRegex.exec(objectString)) !== null) {
      const [, key, value] = match;
      
      if (value.startsWith('"') || value.startsWith("'")) {
        // String value
        result[key] = value.slice(1, -1);
      } else if (value.startsWith('{')) {
        // Nested object
        result[key] = parseNestedObject(value);
      } else if (value === 'true') {
        result[key] = true;
      } else if (value === 'false') {
        result[key] = false;
      } else if (value === 'null') {
        result[key] = null;
      } else if (!isNaN(Number(value))) {
        result[key] = Number(value);
      }
    }
  } catch (error) {
    console.warn(`Failed to parse nested object: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

// ============================================================================
// Translation Key Validation
// ============================================================================

/**
 * Check if a translation key exists in the loaded translations
 * @param translations - Translation object
 * @param key - Key to check (supports dot notation)
 * @returns True if key exists
 */
export function hasTranslationKey(translations: Record<string, any>, key: string): boolean {
  const parts = key.split('.');
  let current = translations;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Get translation value for a key
 * @param translations - Translation object
 * @param key - Key to get (supports dot notation)
 * @returns Translation value or null
 */
export function getTranslationValue(translations: Record<string, any>, key: string): string | null {
  const parts = key.split('.');
  let current = translations;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? current : null;
}

/**
 * Extract all translation keys from a translation object
 * @param translations - Translation object
 * @param prefix - Key prefix
 * @returns Array of all translation keys
 */
export function extractTranslationKeys(translations: Record<string, any>, prefix = ''): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(translations)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      keys.push(fullKey);
    } else if (typeof value === 'object' && value !== null) {
      keys.push(...extractTranslationKeys(value, fullKey));
    }
  }

  return keys;
}

// ============================================================================
// Path Utilities
// ============================================================================

/**
 * Extract locale from file path
 * @param filePath - File path
 * @returns Locale code
 */
export function extractLocaleFromPath(filePath: string): string {
  const pathParts = filePath.split(path.sep);
  
  // Look for common locale patterns
  for (let i = pathParts.length - 1; i >= 0; i--) {
    const part = pathParts[i];
    
    // Check if it's a locale directory (e.g., en, fr, de)
    if (part.length === 2 && /^[a-z]{2}$/.test(part)) {
      return part;
    }
    
    // Check for locale with country (e.g., en-US, pt-BR)
    if (part.length === 5 && /^[a-z]{2}-[A-Z]{2}$/.test(part)) {
      return part;
    }
  }
  
  return 'en'; // Default to English
}

/**
 * Extract namespace from file path
 * @param filePath - File path
 * @returns Namespace name
 */
export function extractNamespaceFromPath(filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Common namespace patterns
  if (fileName === 'index') {
    return 'common';
  }
  
  return fileName;
}

/**
 * Resolve file path relative to current working directory
 * @param filePath - File path to resolve
 * @returns Resolved absolute path
 */
export function resolveFilePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  
  return path.resolve(process.cwd(), filePath);
}

// ============================================================================
// Translation File Management
// ============================================================================

/**
 * Find translation files in a directory
 * @param directory - Directory to search
 * @param locale - Locale to search for
 * @returns Array of translation file paths
 */
export function findTranslationFiles(directory: string, locale?: string): string[] {
  const patterns = locale 
    ? [`${directory}/**/${locale}/**/*.ts`, `${directory}/**/${locale}/**/*.js`]
    : [`${directory}/**/*.ts`, `${directory}/**/*.js`];
  
  return findFiles(patterns);
}

/**
 * Get translation file info
 * @param filePath - Path to translation file
 * @returns Translation file info
 */
export function getTranslationFileInfo(filePath: string): {
  locale: string;
  namespace: string;
  exists: boolean;
  lastModified: number;
} {
  const exists = fileExists(filePath);
  const stats = exists ? getFileStats(filePath) : null;
  
  return {
    locale: extractLocaleFromPath(filePath),
    namespace: extractNamespaceFromPath(filePath),
    exists,
    lastModified: stats?.mtime.getTime() || 0,
  };
}

// ============================================================================
// Enhanced Translation Loading with Reynard Integration
// ============================================================================

/**
 * Load translation files using the enhanced Reynard i18n integration
 * @param patterns - File patterns to load
 * @returns Array of loaded translation files with enhanced parsing
 */
export function loadTranslationFilesEnhanced(patterns: string[]): TranslationFile[] {
  const files = findTranslationFilesAdvanced(patterns);
  const translationFiles: TranslationFile[] = [];

  for (const filePath of files) {
    const parsedFile = parseTranslationFile(filePath);
    if (parsedFile) {
      translationFiles.push({
        path: parsedFile.path,
        content: parsedFile.content,
        locale: parsedFile.locale,
        namespace: parsedFile.namespace,
        lastModified: parsedFile.lastModified,
      });
    }
  }

  return translationFiles;
}

/**
 * Check if a translation key exists using enhanced validation
 * @param key - Translation key to check
 * @param patterns - File patterns to search
 * @returns True if key exists
 */
export function hasTranslationKeyEnhanced(key: string, patterns: string[]): boolean {
  const translationKeys = loadAllTranslationKeys(patterns);
  return hasTranslationKeyAdvanced(key, translationKeys);
}

/**
 * Extract translation key from a function call with enhanced parsing
 * @param node - Call expression node
 * @returns Translation key if found, null otherwise
 */
export function extractTranslationKeyEnhanced(node: any): string | null {
  if (node.callee.type === 'Identifier' && node.callee.name === 't') {
    if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
      const arg = node.arguments[0];
      if (typeof arg.value === 'string') {
        return arg.value;
      }
    }
  }

  if (node.callee.type === 'MemberExpression' && 
      node.callee.property.type === 'Identifier' && 
      node.callee.property.name === 't') {
    if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
      const arg = node.arguments[0];
      if (typeof arg.value === 'string') {
        return arg.value;
      }
    }
  }

  return null;
}

// Re-export enhanced functions for backward compatibility
export {
  findTranslationFilesAdvanced as findTranslationFilesReynard,
  loadAllTranslationKeys,
  hasTranslationKeyAdvanced,
  extractTranslationKeysAdvanced
};

// All exports are already done above with individual export statements
