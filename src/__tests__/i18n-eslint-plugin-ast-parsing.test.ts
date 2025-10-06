/**
 * AST Parsing Tests for i18n ESLint Plugin
 * Tests the intelligent AST parsing logic for identifying user-facing vs technical strings
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

describe("i18n ESLint Plugin - AST Parsing", () => {
  describe("Technical Context Detection", () => {
    it("should ignore import statements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'import { Command } from "commander";',
          'import { Component } from "solid-js";',
          'import { createSignal } from "solid-js";',
          'import { useI18n } from "reynard-themes";',
          'import { ToolRegistry, ToolExecutor } from "reynard-tools";',
        ],
        invalid: [],
      });
    });

    it("should ignore constructor calls", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const cmd = new Command("eslint");',
          "const component = new Component();",
          "const registry = new ToolRegistry();",
          "const executor = new ToolExecutor();",
          "const game = new ECSGame();",
        ],
        invalid: [],
      });
    });

    it("should ignore module exports", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'export { Component } from "./component";',
          "export default class MyClass {}",
          'export const config = "development";',
          "module.exports = { Component };",
          'export * from "./utils";',
        ],
        invalid: [],
      });
    });

    it("should ignore require statements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const fs = require("fs");',
          'const path = require("path");',
          'const commander = require("commander");',
        ],
        invalid: [],
      });
    });

    it("should ignore console statements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'console.log("debug info");',
          'console.error("error occurred");',
          'console.warn("warning message");',
          'console.info("information");',
        ],
        invalid: [],
      });
    });

    it("should ignore process statements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: ["process.env.NODE_ENV;", "process.exit(1);", "process.cwd();", "process.argv;"],
        invalid: [],
      });
    });

    it("should ignore object property keys", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const obj = { "key": "value" };',
          'const config = { "name": "app" };',
          'const settings = { "theme": "dark" };',
        ],
        invalid: [],
      });
    });

    it("should ignore array elements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const items = ["item1", "item2", "item3"];',
          'const themes = ["light", "dark", "auto"];',
          'const languages = ["en", "es", "fr"];',
        ],
        invalid: [],
      });
    });

    it("should ignore switch cases", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          `
          switch (type) {
            case "primary":
              return "blue";
            case "secondary":
              return "gray";
            default:
              return "default";
          }
          `,
        ],
        invalid: [],
      });
    });

    it("should ignore throw statements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'throw new Error("Something went wrong");',
          'throw new TypeError("Invalid type");',
          'throw new ValidationError("Invalid input");',
        ],
        invalid: [],
      });
    });
  });

  describe("User-Facing String Detection", () => {
    it("should flag JSX text content", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: "const Component = () => <div>Hello World</div>;",
            errors: [
              {
                message: "Hardcoded string found: \"Hello World\". Consider using i18n.t('hello.world') instead.",
                type: "JSXText",
              },
            ],
          },
          {
            code: "const App = () => <h1>Welcome to our app</h1>;",
            errors: [
              {
                message:
                  "Hardcoded string found: \"Welcome to our app\". Consider using i18n.t('welcome.to.our.app') instead.",
                type: "JSXText",
              },
            ],
          },
        ],
      });
    });

    it("should flag user-facing variable declarations", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: 'const title = "Welcome to our app";',
            errors: [
              {
                message:
                  "Hardcoded string found: \"Welcome to our app\". Consider using i18n.t('welcome.to.our.app') instead.",
                type: "Literal",
              },
            ],
          },
          {
            code: 'const message = "Hello World";',
            errors: [
              {
                message: "Hardcoded string found: \"Hello World\". Consider using i18n.t('hello.world') instead.",
                type: "Literal",
              },
            ],
          },
          {
            code: 'const label = "Enter your name";',
            errors: [
              {
                message:
                  "Hardcoded string found: \"Enter your name\". Consider using i18n.t('enter.your.name') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should flag user-facing object properties", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: 'const config = { title: "App Title", description: "App Description" };',
            errors: [
              {
                message: "Hardcoded string found: \"App Title\". Consider using i18n.t('app.title') instead.",
                type: "Literal",
              },
              {
                message:
                  "Hardcoded string found: \"App Description\". Consider using i18n.t('app.description') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should flag return statements with user-facing strings", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: 'return "Error occurred";',
            errors: [
              {
                message: "Hardcoded string found: \"Error occurred\". Consider using i18n.t('error.occurred') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Technical Term Detection", () => {
    it("should ignore common technical terms", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const id = "user-123";',
          'const type = "button";',
          'const name = "component";',
          'const value = "data";',
          'const key = "config";',
          'const index = "0";',
          'const count = "items";',
          'const size = "large";',
          'const width = "100px";',
          'const height = "200px";',
          'const color = "blue";',
          'const url = "https://example.com";',
          'const path = "/api/users";',
          'const file = "config.json";',
          'const dir = "src";',
          'const src = "image.jpg";',
          'const alt = "description";',
          'const title = "tooltip";',
          'const role = "button";',
          'const aria = "label";',
          'const data = "value";',
          'const test = "spec";',
          'const mock = "data";',
          'const stub = "response";',
          'const fixture = "example";',
        ],
        invalid: [],
      });
    });

    it("should ignore tool and framework names", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const tool = "commander";',
          'const linter = "eslint";',
          'const language = "typescript";',
          'const runtime = "node";',
          'const manager = "npm";',
          'const bundler = "webpack";',
          'const framework = "vite";',
          'const compiler = "babel";',
          'const testRunner = "jest";',
          'const testFramework = "vitest";',
        ],
        invalid: [],
      });
    });

    it("should ignore naming conventions", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const camelCase = "value";',
          'const CONSTANT = "value";',
          'const kebab-case = "value";',
          'const dot.notation = "value";',
          'const colon:notation = "value";',
          'const slash/notation = "value";',
          'const nested.dot.notation = "value";',
        ],
        invalid: [],
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle mixed contexts correctly", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: ['import { Component } from "solid-js"; const cmd = new Command("eslint");'],
        invalid: [
          {
            code: 'import { Component } from "solid-js"; const title = "Welcome"; const cmd = new Command("eslint");',
            errors: [
              {
                message: "Hardcoded string found: \"Welcome\". Consider using i18n.t('welcome') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should respect minimum length setting", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          'const short = "ab";', // Below minimum length
        ],
        invalid: [
          {
            code: 'const long = "Hello World";', // Above minimum length
            errors: [
              {
                message: "Hardcoded string found: \"Hello World\". Consider using i18n.t('hello.world') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should handle custom ignore patterns", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: 'const custom = "special-pattern";',
            options: [{ ignorePatterns: ["^special-"] }],
          },
        ],
        invalid: [
          {
            code: 'const normal = "Hello World";',
            options: [{ ignorePatterns: ["^special-"] }],
            errors: [
              {
                message: "Hardcoded string found: \"Hello World\". Consider using i18n.t('hello.world') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });
});
