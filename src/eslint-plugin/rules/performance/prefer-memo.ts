/**
 * @file ESLint rule: prefer-memo
 * Suggests memoization for expensive computations
 */

import type { Rule } from "eslint";
import type { TSESTree } from "@typescript-eslint/types";
import type { PerformanceRuleOptions } from "../../types.js";
import {
  isMemoizedExpression,
  isExpensiveExpression,
  isInComponentContext,
  isInsideMemoizationContext,
  getMessageId,
} from "./prefer-memo-utils.js";

export const preferMemo: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Suggest memoization for expensive computations",
      category: "Performance",
      recommended: true,
      url: "https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/performance/prefer-memo.ts",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          enabled: { type: "boolean", default: true },
          checkMemoization: { type: "boolean", default: true },
          ignorePatterns: { type: "array", items: { type: "string" }, default: [] },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      expensiveComputation: "Expensive computation detected. Consider using createMemo for better performance",
      arrayOperation: "Array operation should be memoized to prevent unnecessary re-computation",
      mathematicalOperation: "Mathematical operation should be memoized for better performance",
      stringOperation: "String operation should be memoized to prevent unnecessary re-computation",
      objectOperation: "Object operation should be memoized for better performance",
      suggestMemo: "Consider wrapping this expression with createMemo",
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = (context.options[0] as PerformanceRuleOptions) || {};
    const enabled = options.enabled !== false;
    const checkMemoization = options.checkMemoization !== false;

    if (!enabled) return {} as Rule.RuleListener;

    // Cache for component context checks to avoid repeated expensive traversals
    const componentContextCache = new Map<TSESTree.Node, boolean>();
    const memoizationContextCache = new Map<TSESTree.Node, boolean>();

    const isInComponentContextCached = (node: TSESTree.Node): boolean => {
      if (componentContextCache.has(node)) {
        return componentContextCache.get(node)!;
      }
      const result = isInComponentContext(node);
      componentContextCache.set(node, result);
      return result;
    };

    const isInsideMemoizationContextCached = (node: TSESTree.Node): boolean => {
      if (memoizationContextCache.has(node)) {
        return memoizationContextCache.get(node)!;
      }
      const result = isInsideMemoizationContext(node);
      memoizationContextCache.set(node, result);
      return result;
    };

    const report = (node: TSESTree.Expression, messageId: string) => {
      context.report({
        node,
        messageId,
        fix: fixer => fixer.replaceText(node, "createMemo(() => expression)"),
      });
    };

    return {
      JSXExpressionContainer(node: any) {
        if (!checkMemoization) return;
        const expression = node.expression;
        if (expression.type === "JSXEmptyExpression" || isMemoizedExpression(expression)) return;
        if (isExpensiveExpression(expression)) {
          report(expression, getMessageId(expression));
        }
      },

      VariableDeclarator(node: any) {
        if (!checkMemoization || !node.init) return;
        if (isMemoizedExpression(node.init)) return;
        if (!isInComponentContextCached(node)) return;
        if (isExpensiveExpression(node.init)) {
          report(node.init, "suggestMemo");
        }
      },

      ReturnStatement(node: any) {
        if (!checkMemoization || !node.argument) return;
        if (isMemoizedExpression(node.argument)) return;
        if (!isInComponentContextCached(node)) return;
        if (isExpensiveExpression(node.argument)) {
          report(node.argument, "suggestMemo");
        }
      },

      BinaryExpression(node: any) {
        if (!checkMemoization) return;
        // Early return for non-mathematical operations
        if (!["*", "/", "%", "**"].includes(node.operator)) return;
        if (isMemoizedExpression(node)) return;
        if (!isInComponentContextCached(node)) return;
        if (isInsideMemoizationContextCached(node)) return;
        report(node, "mathematicalOperation");
      },
    };
  },
};

export default preferMemo;
