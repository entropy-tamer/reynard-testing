/**
 * @file Utility functions for prefer-memo ESLint rule
 */

import type { TSESTree } from "@typescript-eslint/types";

/**
 * Check if expression is already memoized
 */
export function isMemoizedExpression(expr: TSESTree.Expression): boolean {
  if (expr.type === "CallExpression") {
    const callee = expr.callee;
    if (callee.type === "Identifier") {
      // Check for SolidJS createMemo and Reynard memoization functions
      return ["createMemo", "memoizeMath", "memoize", "memoizeGeometry", "weakMemoize", "batchMemoize"].includes(
        callee.name
      );
    }
    // Check for MathMemo property access
    if (
      callee.type === "MemberExpression" &&
      callee.object.type === "Identifier" &&
      callee.object.name === "MathMemo" &&
      callee.property.type === "Identifier"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if expression is expensive
 */
export function isExpensiveExpression(expr: TSESTree.Expression): boolean {
  if (expr.type === "CallExpression") {
    const callee = expr.callee;
    if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
      const methodName = callee.property.name;
      const expensiveMethods = [
        "map",
        "filter",
        "reduce",
        "find",
        "some",
        "every",
        "sort",
        "reverse",
        "toUpperCase",
        "toLowerCase",
        "trim",
        "replace",
        "split",
        "join",
        "keys",
        "values",
        "entries",
        "assign",
        "freeze",
        "seal",
      ];
      return expensiveMethods.includes(methodName);
    }
  }

  // Check for mathematical operations
  if (expr.type === "BinaryExpression") {
    return ["*", "/", "%", "**"].includes(expr.operator);
  }

  return false;
}

/**
 * Check if expression is in a component context
 */
export function isInComponentContext(node: TSESTree.Node): boolean {
  let current = node.parent;
  let depth = 0;
  const maxDepth = 20; // Prevent infinite loops

  while (current && depth < maxDepth) {
    if (
      current.type === "FunctionDeclaration" ||
      current.type === "FunctionExpression" ||
      current.type === "ArrowFunctionExpression"
    ) {
      // Check if this is a component function
      if (current.type === "FunctionDeclaration" && current.id) {
        return /^[A-Z]/.test(current.id.name); // Component names start with uppercase
      }
      return true; // Assume it's a component if it's a function
    }
    current = current.parent;
    depth++;
  }
  return false;
}

/**
 * Check if expression is inside a memoization context
 */
export function isInsideMemoizationContext(node: TSESTree.Node): boolean {
  let current = node.parent;
  let depth = 0;
  const maxDepth = 20; // Prevent infinite loops

  while (current && depth < maxDepth) {
    if (current.type === "CallExpression") {
      const callee = current.callee;
      if (callee.type === "Identifier") {
        if (["memoizeMath", "memoize", "memoizeGeometry", "weakMemoize", "batchMemoize"].includes(callee.name)) {
          return true;
        }
      }
      if (
        callee.type === "MemberExpression" &&
        callee.object.type === "Identifier" &&
        callee.object.name === "MathMemo"
      ) {
        return true;
      }
    }
    current = current.parent;
    depth++;
  }
  return false;
}

/**
 * Get message ID for expensive computation type
 */
export function getMessageId(expr: TSESTree.Expression): string {
  if (expr.type === "CallExpression") {
    const callee = expr.callee;
    if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
      const methodName = callee.property.name;
      if (["map", "filter", "reduce", "find", "some", "every", "sort", "reverse"].includes(methodName)) {
        return "arrayOperation";
      }
      if (["toUpperCase", "toLowerCase", "trim", "replace", "split", "join"].includes(methodName)) {
        return "stringOperation";
      }
      if (["keys", "values", "entries", "assign", "freeze", "seal"].includes(methodName)) {
        return "objectOperation";
      }
    }
  }
  if (expr.type === "BinaryExpression") {
    return "mathematicalOperation";
  }
  return "expensiveComputation";
}
