/**
 * @file ESLint rule: no-hardcoded-strings
 * Detects hardcoded strings in JSX/TSX files that should be internationalized
 */

import type { Rule } from "eslint";
import type { TSESTree } from "@typescript-eslint/types";
import type { I18nRuleOptions } from "../../types.js";
import { isHardcodedString } from "../../utils/index.js";

// ============================================================================
// Rule Definition
// ============================================================================

export const noHardcodedStrings: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded strings in JSX/TSX files",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/i18n/no-hardcoded-strings.ts",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          enabled: {
            type: "boolean",
            default: true,
          },
          ignorePatterns: {
            type: "array",
            items: { type: "string" },
            default: [],
          },
          minLength: {
            type: "number",
            default: 3,
          },
          autoFix: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      hardcodedString: 'Hardcoded string "{{text}}" should be internationalized using t("{{suggestedKey}}")',
      hardcodedStringNoFix: 'Hardcoded string "{{text}}" should be internationalized',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = (context.options[0] as I18nRuleOptions) || {};
    const enabled = options.enabled !== false;
    const ignorePatterns = options.ignorePatterns || [];
    const minLength = options.minLength || 3;
    const autoFix = options.autoFix || false;

    // Early return if rule is disabled
    if (!enabled) {
      return {} as Rule.RuleListener;
    }

    // ========================================================================
    // Helper Functions
    // ========================================================================

    /**
     * Generate a suggested i18n key from text
     */
    function generateI18nKey(text: string): string {
      // Convert to lowercase, replace spaces and special chars with dots
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, ".")
        .substring(0, 50); // Limit length
    }

    /**
     * Check if a string should be ignored
     */
    function shouldIgnoreString(text: string): boolean {
      return !isHardcodedString(text, minLength, ignorePatterns);
    }

    /**
     * Report hardcoded string with fix suggestion
     */
    function reportHardcodedString(node: TSESTree.Node, text: string) {
      const suggestedKey = generateI18nKey(text);

      const messageId = autoFix ? "hardcodedString" : "hardcodedStringNoFix";

      const report: Rule.ReportDescriptor = {
        node: node as any,
        messageId,
        data: {
          text,
          suggestedKey,
        },
      };

      // Add fix if auto-fix is enabled
      if (autoFix) {
        report.fix = (fixer: any) => {
          // const sourceCode = context.getSourceCode(); // TODO: Use for more precise replacement

          // Replace the hardcoded string with t() call
          const replacement = `t("${suggestedKey}")`;
          return fixer.replaceText(node, replacement);
        };
      }

      context.report(report);
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      // Check JSX text nodes
      JSXText(node: any) {
        const text = node.value.trim();

        if (text && !shouldIgnoreString(text)) {
          reportHardcodedString(node, text);
        }
      },

      // Check string literals in JSX attributes
      JSXAttribute(node: any) {
        if (node.value && node.value.type === "Literal" && typeof node.value.value === "string") {
          const text = node.value.value;

          if (!shouldIgnoreString(text)) {
            reportHardcodedString(node.value, text);
          }
        }
      },

      // Check string literals in JSX expressions
      JSXExpressionContainer(node: any) {
        if (node.expression.type === "Literal" && typeof node.expression.value === "string") {
          const text = node.expression.value;

          if (!shouldIgnoreString(text)) {
            reportHardcodedString(node.expression, text);
          }
        }
      },

      // Check string literals in template literals
      TemplateLiteral(node: any) {
        // Only check if it's a simple template literal with no expressions
        if (node.expressions.length === 0 && node.quasis.length === 1) {
          const text = node.quasis[0].value.raw;

          if (!shouldIgnoreString(text)) {
            reportHardcodedString(node, text);
          }
        }
      },

      // Check string literals in variable declarations (for potential i18n keys)
      VariableDeclarator(node: any) {
        if (node.init && node.init.type === "Literal" && typeof node.init.value === "string") {
          const text = node.init.value;

          // Only check if the variable name suggests it's a display string
          if (node.id.type === "Identifier") {
            const varName = node.id.name.toLowerCase();
            const isDisplayString =
              varName.includes("text") ||
              varName.includes("label") ||
              varName.includes("title") ||
              varName.includes("message") ||
              varName.includes("placeholder");

            if (isDisplayString && !shouldIgnoreString(text)) {
              reportHardcodedString(node.init, text);
            }
          }
        }
      },

      // Check string literals in object properties
      Property(node: any) {
        if (node.value.type === "Literal" && typeof node.value.value === "string") {
          const text = node.value.value;

          // Check if the property key suggests it's a display string
          if (node.key.type === "Identifier") {
            const keyName = node.key.name.toLowerCase();
            const isDisplayString =
              keyName.includes("text") ||
              keyName.includes("label") ||
              keyName.includes("title") ||
              keyName.includes("message") ||
              keyName.includes("placeholder");

            if (isDisplayString && !shouldIgnoreString(text)) {
              reportHardcodedString(node.value, text);
            }
          }
        }
      },
    };
  },
};

export default noHardcodedStrings;
