/**
 * @file ESLint rule: prefer-i18n-keys
 * Detects string concatenation and suggests i18n key usage
 */

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';
import type { I18nRuleOptions } from '../../types.js';
import { 
  isHardcodedString
} from '../../utils/index.js';

// ============================================================================
// Rule Definition
// ============================================================================

export const preferI18nKeys: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer i18n keys over string concatenation',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/i18n/prefer-i18n-keys.ts',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          enabled: {
            type: 'boolean',
            default: true,
          },
          ignorePatterns: {
            type: 'array',
            items: { type: 'string' },
            default: [],
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
      stringConcatenation: 'String concatenation detected. Consider using i18n keys with parameters: t("{{suggestedKey}}", { {{params}} })',
      stringConcatenationNoFix: 'String concatenation detected. Consider using i18n keys with parameters',
      templateLiteral: 'Template literal detected. Consider using i18n keys with parameters: t("{{suggestedKey}}", { {{params}} })',
      templateLiteralNoFix: 'Template literal detected. Consider using i18n keys with parameters',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options[0] as I18nRuleOptions || {};
    const enabled = options.enabled !== false;
    const ignorePatterns = options.ignorePatterns || [];
    const autoFix = options.autoFix || false;

    // Early return if rule is disabled
    if (!enabled) {
      return {} as Rule.RuleListener;
    }

    // ========================================================================
    // Helper Functions
    // ========================================================================

    /**
     * Generate a suggested i18n key from concatenated strings
     */
    function generateI18nKey(parts: string[]): string {
      // Join parts and create a key
      const combined = parts.join(' ').toLowerCase();
      return combined
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '.')
        .substring(0, 50);
    }

    /**
     * Extract string parts from binary expression
     */
    function extractStringParts(node: TSESTree.BinaryExpression): string[] {
      const parts: string[] = [];

      function traverse(expr: TSESTree.Expression) {
        if (expr.type === 'Literal' && typeof expr.value === 'string') {
          parts.push(expr.value);
        } else if (expr.type === 'BinaryExpression' && expr.operator === '+') {
          traverse(expr.left);
          traverse(expr.right);
        } else if (expr.type === 'Identifier' || expr.type === 'MemberExpression') {
          // This is a variable reference - we'll suggest a parameter
          parts.push(`{{${getVariableName(expr)}}}`);
        }
      }

      traverse(node);
      return parts;
    }

    /**
     * Extract string parts from template literal
     */
    function extractTemplateParts(node: TSESTree.TemplateLiteral): { parts: string[]; expressions: string[] } {
      const parts: string[] = [];
      const expressions: string[] = [];

      for (let i = 0; i < node.quasis.length; i++) {
        const quasi = node.quasis[i];
        if (quasi.value.raw) {
          parts.push(quasi.value.raw);
        }

        if (i < node.expressions.length) {
          const expr = node.expressions[i];
          const varName = getVariableName(expr);
          expressions.push(varName);
          parts.push(`{{${varName}}}`);
        }
      }

      return { parts, expressions };
    }

    /**
     * Get variable name from expression
     */
    function getVariableName(expr: TSESTree.Expression): string {
      if (expr.type === 'Identifier') {
        return expr.name;
      } else if (expr.type === 'MemberExpression') {
        const object = getVariableName(expr.object);
        const property = expr.property.type === 'Identifier' ? expr.property.name : 'prop';
        return `${object}.${property}`;
      }
      return 'value';
    }

    /**
     * Generate parameter object string
     */
    function generateParams(expressions: string[]): string {
      return expressions.map(expr => `${expr}: ${expr}`).join(', ');
    }

    /**
     * Check if string concatenation should be ignored
     */
    function shouldIgnoreConcatenation(parts: string[]): boolean {
      // Check if any part is a hardcoded string that should be ignored
      for (const part of parts) {
        if (typeof part === 'string' && isHardcodedString(part, 3, ignorePatterns)) {
          return false; // Don't ignore if it contains hardcoded strings
        }
      }
      return true;
    }

    /**
     * Report string concatenation
     */
    function reportStringConcatenation(node: TSESTree.Node, parts: string[], expressions: string[] = []) {
      const suggestedKey = generateI18nKey(parts.filter(p => !p.startsWith('{{')));
      const params = generateParams(expressions);
      
      const messageId = autoFix ? 'stringConcatenation' : 'stringConcatenationNoFix';
      
      const report: Rule.ReportDescriptor = {
        node: node as any,
        messageId,
        data: {
          suggestedKey,
          params,
        },
      };

      // Add fix if auto-fix is enabled
      if (autoFix && expressions.length > 0) {
        report.fix = (fixer: any) => {
          // const sourceCode = context.getSourceCode(); // TODO: Use for more precise replacement
          // const nodeText = getNodeText(node, sourceCode.getText()); // TODO: Use for more precise replacement
          
          // Replace with t() call
          const replacement = `t("${suggestedKey}", { ${params} })`;
          return fixer.replaceText(node, replacement);
        };
      }

      context.report(report);
    }

    /**
     * Report template literal
     */
    function reportTemplateLiteral(node: TSESTree.Node, parts: string[], expressions: string[]) {
      const suggestedKey = generateI18nKey(parts.filter(p => !p.startsWith('{{')));
      const params = generateParams(expressions);
      
      const messageId = autoFix ? 'templateLiteral' : 'templateLiteralNoFix';
      
      const report: Rule.ReportDescriptor = {
        node: node as any,
        messageId,
        data: {
          suggestedKey,
          params,
        },
      };

      // Add fix if auto-fix is enabled
      if (autoFix && expressions.length > 0) {
        report.fix = (fixer: any) => {
          // const sourceCode = context.getSourceCode(); // TODO: Use for more precise replacement
          // const nodeText = getNodeText(node, sourceCode.getText()); // TODO: Use for more precise replacement
          
          // Replace with t() call
          const replacement = `t("${suggestedKey}", { ${params} })`;
          return fixer.replaceText(node, replacement);
        };
      }

      context.report(report);
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      // Check binary expressions with string concatenation
      BinaryExpression(node: any) {
        if (node.operator !== '+') {
          return;
        }

        const parts = extractStringParts(node);
        
        // Only report if we have multiple parts and at least one is a string
        if (parts.length < 2) {
          return;
        }

        const stringParts = parts.filter(p => typeof p === 'string' && !p.startsWith('{{'));
        if (stringParts.length === 0) {
          return;
        }

        if (!shouldIgnoreConcatenation(parts)) {
          const expressions = parts.filter(p => p.startsWith('{{')).map(p => p.slice(2, -2));
          reportStringConcatenation(node, parts, expressions);
        }
      },

      // Check template literals
      TemplateLiteral(node: any) {
        // Only check if it has expressions (variables)
        if (node.expressions.length === 0) {
          return;
        }

        const { parts, expressions } = extractTemplateParts(node);
        
        if (parts.length < 2) {
          return;
        }

        const stringParts = parts.filter(p => typeof p === 'string' && !p.startsWith('{{'));
        if (stringParts.length === 0) {
          return;
        }

        if (!shouldIgnoreConcatenation(parts)) {
          reportTemplateLiteral(node, parts, expressions);
        }
      },
    };
  },
};

export default preferI18nKeys;
