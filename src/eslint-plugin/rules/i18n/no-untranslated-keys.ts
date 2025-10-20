/**
 * @file ESLint rule: no-untranslated-keys
 * Validates that translation keys exist in translation files
 */

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';
import type { I18nRuleOptions } from '../../types.js';
import { 
  extractTranslationKeyEnhanced,
  hasTranslationKeyEnhanced,
  loadTranslationFilesEnhanced,
  generateTranslationCacheKeyAdvanced,
  findSimilarKeys,
  validateKeyFormat,
  globalEnhancedCacheManager
} from '../../utils/index.js';

// ============================================================================
// Rule Definition
// ============================================================================

export const noUntranslatedKeys: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate that translation keys exist in translation files',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/i18n/no-untranslated-keys.ts',
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          enabled: {
            type: 'boolean',
            default: true,
          },
          strictMode: {
            type: 'boolean',
            default: false,
          },
          translationFiles: {
            type: 'array',
            items: { type: 'string' },
            default: ['src/lang/**/*.ts', 'packages/*/src/lang/**/*.ts'],
          },
          autoFix: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingKey: 'Translation key "{{key}}" not found in translation files',
      missingKeyWithSuggestions: 'Translation key "{{key}}" not found. Did you mean: {{suggestions}}?',
      invalidKey: 'Translation key "{{key}}" is invalid or malformed',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options[0] as I18nRuleOptions || {};
    const enabled = options.enabled !== false;
    const strictMode = options.strictMode || false;
    const translationFiles = options.translationFiles || ['src/lang/**/*.ts', 'packages/*/src/lang/**/*.ts'];
    // const autoFix = options.autoFix || false; // TODO: Implement auto-fix

    // Early return if rule is disabled
    if (!enabled) {
      return {} as Rule.RuleListener;
    }

    // ========================================================================
    // Helper Functions
    // ========================================================================

    /**
     * Load and cache translation files using enhanced integration
     */
    function loadTranslations(): Record<string, any> {
      const cacheKey = generateTranslationCacheKeyAdvanced(translationFiles);
      const cache = globalEnhancedCacheManager.getEnhancedTranslationCache();
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      try {
        // Check if files have been modified and invalidate cache if needed
        cache.checkAndInvalidateIfModified(translationFiles);
        
        const loadedTranslationFiles = loadTranslationFilesEnhanced(translationFiles);
        const translations: Record<string, any> = {};

        // Merge all translation files with namespace support
        for (const file of loadedTranslationFiles) {
          if (file.namespace) {
            translations[file.namespace] = file.content;
          } else {
            Object.assign(translations, file.content);
          }
        }

        // Cache the result
        cache.set(cacheKey, translations);
        
        return translations;
      } catch (error) {
        if (strictMode) {
          console.warn(`Failed to load translations for ${context.getFilename()}:`, error);
        }
        return {};
      }
    }

    /**
     * Find similar keys for suggestions using enhanced integration
     */
    function findSimilarKeysForSuggestions(translations: Record<string, any>, targetKey: string): string[] {
      try {
        // Convert translations to TranslationKey format for the enhanced function
        const translationKeys = extractAllKeys(translations).map(key => ({ 
          key, 
          namespace: '', 
          locale: 'en' as any, 
          value: '',
          file: ''
        }));
        return findSimilarKeys(targetKey, translationKeys);
      } catch (error) {
        if (strictMode) {
          console.warn(`Failed to find similar keys for ${targetKey}:`, error);
        }
        return [];
      }
    }

    /**
     * Extract all keys from translation object
     */
    function extractAllKeys(translations: Record<string, any>, prefix = ''): string[] {
      const keys: string[] = [];

      for (const [key, value] of Object.entries(translations)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
          keys.push(fullKey);
        } else if (typeof value === 'object' && value !== null) {
          keys.push(...extractAllKeys(value, fullKey));
        }
      }

      return keys;
    }

    /**
     * Report missing translation key
     */
    function reportMissingKey(node: TSESTree.Node, key: string, translations: Record<string, any>) {
      const suggestions = findSimilarKeysForSuggestions(translations, key);
      
      const report: Rule.ReportDescriptor = {
        node: node as any,
        messageId: suggestions.length > 0 ? 'missingKeyWithSuggestions' : 'missingKey',
        data: {
          key,
          suggestions: suggestions.join(', '),
        },
      };

      context.report(report);
    }

    /**
     * Report invalid translation key
     */
    function reportInvalidKey(node: TSESTree.Node, key: string) {
      context.report({
        node: node as any,
        messageId: 'invalidKey',
        data: { key },
      });
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      CallExpression(node: any) {
        const key = extractTranslationKeyEnhanced(node);
        
        if (!key) {
          return;
        }

        // Validate key format using enhanced validation
        if (!validateKeyFormat(key, ['common', 'themes', 'core', 'components', 'gallery', 'charts', 'auth', 'chat', 'monaco'])) {
          reportInvalidKey(node.arguments[0], key);
          return;
        }

        // Load translations
        const translations = loadTranslations();
        
        if (Object.keys(translations).length === 0) {
          // No translations loaded, skip validation
          return;
        }

        // Check if key exists using enhanced validation
        if (!hasTranslationKeyEnhanced(key, translationFiles)) {
          reportMissingKey(node.arguments[0], key, translations);
        }
      },
    };
  },
};

export default noUntranslatedKeys;
