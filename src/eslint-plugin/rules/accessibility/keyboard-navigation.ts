/**
 * @file ESLint rule: keyboard-navigation
 * Ensures interactive elements have proper keyboard navigation support
 */

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';
import type { AccessibilityRuleOptions } from '../../types.js';
// import { 
//   getNodeText,
//   getNodeLocation
// } from '../../utils'; // TODO: Implement node text and location utilities

// ============================================================================
// Interactive Elements Data
// ============================================================================

const INTERACTIVE_ELEMENTS = new Set([
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'details',
  'summary',
]);

const INTERACTIVE_ROLES = new Set([
  'button',
  'link',
  'menuitem',
  'tab',
  'option',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'combobox',
  'textbox',
  'searchbox',
  'spinbutton',
  'treeitem',
  'gridcell',
  'columnheader',
  'rowheader',
]);

const ELEMENTS_WITH_DEFAULT_KEYBOARD = new Set([
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'details',
  'summary',
]);

// ============================================================================
// Rule Definition
// ============================================================================

export const keyboardNavigation: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure interactive elements have proper keyboard navigation support',
      category: 'Accessibility',
      recommended: true,
      url: 'https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/accessibility/keyboard-navigation.ts',
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
          checkKeyboard: {
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
      missingTabIndex: 'Interactive element should have tabIndex attribute for keyboard navigation',
      invalidTabIndex: 'Interactive element should have tabIndex="0" or tabIndex="-1"',
      missingKeyboardHandler: 'Interactive element should have keyboard event handlers (onKeyDown, onKeyPress, onKeyUp)',
      missingFocusHandler: 'Interactive element should have focus event handlers (onFocus, onBlur)',
      nonInteractiveWithTabIndex: 'Non-interactive element should not have tabIndex attribute',
      missingRole: 'Interactive element should have appropriate ARIA role',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options[0] as AccessibilityRuleOptions || {};
    const enabled = options.enabled !== false;
    const checkKeyboard = options.checkKeyboard !== false;
    const ignorePatterns = options.ignorePatterns || [];

    // Early return if rule is disabled
    if (!enabled) {
      return {} as Rule.RuleListener;
    }

    // ========================================================================
    // Helper Functions
    // ========================================================================

    /**
     * Check if element should be ignored based on patterns
     */
    function shouldIgnoreElement(node: TSESTree.JSXElement): boolean {
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
     * Get element name
     */
    function getElementName(node: TSESTree.JSXElement): string | null {
      if (node.openingElement.name.type === 'JSXIdentifier') {
        return node.openingElement.name.name;
      }
      return null;
    }

    /**
     * Get ARIA role from element
     */
    function getAriaRole(node: TSESTree.JSXElement): string | null {
      for (const attribute of node.openingElement.attributes) {
        if (attribute.type === 'JSXAttribute' && 
            attribute.name.type === 'JSXIdentifier' && 
            attribute.name.name === 'role') {
          if (attribute.value && attribute.value.type === 'Literal' && 
              typeof attribute.value.value === 'string') {
            return attribute.value.value;
          }
        }
      }
      return null;
    }

    /**
     * Get tabIndex value
     */
    function getTabIndex(node: TSESTree.JSXElement): string | null {
      for (const attribute of node.openingElement.attributes) {
        if (attribute.type === 'JSXAttribute' && 
            attribute.name.type === 'JSXIdentifier' && 
            attribute.name.name === 'tabIndex') {
          if (attribute.value && attribute.value.type === 'Literal') {
            return String(attribute.value.value);
          }
        }
      }
      return null;
    }

    /**
     * Check if element has keyboard event handlers
     */
    function hasKeyboardHandlers(node: TSESTree.JSXElement): boolean {
      const keyboardEvents = ['onKeyDown', 'onKeyPress', 'onKeyUp'];
      
      for (const attribute of node.openingElement.attributes) {
        if (attribute.type === 'JSXAttribute' && 
            attribute.name.type === 'JSXIdentifier' && 
            keyboardEvents.includes(attribute.name.name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Check if element has focus event handlers
     */
    function hasFocusHandlers(node: TSESTree.JSXElement): boolean {
      const focusEvents = ['onFocus', 'onBlur'];
      
      for (const attribute of node.openingElement.attributes) {
        if (attribute.type === 'JSXAttribute' && 
            attribute.name.type === 'JSXIdentifier' && 
            focusEvents.includes(attribute.name.name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Check if element is interactive
     */
    function isInteractiveElement(node: TSESTree.JSXElement): boolean {
      const elementName = getElementName(node);
      const role = getAriaRole(node);

      // Check if it's a native interactive element
      if (elementName && INTERACTIVE_ELEMENTS.has(elementName)) {
        return true;
      }

      // Check if it has an interactive role
      if (role && INTERACTIVE_ROLES.has(role)) {
        return true;
      }

      // Check if it has event handlers that suggest interactivity
      if (hasKeyboardHandlers(node) || hasFocusHandlers(node)) {
        return true;
      }

      return false;
    }

    /**
     * Check if element has default keyboard support
     */
    function hasDefaultKeyboardSupport(node: TSESTree.JSXElement): boolean {
      const elementName = getElementName(node);
      return elementName ? ELEMENTS_WITH_DEFAULT_KEYBOARD.has(elementName) : false;
    }

    /**
     * Report missing tabIndex
     */
    function reportMissingTabIndex(node: TSESTree.JSXElement) {
      context.report({
        node,
        messageId: 'missingTabIndex',
        fix: (fixer) => {
          return fixer.insertTextAfter(node.openingElement.name, ' tabIndex={0}');
        },
      });
    }

    /**
     * Report invalid tabIndex
     */
    function reportInvalidTabIndex(node: TSESTree.JSXElement) {
      context.report({
        node,
        messageId: 'invalidTabIndex',
      });
    }

    /**
     * Report missing keyboard handlers
     */
    function reportMissingKeyboardHandlers(node: TSESTree.JSXElement) {
      context.report({
        node,
        messageId: 'missingKeyboardHandler',
      });
    }

    /**
     * Report missing focus handlers
     */
    function reportMissingFocusHandlers(node: TSESTree.JSXElement) {
      context.report({
        node,
        messageId: 'missingFocusHandler',
      });
    }

    /**
     * Report non-interactive element with tabIndex
     */
    function reportNonInteractiveWithTabIndex(node: TSESTree.JSXElement) {
      context.report({
        node,
        messageId: 'nonInteractiveWithTabIndex',
      });
    }

    /**
     * Report missing role
     */
    function reportMissingRole(node: TSESTree.JSXElement) {
      context.report({
        node,
        messageId: 'missingRole',
      });
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      JSXElement(node: any) {
        if (!checkKeyboard) {
          return;
        }

        // Check if element should be ignored
        if (shouldIgnoreElement(node)) {
          return;
        }

        const elementName = getElementName(node);
        const role = getAriaRole(node);
        const tabIndex = getTabIndex(node);
        const isInteractive = isInteractiveElement(node);
        const hasDefaultKeyboard = hasDefaultKeyboardSupport(node);

        // Check non-interactive elements with tabIndex
        if (!isInteractive && tabIndex !== null) {
          reportNonInteractiveWithTabIndex(node);
          return;
        }

        // Skip if not interactive
        if (!isInteractive) {
          return;
        }

        // Check for missing role on custom interactive elements
        if (!elementName || !INTERACTIVE_ELEMENTS.has(elementName)) {
          if (!role || !INTERACTIVE_ROLES.has(role)) {
            reportMissingRole(node);
          }
        }

        // Check tabIndex for interactive elements
        if (!hasDefaultKeyboard) {
          if (tabIndex === null) {
            reportMissingTabIndex(node);
          } else if (tabIndex !== '0' && tabIndex !== '-1') {
            reportInvalidTabIndex(node);
          }
        }

        // Check for keyboard event handlers on custom interactive elements
        if (!hasDefaultKeyboard && !hasKeyboardHandlers(node)) {
          reportMissingKeyboardHandlers(node);
        }

        // Check for focus event handlers on custom interactive elements
        if (!hasDefaultKeyboard && !hasFocusHandlers(node)) {
          reportMissingFocusHandlers(node);
        }
      },
    };
  },
};

export default keyboardNavigation;
