/**
 * Tests for already internationalized code
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

describe("Already Internationalized Code", () => {
  it("should not flag strings that are already using i18n.t()", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const { t } = useI18n();
          const message = t("common.welcome");
          const title = t("nav.home");
          `,
        },
        {
          code: `
          import { t } from "@entropy-tamer/reynard-i18n";
          const greeting = t("greetings.hello");
          `,
        },
        {
          code: `
          const { t } = useI18n();
          return <h1>{t("page.title")}</h1>;
          `,
        },
        {
          code: `
          const { t } = useI18n();
          const buttonText = t("buttons.submit");
          return <button>{buttonText}</button>;
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should not flag strings in translation files", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          export const translations = {
            en: {
              "common.welcome": "Welcome to our app",
              "nav.home": "Home",
              "buttons.submit": "Submit",
              },
          };
          `,
          filename: "translations/en.json",
        },
        {
          code: `
          const messages = {
            "greetings.hello": "Hello",
            "greetings.goodbye": "Goodbye",
          };
          `,
          filename: "locales/en.ts",
        },
      ],
      invalid: [],
    });
  });

  it("should not flag strings in test files", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          describe("Component", () => {
            it("should render correctly", () => {
              const text = "Test message";
              expect(text).toBe("Test message");
            },
});
          },
});
          `,
          filename: "component.test.tsx",
        },
        {
          code: `
          test("should handle user input", () => {
            const input = "User entered this text";
            expect(input).toContain("User entered");
          },
});
          `,
          filename: "input.test.ts",
        },
      ],
      invalid: [],
    });
  });

  it("should not flag strings in configuration files", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          export default {
            name: "My App",
            description: "A great application",
            version: "1.0.0",
          };
          `,
          filename: "package.json",
        },
        {
          code: `
          const config = {
            title: "Development Server",
            port: 3000,
            host: "localhost",
          };
          `,
          filename: "vite.config.ts",
        },
      ],
      invalid: [],
    });
  });
});
