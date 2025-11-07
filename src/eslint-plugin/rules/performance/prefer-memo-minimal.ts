/**
 * @file Minimal ESLint rule: prefer-memo (for debugging)
 */

import type { Rule } from "eslint";

export const preferMemoMinimal: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Minimal memo rule for debugging",
    },
    fixable: "code",
    schema: [],
    messages: {
      suggestMemo: "Consider wrapping this expression with createMemo",
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    console.log("prefer-memo rule created");

    return {
      BinaryExpression(node: any) {
        console.log("BinaryExpression visited:", node.operator);
        if (["*", "/", "%", "**"].includes(node.operator)) {
          context.report({
            node,
            messageId: "suggestMemo",
          });
        }
      },
    };
  },
};

export default preferMemoMinimal;
