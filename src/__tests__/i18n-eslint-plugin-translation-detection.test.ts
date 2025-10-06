/**
 * Translation Key Detection Tests for i18n ESLint Plugin
 * Tests that verify the plugin correctly detects and validates translation key usage
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

describe("i18n ESLint Plugin - Translation Key Detection", () => {
  describe("Basic Translation Key Detection", () => {
    it("should detect i18n.t() calls with hardcoded keys", () => {
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
          {
            code: 'const error = i18n.t("errors.validation.required");',
            errors: [
              {
                message: 'Translation key "errors.validation.required" should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should detect translation keys in JSX", () => {
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
          {
            code: `
            const Button = () => {
              const { t } = useI18n();
              return <button>{t("buttons.submit")}</button>;
            };
            `,
            errors: [
              {
                message: 'Translation key "buttons.submit" should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Multiple Translation Key Detection", () => {
    it("should detect multiple translation keys in one file", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const { t } = useI18n();
            const messages = {
              welcome: t("common.welcome"),
              goodbye: t("common.goodbye"),
              error: t("errors.generic"),
              success: t("messages.success")
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
              {
                message: 'Translation key "messages.success" should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should detect translation keys in complex JSX", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const Form = () => {
              const { t } = useI18n();
              return (
                <form>
                  <h1>{t("forms.title")}</h1>
                  <label>{t("forms.email.label")}</label>
                  <input placeholder={t("forms.email.placeholder")} />
                  <button>{t("forms.submit")}</button>
                </form>
              );
            };
            `,
            errors: [
              {
                message: 'Translation key "forms.title" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "forms.email.label" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "forms.email.placeholder" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "forms.submit" should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Nested Translation Key Detection", () => {
    it("should detect deeply nested translation keys", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const { t } = useI18n();
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
  });

  describe("Conditional Translation Key Detection", () => {
    it("should detect translation keys in conditional logic", () => {
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

    it("should detect translation keys in switch statements", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const getErrorMessage = (errorType) => {
              const { t } = useI18n();
              
              switch (errorType) {
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

  describe("Loop and Iteration Translation Key Detection", () => {
    it("should detect translation keys in loops", () => {
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

    it("should detect translation keys in array operations", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const getValidationMessages = (errors) => {
              const { t } = useI18n();
              
              return errors.map(error => ({
                field: error.field,
                message: t(\`validation.\${error.type}\`)
              }));
            };
            `,
            errors: [
              {
                message: 'Translation key "validation." should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Function Parameter Translation Key Detection", () => {
    it("should detect translation keys passed as function parameters", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const showNotification = (message) => {
              const { t } = useI18n();
              return t(message);
            };
            
            showNotification("notifications.success");
            `,
            errors: [
              {
                message: 'Translation key "notifications.success" should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Component Props Translation Key Detection", () => {
    it("should detect translation keys in component props", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const Button = ({ labelKey }) => {
              const { t } = useI18n();
              return <button>{t(labelKey)}</button>;
            };
            
            <Button labelKey="buttons.save" />
            `,
            errors: [
              {
                message: 'Translation key "buttons.save" should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Real-World Component Examples", () => {
    it("should detect translation keys in complex component", () => {
      ruleTester.run("no-untranslated-keys", i18nRules["no-untranslated-keys"], {
        valid: [],
        invalid: [
          {
            code: `
            const UserDashboard = () => {
              const { t } = useI18n();
              const [user, setUser] = useState(null);
              
              return (
                <div className="dashboard">
                  <header>
                    <h1>{t("dashboard.title")}</h1>
                    <p>{t("dashboard.welcome", { name: user?.name })}</p>
                  </header>
                  
                  <nav>
                    <ul>
                      <li><a href="/profile">{t("nav.profile")}</a></li>
                      <li><a href="/settings">{t("nav.settings")}</a></li>
                      <li><a href="/help">{t("nav.help")}</a></li>
                    </ul>
                  </nav>
                  
                  <main>
                    <section>
                      <h2>{t("dashboard.stats.title")}</h2>
                      <p>{t("dashboard.stats.description")}</p>
                    </section>
                  </main>
                  
                  <footer>
                    <button onClick={() => setUser(null)}>
                      {t("auth.signout")}
                    </button>
                  </footer>
                </div>
              );
            };
            `,
            errors: [
              {
                message: 'Translation key "dashboard.title" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "dashboard.welcome" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "nav.profile" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "nav.settings" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "nav.help" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "dashboard.stats.title" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "dashboard.stats.description" should be validated against translation files.',
                type: "Literal",
              },
              {
                message: 'Translation key "auth.signout" should be validated against translation files.',
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Configuration Options", () => {
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
});
