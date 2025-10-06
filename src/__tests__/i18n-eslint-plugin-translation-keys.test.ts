/**
 * Translation Key Validation Tests for i18n ESLint Plugin
 * Tests the no-untranslated-keys rule and translation key validation
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

describe("i18n ESLint Plugin - Translation Key Validation", () => {
  describe("Translation Key Detection", () => {
    it("should detect i18n.t() calls", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: 'const message = i18n.t("common.welcome");',
            errors: [
              {
                message: 'Translation key "common.welcome" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
          {
            code: 'const title = t("nav.home");',
            errors: [
              {
                message: 'Translation key "nav.home" should be validated against translation files.',
                type: "Literal",
                },
            ],
          },
        ],
      });
    });

    it("should detect i18n.t() calls in JSX", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const Component = () => {
              const { t } = useI18n();
              return <h1>{t("welcome.title")}</h1>;
            };
            `,
            errors: [
              {
                message: 'Translation key "welcome.title" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should detect nested translation key calls", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const { t } = useI18n();
            const messages = {
              welcome: t("common.welcome"),
              goodbye: t("common.goodbye"),
              error: t("errors.generic")
            };
            `,
            errors: [
              {
                message: 'Translation key "common.welcome" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "common.goodbye" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "errors.generic" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
      });
    });

  describe("Translation Key Patterns", () => {
    it("should handle various translation key formats", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const keys = [
              t("common.save"),
              t("common.cancel"),
              t("nav.home"),
              t("nav.about"),
              t("errors.validation.required"),
              t("errors.validation.email.invalid"),
              t("forms.user.name.label"),
              t("forms.user.email.placeholder")
            ];
            `,
            errors: [
              {
                message: 'Translation key "common.save" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "common.cancel" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "nav.home" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "nav.about" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "errors.validation.required" should be validated against translation files.',
                type: "Literal",
                },
              {
                message:
                  'Translation key "errors.validation.email.invalid" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "forms.user.name.label" should be validated against translation files.',
                type: "Literal",
                },
              {
                message:
                  'Translation key "forms.user.email.placeholder" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should handle dynamic translation keys", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [
          `
          const dynamicKey = \`common.\${type}\`;
          const message = t(dynamicKey);
          `,
          `
          const key = "common." + action;
          const message = t(key);
          `,
        ],
      invalid: []
    });
      });
    });

  describe("Real-World Translation Usage", () => {
    it("should handle component translation patterns", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const Button = ({ variant, children }) => {
              const { t } = useI18n();
              return (
                <button class={\`btn btn-\${variant}\`}>
                  {t("buttons." + variant)}
                </button>
              );
            };
            `,
            errors: [
              {
                message: 'Translation key "buttons." should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should handle form validation messages", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const validateField = (field, value) => {
              const { t } = useI18n();
              const errors = [];
              
              if (!value) {
                errors.push(t("validation.required"));
              }
              
              if (field === "email" && !isValidEmail(value)) {
                errors.push(t("validation.email.invalid"));
              }
              
              return errors;
            };
            `,
            errors: [
              {
                message: 'Translation key "validation.required" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "validation.email.invalid" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should handle error message patterns", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const handleError = (error) => {
              const { t } = useI18n();
              
              switch (error.type) {
                case "network":
                  return t("errors.network.connection");
                case "validation":
                  return t("errors.validation.generic");
                case "auth":
                  return t("errors.auth.unauthorized");
                default:
                  return t("errors.generic");
              }
            };
            `,
            errors: [
              {
                message: 'Translation key "errors.network.connection" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "errors.validation.generic" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "errors.auth.unauthorized" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "errors.generic" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
      });
    });

  describe("Translation Key Configuration", () => {
    it("should respect custom translation file patterns", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: 'const message = t("common.welcome");',
            options: [
              {
                translationFiles: ["src/lang/**/*.ts", "packages/*/src/lang/**/*.ts"],
                },
            ],
            errors: [
              {
                message: 'Translation key "common.welcome" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should handle multiple translation file patterns", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: 'const message = t("common.welcome");',
            options: [
              {
                translationFiles: [
                  "src/translations/**/*.ts",
                  "packages/*/src/translations/**/*.ts",
                  "locales/**/*.json",
                ],
                },
            ],
            errors: [
              {
                message: 'Translation key "common.welcome" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
      });
    });

  describe("Edge Cases for Translation Keys", () => {
    it("should handle complex translation key structures", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const complexKeys = {
              user: {
                profile: t("user.profile.title"),
                settings: t("user.settings.notifications"),
                preferences: t("user.preferences.theme")
                },
              admin: {
                dashboard: t("admin.dashboard.overview"),
                users: t("admin.users.list"),
                reports: t("admin.reports.monthly")
              }
            };
            `,
            errors: [
              {
                message: 'Translation key "user.profile.title" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "user.settings.notifications" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "user.preferences.theme" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "admin.dashboard.overview" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "admin.users.list" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "admin.reports.monthly" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should handle translation keys in conditional logic", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const getStatusMessage = (status) => {
              const { t } = useI18n();
              
              if (status === "loading") {
                return t("status.loading");
              } else if (status === "success") {
                return t("status.success");
              } else if (status === "error") {
                return t("status.error");
              } else {
                return t("status.unknown");
              }
            };
            `,
            errors: [
              {
                message: 'Translation key "status.loading" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "status.success" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "status.error" should be validated against translation files.',
                type: "Literal",
                },
              {
                message: 'Translation key "status.unknown" should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should handle translation keys in loops and iterations", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const renderMenuItems = (items) => {
              const { t } = useI18n();
              
              return items.map(item => (
                <li key={item.id}>
                  <a href={item.href}>
                    {t(\`menu.\${item.key}\`)}
                  </a>
                </li>
              ));
            };
            `,
            errors: [
              {
                message: 'Translation key "menu." should be validated against translation files.',
                type: "Literal",
                },
            ],
            },
        ],
      });
      });
    });
  });
});
