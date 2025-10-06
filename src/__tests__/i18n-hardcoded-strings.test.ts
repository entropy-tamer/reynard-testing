/**
 * Tests for hardcoded string detection
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

describe("Hardcoded String Detection", () => {
  it("should flag hardcoded strings in JSX", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [],
      invalid: [
        {
          code: `
          function Component() {
            return <h1>Welcome to our app</h1>;
          }
          `,
          errors: [
            {
              message: 'Hardcoded string found: "Welcome to our app". Consider using i18n.t(\'welcome.to.our.app\') instead.',
              type: "Literal",
              },
          ],
          },
        {
          code: `
          function Component() {
            return (
              <div>
                <h1>Hello World</h1>
                <p>This is a test message</p>
              </div>
            );
          }
          `,
          errors: [
            {
              message: 'Hardcoded string found: "Hello World". Consider using i18n.t(\'hello.world\') instead.',
              type: "Literal",
              },
            {
              message: 'Hardcoded string found: "This is a test message". Consider using i18n.t(\'this.is.a.test.message\') instead.',
              type: "Literal",
              },
          ],
          },
      ],
      invalid: []
    });
  });

  it("should flag hardcoded strings in variable assignments", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [],
      invalid: [
        {
          code: `
          const title = "App Title";
          const description = "App Description";
          `,
          errors: [
            {
              message: 'Hardcoded string found: "App Title". Consider using i18n.t(\'app.title\') instead.',
              type: "Literal",
              },
            {
              message: 'Hardcoded string found: "App Description". Consider using i18n.t(\'app.description\') instead.',
              type: "Literal",
              },
          ],
          },
      ],
      invalid: []
    });
  });

  it("should flag hardcoded strings in function calls", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [],
      invalid: [
        {
          code: `
          function showMessage() {
            alert("Error occurred");
            console.log("Debug message");
          }
          `,
          errors: [
            {
              message: 'Hardcoded string found: "Error occurred". Consider using i18n.t(\'error.occurred\') instead.',
              type: "Literal",
              },
            {
              message: 'Hardcoded string found: "Debug message". Consider using i18n.t(\'debug.message\') instead.',
              type: "Literal",
              },
          ],
          },
      ],
      invalid: []
    });
  });

  it("should flag hardcoded strings in object properties", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [],
      invalid: [
        {
          code: `
          const menuItems = [
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ];
          `,
          errors: [
            {
              message: 'Hardcoded string found: "Home". Consider using i18n.t(\'home\') instead.',
              type: "Literal",
              },
            {
              message: 'Hardcoded string found: "About". Consider using i18n.t(\'about\') instead.',
              type: "Literal",
              },
            {
              message: 'Hardcoded string found: "Contact". Consider using i18n.t(\'contact\') instead.',
              type: "Literal",
              },
          ],
          },
      ],
      invalid: []
    });
  });
  },
});

