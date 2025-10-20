/**
 * @file ESLint rule: prefer-memo
 * Suggests memoization for expensive computations
 */

import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';
import type { PerformanceRuleOptions } from '../../types.js';
// import { 
//   isSolidJSComponent
// } from '../../utils'; // TODO: Implement component detection

// ============================================================================
// Rule Definition
// ============================================================================

export const preferMemo: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest memoization for expensive computations',
      category: 'Performance',
      recommended: true,
      url: 'https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/performance/prefer-memo.ts',
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
          checkMemoization: {
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
      expensiveComputation: 'Expensive computation detected. Consider using createMemo for better performance',
      arrayOperation: 'Array operation should be memoized to prevent unnecessary re-computation',
      mathematicalOperation: 'Mathematical operation should be memoized for better performance',
      stringOperation: 'String operation should be memoized to prevent unnecessary re-computation',
      objectOperation: 'Object operation should be memoized for better performance',
      suggestMemo: 'Consider wrapping this expression with createMemo',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options[0] as PerformanceRuleOptions || {};
    const enabled = options.enabled !== false;
    const checkMemoization = options.checkMemoization !== false;
    // const ignorePatterns = options.ignorePatterns || []; // TODO: Implement ignore patterns

    // Early return if rule is disabled
    if (!enabled) {
      return {} as Rule.RuleListener;
    }

    // ========================================================================
    // Helper Functions
    // ========================================================================

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
     * TODO: Implement signal detection
     */
    // function isSignalExpression(expr: TSESTree.Expression): boolean {
    //   if (expr.type === 'CallExpression') {
    //     const callee = expr.callee;
    //     if (callee.type === 'Identifier') {
    //       const signalNames = ['createSignal', 'createMemo', 'createEffect', 'createResource'];
    //       return signalNames.includes(callee.name);
    //     }
    //   }
    //   return false;
    // }

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
            if (['map', 'filter', 'reduce', 'find', 'some', 'every', 'sort', 'reverse'].includes(methodName)) {
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

      // Check for string operations
      if (expr.type === 'CallExpression') {
        const callee = expr.callee;
        if (callee.type === 'MemberExpression' && 
            callee.property.type === 'Identifier') {
          const methodName = callee.property.name;
          if (['toUpperCase', 'toLowerCase', 'trim', 'replace', 'split', 'join'].includes(methodName)) {
            return true;
          }
        }
      }

      // Check for object operations
      if (expr.type === 'CallExpression') {
        const callee = expr.callee;
        if (callee.type === 'MemberExpression' && 
            callee.property.type === 'Identifier') {
          const methodName = callee.property.name;
          if (['keys', 'values', 'entries', 'assign', 'freeze', 'seal'].includes(methodName)) {
            return true;
          }
        }
      }

      return false;
    }

    /**
     * Check if expression is in a component context
     */
    function isInComponentContext(node: TSESTree.Node): boolean {
      let current = node.parent;
      while (current) {
        if (current.type === 'FunctionDeclaration' || 
            current.type === 'FunctionExpression' || 
            current.type === 'ArrowFunctionExpression') {
          // Check if this is a component function
          if (current.type === 'FunctionDeclaration' && current.id) {
            const name = current.id.name;
            return /^[A-Z]/.test(name); // Component names start with uppercase
          }
          return true; // Assume it's a component if it's a function
        }
        current = current.parent;
      }
      return false;
    }

    /**
     * Report expensive computation
     */
    function reportExpensiveComputation(node: TSESTree.Expression, messageId: string) {
      context.report({
        node,
        messageId,
        fix: (fixer) => {
          // const sourceCode = context.getSourceCode(); // TODO: Use for more precise replacement
          // const nodeText = getNodeText(node, sourceCode.getText()); // TODO: Use for more precise replacement
          return fixer.replaceText(node, `createMemo(() => expression)`);
        },
      });
    }

    /**
     * Report suggest memo
     */
    function reportSuggestMemo(node: TSESTree.Expression) {
      context.report({
        node,
        messageId: 'suggestMemo',
        fix: (fixer) => {
          // const sourceCode = context.getSourceCode(); // TODO: Use for more precise replacement
          // const nodeText = getNodeText(node, sourceCode.getText()); // TODO: Use for more precise replacement
          return fixer.replaceText(node, `createMemo(() => expression)`);
        },
      });
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      // Check for expensive computations in JSX expressions
      JSXExpressionContainer(node: any) {
        if (!checkMemoization) {
          return;
        }

        const expression = node.expression;
        
        // Skip if already memoized
        if (isMemoizedExpression(expression)) {
          return;
        }

        // Check for expensive expressions
        if (isExpensiveExpression(expression)) {
          if (expression.type === 'CallExpression') {
            const callee = expression.callee;
            if (callee.type === 'MemberExpression' && 
                callee.property.type === 'Identifier') {
              const methodName = callee.property.name;
              
              if (['map', 'filter', 'reduce', 'find', 'some', 'every', 'sort', 'reverse'].includes(methodName)) {
                reportExpensiveComputation(expression, 'arrayOperation');
              } else if (['toUpperCase', 'toLowerCase', 'trim', 'replace', 'split', 'join'].includes(methodName)) {
                reportExpensiveComputation(expression, 'stringOperation');
              } else if (['keys', 'values', 'entries', 'assign', 'freeze', 'seal'].includes(methodName)) {
                reportExpensiveComputation(expression, 'objectOperation');
              } else {
                reportExpensiveComputation(expression, 'expensiveComputation');
              }
            }
          } else if (expression.type === 'BinaryExpression') {
            reportExpensiveComputation(expression, 'mathematicalOperation');
          }
        }
      },

      // Check for expensive computations in variable declarations
      VariableDeclarator(node: any) {
        if (!checkMemoization) {
          return;
        }

        if (!node.init || !isInComponentContext(node)) {
          return;
        }

        // Skip if already memoized
        if (isMemoizedExpression(node.init)) {
          return;
        }

        // Check for expensive expressions
        if (isExpensiveExpression(node.init)) {
          reportSuggestMemo(node.init);
        }
      },

      // Check for expensive computations in return statements
      ReturnStatement(node: any) {
        if (!checkMemoization) {
          return;
        }

        if (!node.argument || !isInComponentContext(node)) {
          return;
        }

        // Skip if already memoized
        if (isMemoizedExpression(node.argument)) {
          return;
        }

        // Check for expensive expressions
        if (isExpensiveExpression(node.argument)) {
          reportSuggestMemo(node.argument);
        }
      },

      // Check for expensive computations in binary expressions
      BinaryExpression(node: any) {
        if (!checkMemoization) {
          return;
        }

        if (!isInComponentContext(node)) {
          return;
        }

        // Skip if already memoized
        if (isMemoizedExpression(node)) {
          return;
        }

        // Check for mathematical operations
        if (node.operator === '*' || node.operator === '/' || node.operator === '%' || node.operator === '**') {
          reportExpensiveComputation(node, 'mathematicalOperation');
        }
      },
    };
  },
};

export default preferMemo;
