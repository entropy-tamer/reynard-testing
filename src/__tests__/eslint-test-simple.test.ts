/**
 * Simple ESLint test without rule import
 */

import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";

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

describe("ESLint Test Setup", () => {
  it("should be able to create RuleTester", () => {
    expect(ruleTester).toBeDefined();
  });

  it("should be able to run a simple rule test", () => {
    // Test with a simple rule that always passes
    const simpleRule = {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Simple test rule',
        },
      },
      create: () => ({}),
    };

    ruleTester.run("simple-rule", simpleRule, {
      valid: [
        `const x = 1;`,
        `function test() { return true; }`,
      ],
      invalid: [],
    });
  });
});

