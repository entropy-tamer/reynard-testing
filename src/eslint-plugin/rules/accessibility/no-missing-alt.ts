/**
 * @file ESLint rule: no-missing-alt
 * Ensures images have proper alt attributes for accessibility
 */

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';
import type { AccessibilityRuleOptions } from '../../types.js';
import { 
  hasAltAttribute,
  getAltAttributeValue
} from '../../utils/index.js';

// ============================================================================
// Rule Definition
// ============================================================================

export const noMissingAlt: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure images have proper alt attributes for accessibility',
      category: 'Accessibility',
      recommended: true,
      url: 'https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/accessibility/no-missing-alt.ts',
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
          requireAlt: {
            type: 'boolean',
            default: true,
          },
          ignorePatterns: {
            type: 'array',
            items: { type: 'string' },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingAlt: 'Image element must have an alt attribute for accessibility',
      emptyAlt: 'Image alt attribute should not be empty. Use alt="" for decorative images or provide descriptive text',
      invalidAlt: 'Image alt attribute should be descriptive and meaningful',
      decorativeImage: 'Consider using alt="" for decorative images',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options[0] as AccessibilityRuleOptions || {};
    const enabled = options.enabled !== false;
    const requireAlt = options.requireAlt !== false;
    const ignorePatterns = options.ignorePatterns || [];

    // Early return if rule is disabled
    if (!enabled) {
      return {} as Rule.RuleListener;
    }

    // ========================================================================
    // Helper Functions
    // ========================================================================

    /**
     * Check if an image should be ignored based on patterns
     */
    function shouldIgnoreImage(node: TSESTree.JSXElement): boolean {
      // Check for ignore patterns in className or other attributes
      for (const attribute of node.openingElement.attributes) {
        if (attribute.type === 'JSXAttribute' && 
            attribute.name.type === 'JSXIdentifier' && 
            attribute.name.name === 'className') {
          if (attribute.value && attribute.value.type === 'Literal' && 
              typeof attribute.value.value === 'string') {
            const className = attribute.value.value;
            for (const pattern of ignorePatterns) {
              if (new RegExp(pattern).test(className)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }

    /**
     * Check if an image is decorative based on context
     */
    function isDecorativeImage(node: TSESTree.JSXElement): boolean {
      // Check for decorative indicators in className
      for (const attribute of node.openingElement.attributes) {
        if (attribute.type === 'JSXAttribute' && 
            attribute.name.type === 'JSXIdentifier' && 
            attribute.name.name === 'className') {
          if (attribute.value && attribute.value.type === 'Literal' && 
              typeof attribute.value.value === 'string') {
            const className = attribute.value.value.toLowerCase();
            if (className.includes('decorative') || 
                className.includes('ornament') || 
                className.includes('icon') ||
                className.includes('logo')) {
              return true;
            }
          }
        }
      }
      return false;
    }

    /**
     * Validate alt text quality
     */
    function isValidAltText(altText: string): boolean {
      // Alt text should be meaningful
      if (altText.length < 2) {
        return false;
      }

      // Check for placeholder text
      const placeholderPatterns = [
        /^image$/i,
        /^picture$/i,
        /^photo$/i,
        /^img$/i,
        /^placeholder$/i,
        /^alt$/i,
        /^text$/i,
        /^description$/i,
      ];

      for (const pattern of placeholderPatterns) {
        if (pattern.test(altText)) {
          return false;
        }
      }

      return true;
    }

    /**
     * Report missing alt attribute
     */
    function reportMissingAlt(node: TSESTree.JSXElement) {
      const isDecorative = isDecorativeImage(node);
      
      const report: Rule.ReportDescriptor = {
        node: node as any,
        messageId: isDecorative ? 'decorativeImage' : 'missingAlt',
      };

      // Add fix for decorative images
      if (isDecorative) {
        report.fix = (fixer: any) => {
          return fixer.insertTextAfter((node as any).openingElement.name, ' alt=""');
        };
      }

      context.report(report);
    }

    /**
     * Report empty alt attribute
     */
    function reportEmptyAlt(node: TSESTree.JSXElement) {
      const isDecorative = isDecorativeImage(node);
      
      context.report({
        node,
        messageId: isDecorative ? 'decorativeImage' : 'emptyAlt',
        fix: isDecorative ? (fixer) => {
          // Fix empty alt to alt=""
          for (const attribute of node.openingElement.attributes) {
            if (attribute.type === 'JSXAttribute' && 
                attribute.name.type === 'JSXIdentifier' && 
                attribute.name.name === 'alt') {
              return fixer.replaceText(attribute, 'alt=""');
            }
          }
          return null;
        } : undefined,
      });
    }

    /**
     * Report invalid alt text
     */
    function reportInvalidAlt(node: TSESTree.JSXElement, altText: string) {
      context.report({
        node,
        messageId: 'invalidAlt',
        data: { altText },
      });
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      JSXElement(node: any) {
        // Only check img elements
        if (node.openingElement.name.type !== 'JSXIdentifier' || 
            node.openingElement.name.name !== 'img') {
          return;
        }

        // Check if image should be ignored
        if (shouldIgnoreImage(node)) {
          return;
        }

        // Check if alt attribute exists
        if (!hasAltAttribute(node)) {
          if (requireAlt) {
            reportMissingAlt(node);
          }
          return;
        }

        // Get alt attribute value
        const altValue = getAltAttributeValue(node);
        
        if (altValue === null) {
          // Alt attribute exists but has no value
          reportEmptyAlt(node);
          return;
        }

        if (altValue === '') {
          // Empty alt attribute
          reportEmptyAlt(node);
          return;
        }

        // Validate alt text quality
        if (!isValidAltText(altValue)) {
          reportInvalidAlt(node, altValue);
        }
      },
    };
  },
};

export default noMissingAlt;
