/**
 * Translation File Detection Tests for i18n ESLint Plugin
 * Tests that verify the plugin correctly ignores hardcoded strings in translation files
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

describe("i18n ESLint Plugin - Translation File Detection", () => {
  describe("Translation File Path Detection", () => {
    it("should ignore hardcoded strings in /translations/ directory", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const en = {
              welcome: "Welcome to our application",
              error: "Something went wrong",
              success: "Operation completed successfully"
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
        ],
      invalid: []
    });
  });

    it("should ignore hardcoded strings in /lang/ directory", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const es = {
              bienvenido: "Bienvenido a nuestra aplicación",
              error: "Algo salió mal",
              exito: "Operación completada exitosamente"
            };
            `,
            filename: "/path/to/lang/es/common.ts",
            },
        ],
      invalid: []
    });
  });

    it("should ignore hardcoded strings in /i18n/ directory", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const fr = {
              accueil: "Bienvenue dans notre application",
              erreur: "Quelque chose s'est mal passé",
              succes: "Opération terminée avec succès"
            };
            `,
            filename: "/path/to/i18n/fr/messages.ts",
            },
        ],
      invalid: []
    });
  });

    it("should ignore hardcoded strings in /locales/ directory", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const de = {
              willkommen: "Willkommen in unserer Anwendung",
              fehler: "Etwas ist schief gelaufen",
              erfolg: "Vorgang erfolgreich abgeschlossen"
            };
            `,
            filename: "/path/to/locales/de/ui.ts",
            },
        ],
      invalid: []
    });
  });

    it("should ignore hardcoded strings in language-specific subdirectories", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const it = {
              benvenuto: "Benvenuto nella nostra applicazione",
              errore: "Qualcosa è andato storto",
              successo: "Operazione completata con successo"
            };
            `,
            filename: "/path/to/translations/data/lang/it/common.ts",
            },
        ],
      invalid: []
    });
  });

    it("should ignore hardcoded strings in files with translation extensions", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const pt = {
              bemvindo: "Bem-vindo ao nosso aplicativo",
              erro: "Algo deu errado",
              sucesso: "Operação concluída com sucesso"
            };
            `,
            filename: "/path/to/messages.translation.ts",
            },
          {
            code: `
            export const ru = {
              добропожаловать: "Добро пожаловать в наше приложение",
              ошибка: "Что-то пошло не так",
              успех: "Операция завершена успешно"
            };
            `,
            filename: "/path/to/ui.i18n.js",
            },
          {
            code: `
            export const ja = {
              ようこそ: "私たちのアプリケーションへようこそ",
              エラー: "何かが間違っています",
              成功: "操作が正常に完了しました"
            };
            `,
            filename: "/path/to/texts.locale.json",
            },
        ],
      invalid: []
    });
  });

  describe("Translation Object Detection", () => {
    it("should ignore hardcoded strings in translation variable declarations", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            const translations = {
              welcome: "Welcome to our app",
              error: "An error occurred",
              success: "Success!"
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
          {
            code: `
            const i18nMessages = {
              hello: "Hello World",
              goodbye: "Goodbye"
            };
            `,
            filename: "/path/to/lang/en.ts",
            },
          {
            code: `
            const localeData = {
              title: "Application Title",
              description: "Application Description"
            };
            `,
            filename: "/path/to/i18n/en.ts",
            },
        ],
      invalid: []
    });
  });

    it("should ignore hardcoded strings in language code variables", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            const en = {
              welcome: "Welcome",
              error: "Error",
              success: "Success"
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
          {
            code: `
            const es = {
              bienvenido: "Bienvenido",
              error: "Error",
              exito: "Éxito"
            };
            `,
            filename: "/path/to/lang/es.ts",
            },
          {
            code: `
            const fr = {
              accueil: "Accueil",
              erreur: "Erreur",
              succes: "Succès"
            };
            `,
            filename: "/path/to/i18n/fr.ts",
            },
        ],
      invalid: []
    });
  });

    it("should ignore hardcoded strings in exported translation objects", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const messages = {
              welcome: "Welcome to our application",
              error: "Something went wrong",
              success: "Operation completed successfully"
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
          {
            code: `
            export default {
              title: "Application Title",
              description: "Application Description",
              button: "Click Me"
            };
            `,
            filename: "/path/to/lang/en.ts",
            },
        ],
      invalid: []
    });
  });

  describe("Mixed Translation and Component Files", () => {
    it("should detect hardcoded strings in component files even if they import translations", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            import { en } from "./translations/en";
            
            const Component = () => {
              return (
                <div>
                  <h1>Welcome to our app</h1>
                  <p>This is a test message</p>
                </div>
              );
            };
            `,
            filename: "/path/to/components/MyComponent.tsx",
            errors: [
              {
                message:
                  "Hardcoded string found: \"Welcome to our app\". Consider using i18n.t('welcome.to.our.app') instead.",
                type: "JSXText",
                },
              {
                message:
                  "Hardcoded string found: \"This is a test message\". Consider using i18n.t('this.is.a.test.message') instead.",
                type: "JSXText",
                },
            ],
            },
        ],
      });
    });

    it("should ignore translation imports but detect hardcoded strings in the same file", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            import { en } from "./translations/en";
            import { es } from "./translations/es";
            
            const title = "Hardcoded Title";
            const message = "Hardcoded Message";
            
            const Component = () => {
              return <div>{title}</div>;
            };
            `,
            filename: "/path/to/components/MyComponent.tsx",
            errors: [
              {
                message:
                  "Hardcoded string found: \"Hardcoded Title\". Consider using i18n.t('hardcoded.title') instead.",
                type: "Literal",
                },
              {
                message:
                  "Hardcoded string found: \"Hardcoded Message\". Consider using i18n.t('hardcoded.message') instead.",
                type: "Literal",
                },
            ],
            },
        ],
      });
      });
    });

  describe("Edge Cases", () => {
    it("should handle nested translation objects", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const en = {
              common: {
                welcome: "Welcome",
                error: "Error",
                success: "Success"
                },
              auth: {
                login: "Login",
                logout: "Logout",
                register: "Register"
                },
              navigation: {
                home: "Home",
                about: "About",
                contact: "Contact"
              }
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
        ],
      invalid: []
    });
  });

    it("should handle translation objects with mixed types", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            export const en = {
              messages: {
                welcome: "Welcome to our app",
                error: "Something went wrong"
                },
              config: {
                theme: "dark",
                language: "en"
                },
              numbers: {
                maxRetries: 3,
                timeout: 5000
              }
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
        ],
      invalid: []
    });
  });

    it("should handle translation files with comments", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            // English translations for the application
            export const en = {
              // Common messages
              welcome: "Welcome to our application",
              error: "An error occurred",
              
              // Authentication messages
              login: "Please log in",
              logout: "You have been logged out"
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
        ],
      invalid: []
    });
  });

    it("should handle translation files with TypeScript types", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: `
            interface TranslationKeys {
              welcome: string;
              error: string;
              success: string;
            }
            
            export const en: TranslationKeys = {
              welcome: "Welcome to our application",
              error: "An error occurred",
              success: "Operation completed successfully"
            };
            `,
            filename: "/path/to/translations/en.ts",
            },
        ],
      invalid: []
    });
      });
    });

  describe("False Positives Prevention", () => {
    it("should not ignore hardcoded strings in non-translation files", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const config = {
              title: "Application Title",
              description: "Application Description"
            };
            `,
            filename: "/path/to/config/app.ts",
            errors: [
              {
                message:
                  "Hardcoded string found: \"Application Title\". Consider using i18n.t('application.title') instead.",
                type: "Literal",
                },
              {
                message:
                  "Hardcoded string found: \"Application Description\". Consider using i18n.t('application.description') instead.",
                type: "Literal",
                },
            ],
            },
        ],
      });
    });

    it("should not ignore hardcoded strings in component files with translation-like names", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const TranslationComponent = () => {
              return (
                <div>
                  <h1>Welcome to our app</h1>
                  <p>This is a test message</p>
                </div>
              );
            };
            `,
            filename: "/path/to/components/TranslationComponent.tsx",
            errors: [
              {
                message:
                  "Hardcoded string found: \"Welcome to our app\". Consider using i18n.t('welcome.to.our.app') instead.",
                type: "JSXText",
                },
              {
                message:
                  "Hardcoded string found: \"This is a test message\". Consider using i18n.t('this.is.a.test.message') instead.",
                type: "JSXText",
                },
            ],
            },
        ],
      });
    });
  });
});
