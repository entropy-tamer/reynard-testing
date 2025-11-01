/**
 * @file ESLint rule: no-untranslated-keys
 * Validates that translation keys exist in translation files
 */

import type { Rule } from 'eslint';

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

  create(_context: Rule.RuleContext): Rule.RuleListener {
    // TEMPORARILY DISABLED FOR PERFORMANCE DEBUGGING
    return {} as Rule.RuleListener;
  },
};

export default noUntranslatedKeys;
