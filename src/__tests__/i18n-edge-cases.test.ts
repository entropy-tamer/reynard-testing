/**
 * Tests for edge cases in i18n detection
 */
/* eslint-disable @reynard/i18n/no-hardcoded-strings */

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

describe("Edge Cases", () => {
  it("should handle empty strings", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const emptyString = "";
          const whitespace = "   ";
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle single character strings", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const singleChar = "a";
          const punctuation = "!";
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle technical strings", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const className = "btn-primary";
          const id = "user-123";
          const url = "https://example.com";
          const email = "user@example.com";
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle regex patterns", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          const phoneRegex = /^\\+?[\\d\\s\\-\\(\\)]{10,}$/;
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle CSS class names", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const styles = {
            container: "flex items-center justify-center",
            button: "px-4 py-2 bg-blue-500 text-white",
          };
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle API endpoints", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const apiEndpoints = {
            users: "/api/users",
            posts: "/api/posts",
            comments: "/api/comments",
          };
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle file extensions", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const allowedTypes = [".jpg", ".png", ".gif", ".pdf"];
          const fileExtension = "test.txt";
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle version numbers", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const version = "1.0.0";
          const apiVersion = "v2";
          `,
        },
      ],
      invalid: [],
    });
  });
});
