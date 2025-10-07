/**
 * Edge Cases Test Suite for i18n ESLint Plugin
 * Tests edge cases and boundary conditions
 */

import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { i18nRules } from "../utils/i18n-eslint-plugin.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

describe("i18n ESLint Plugin - Edge Cases", () => {
  it("should handle empty files", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: "",
        },
      ],
      invalid: []
    });
  });

  it("should handle files with only comments", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          // This is a comment
          /* This is a block comment */
          `,
        },
      ],
      invalid: []
    });
  });

  it("should handle files with only whitespace", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: "   \n\t  \n  ",
        },
      ],
      invalid: []
    });
  });
});
