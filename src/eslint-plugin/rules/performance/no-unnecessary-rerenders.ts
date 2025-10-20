/**
 * @file ESLint rule: no-unnecessary-rerenders
 * Detects potential unnecessary re-renders in SolidJS components
 */

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';
import type { PerformanceRuleOptions } from '../../types.js';
import { 
  isSolidJSComponent
} from '../../utils/index.js';

// ============================================================================
// Rule Definition
// ============================================================================

export const noUnnecessaryRerenders: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect potential unnecessary re-renders in SolidJS components',
      category: 'Performance',
      recommended: true,
      url: 'https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/performance/no-unnecessary-rerenders.ts',
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
          checkRerenders: {
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
      inlineFunction: 'Inline function in JSX prop may cause unnecessary re-renders. Consider using createMemo or moving function outside component',
      inlineObject: 'Inline object in JSX prop may cause unnecessary re-renders. Consider using createMemo or moving object outside component',
      inlineArray: 'Inline array in JSX prop may cause unnecessary re-renders. Consider using createMemo or moving array outside component',
      missingMemo: 'Expensive computation should be memoized with createMemo',
      unstableDependency: 'Signal dependency may be unstable. Consider using createMemo for derived values',
      suggestMemo: 'Consider wrapping this expression with createMemo for better performance',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options[0] as PerformanceRuleOptions || {};
    const enabled = options.enabled !== false;
    const checkRerenders = options.checkRerenders !== false;
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
     * Check if expression is expensive
     */
    function isExpensiveExpression(expr: TSESTree.Expression): boolean {
      // Check for complex expressions that should be memoized
      if (expr.type === 'CallExpression') {
        const callee = expr.callee;
        if (callee.type === 'MemberExpression') {
          // Array methods like .map, .filter, .reduce
          if (callee.property.type === 'Identifier') {
            const methodName = callee.property.name;
            if (['map', 'filter', 'reduce', 'find', 'some', 'every'].includes(methodName)) {
              return true;
            }
          }
        }
      }

      // Check for mathematical operations
      if (expr.type === 'BinaryExpression') {
        const operators = ['*', '/', '%', '**'];
        if (operators.includes(expr.operator)) {
          return true;
        }
      }

      // Check for ternary with complex expressions
      if (expr.type === 'ConditionalExpression') {
        return isExpensiveExpression(expr.consequent) || isExpensiveExpression(expr.alternate);
      }

      return false;
    }

    /**
     * Check if expression is already memoized
     */
    function isMemoizedExpression(expr: TSESTree.Expression): boolean {
      if (expr.type === 'CallExpression') {
        const callee = expr.callee;
        if (callee.type === 'Identifier' && callee.name === 'createMemo') {
          return true;
        }
      }
      return false;
    }

    /**
     * Check if expression is a signal
     */
    function isSignalExpression(expr: TSESTree.Expression): boolean {
      if (expr.type === 'CallExpression') {
        const callee = expr.callee;
        if (callee.type === 'Identifier') {
          const signalNames = ['createSignal', 'createMemo', 'createEffect', 'createResource'];
          return signalNames.includes(callee.name);
        }
      }
      return false;
    }

    /**
     * Report inline function
     */
    function reportInlineFunction(node: TSESTree.JSXAttribute) {
      context.report({
        node,
        messageId: 'inlineFunction',
        fix: (_fixer: any) => {
          // Suggest moving function outside component or using createMemo
          return null; // No automatic fix for this case
        },
      });
    }

    /**
     * Report inline object
     */
    function reportInlineObject(node: TSESTree.JSXAttribute) {
      context.report({
        node,
        messageId: 'inlineObject',
        fix: (_fixer: any) => {
          // Suggest moving object outside component or using createMemo
          return null; // No automatic fix for this case
        },
      });
    }

    /**
     * Report inline array
     */
    function reportInlineArray(node: TSESTree.JSXAttribute) {
      context.report({
        node,
        messageId: 'inlineArray',
        fix: (_fixer: any) => {
          // Suggest moving array outside component or using createMemo
          return null; // No automatic fix for this case
        },
      });
    }

    /**
     * Report missing memo
     */
    function reportMissingMemo(node: TSESTree.Expression) {
      context.report({
        node,
        messageId: 'missingMemo',
        fix: (_fixer: any) => {
          // const sourceCode = context.getSourceCode(); // TODO: Use for more precise replacement
          // const nodeText = getNodeText(node, sourceCode.getText()); // TODO: Use for more precise replacement
          return _fixer.replaceText(node, `createMemo(() => expression)`);
        },
      });
    }

    /**
     * Report unstable dependency
     */
    function reportUnstableDependency(node: TSESTree.Expression) {
      context.report({
        node,
        messageId: 'unstableDependency',
      });
    }

    /**
     * Report suggest memo
     */
    function reportSuggestMemo(node: TSESTree.Expression) {
      context.report({
        node,
        messageId: 'suggestMemo',
        fix: (_fixer: any) => {
          // const sourceCode = context.getSourceCode(); // TODO: Use for more precise replacement
          // const nodeText = getNodeText(node, sourceCode.getText()); // TODO: Use for more precise replacement
          return _fixer.replaceText(node, `createMemo(() => expression)`);
        },
      });
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      JSXElement(node: any) {
        if (!checkRerenders) {
          return;
        }

        // Check if element should be ignored
        if (shouldIgnoreElement(node)) {
          return;
        }

        // Check if it's a SolidJS component
        if (!isSolidJSComponent(node)) {
          return;
        }

        // Check for inline functions, objects, and arrays in props
        for (const attribute of node.openingElement.attributes) {
          if (attribute.type === 'JSXAttribute' && attribute.value) {
            if (attribute.value.type === 'JSXExpressionContainer') {
              const expression = attribute.value.expression;
              
              // Check for inline functions
              if (expression.type === 'ArrowFunctionExpression' || 
                  expression.type === 'FunctionExpression') {
                reportInlineFunction(attribute);
              }
              
              // Check for inline objects
              else if (expression.type === 'ObjectExpression') {
                reportInlineObject(attribute);
              }
              
              // Check for inline arrays
              else if (expression.type === 'ArrayExpression') {
                reportInlineArray(attribute);
              }
              
              // Check for expensive expressions
              else if (isExpensiveExpression(expression) && !isMemoizedExpression(expression)) {
                reportMissingMemo(expression);
              }
            }
          }
        }
      },

      // Check for expensive computations in component body
      CallExpression(node: any) {
        if (!checkRerenders) {
          return;
        }

        // Check if we're inside a component
        const parent = node.parent;
        if (!parent || parent.type !== 'JSXExpressionContainer') {
          return;
        }

        // Check for expensive computations that should be memoized
        if (isExpensiveExpression(node) && !isMemoizedExpression(node)) {
          reportSuggestMemo(node);
        }
      },

      // Check for signal dependencies
      BinaryExpression(node: any) {
        if (!checkRerenders) {
          return;
        }

        // Check for signal operations that might be unstable
        if (node.operator === '+' || node.operator === '-') {
          if (isSignalExpression(node.left) || isSignalExpression(node.right)) {
            reportUnstableDependency(node);
          }
        }
      },
    };
  },
};

export default noUnnecessaryRerenders;
