/**
 * Real-World Code Examples Tests for i18n ESLint Plugin
 * Tests with actual code patterns found in the Reynard codebase
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

describe("i18n ESLint Plugin - Real-World Examples", () => {
  describe("ECS System Examples", () => {
    it("should handle ECS game class imports and constructors", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          `
          import { ComponentType, createWorld, ResourceType } from "../index";
          import { Bullet, Camera, Color, Damage, Enemy } from "./components";
          
          export class ECSGame {
            private world: any;
            private positionType!: ComponentType<Position>;
            private velocityType!: ComponentType<Velocity>;
            
            constructor() {
              this.world = createWorld();
              this.setupComponentTypes();
            }
          }
          `,
        ],
        invalid: [],
      });
    });

    it("should handle ECS system definitions", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          `
          import { system } from "../index";
          
          export const movementSystem = system("movement", (world) => {
            const positions = world.getComponent("position");
            const velocities = world.getComponent("velocity");
            return { positions, velocities };
          });
          `,
        ],
        invalid: [],
      });
    });

    describe("Component Library Examples", () => {
      it("should handle SolidJS component definitions", () => {
        ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
          valid: [
            `
          import { Component } from "solid-js";
          import { useI18n } from "reynard-themes";
          
          const TranslationDemo: Component = () => {
            const { t } = useI18n();
            return <div>{t("common.save")}</div>;
          };
          `,
          ],
          invalid: [],
        });
      });

      it("should flag hardcoded JSX content", () => {
        ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
          valid: [],
          invalid: [
            {
              code: `
            const TestApp: Component = () => {
              return (
                <div style="padding: 20px; color: white; background: #333;">
                  <h1>🦊 Test App</h1>
                  <p>If you can see this, the basic app is working!</p>
                </div>
              );
            };
            `,
              errors: [
                {
                  message: "Hardcoded string found: \"🦊 Test App\". Consider using i18n.t('.test.app') instead.",
                  type: "JSXText",
                },
                {
                  message:
                    "Hardcoded string found: \"If you can see this, the basic app is working!\". Consider using i18n.t('if.you.can.see.this.the.basic.app.is.working') instead.",
                  type: "JSXText",
                },
              ],
              output: `
            const TestApp: Component = () => {
              return (
                <div style="padding: 20px; color: white; background: #333;">
                  <h1>{i18n.t('.test.app')}</h1>
                  <p>{i18n.t('if.you.can.see.this.the.basic.app.is.working')}</p>
                </div>
              );
            };
            `,
            },
          ],
        });
      });

      describe("Configuration and Setup Examples", () => {
        it("should handle TypeScript configuration", () => {
          ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
            valid: [
              `
          const config = {
            compilerOptions: {
              target: "ES2020",
              useDefineForClassFields: true,
              lib: ["ES2020", "DOM", "DOM.Iterable"],
              module: "ESNext",
              skipLibCheck: true
            }
          };
          `,
            ],
            invalid: [],
          });
        });

        it("should handle package.json scripts", () => {
          ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
            valid: [
              `
          const packageJson = {
            scripts: {
              dev: "pnpm --filter templates/starter dev",
              build: "pnpm -r build",
              test: "vitest run",
              lint: "eslint ."
            }
          };
          `,
            ],
            invalid: [],
          });
        });

        describe("Error Handling Examples", () => {
          it("should handle error constants and messages", () => {
            ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
              valid: [
                `
          export const ERROR_CONSTANTS = {
            CODES: {
              VALIDATION_ERROR: "VALIDATION_ERROR",
              AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
              NETWORK_ERROR: "NETWORK_ERROR"
              },
            MESSAGES: {
              GENERIC: "An unexpected error occurred",
              NETWORK: "Network connection failed",
              TIMEOUT: "Request timed out"
            }
          };
          `,
              ],
              invalid: [],
            });
          });

          it("should handle security error messages", () => {
            ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
              valid: [
                `
          const errorCodes = {
            "AUTH_INVALID_CREDENTIALS": "Invalid username or password",
            "AUTH_TOKEN_EXPIRED": "Authentication token has expired",
            "SECURITY_SQL_INJECTION": "SQL injection attempt detected"
          };
          `,
              ],
              invalid: [],
            });
          });

          describe("Translation System Examples", () => {
            it("should handle translation file structures", () => {
              ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
                valid: [
                  `
          export const en = {
            nav: {
              home: "Home",
              components: "Components",
              showcase: "Showcase"
              },
            components: {
              title: "Component Showcase",
              buttons: {
                primary: "Primary",
                secondary: "Secondary"
              }
            }
          };
          `,
                ],
                invalid: [],
              });
            });

            it("should handle fallback translations", () => {
              ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
                valid: [
                  `
          export const FALLBACK_TRANSLATIONS = {
            "core.errors.moduleIsNull": "Module is null",
            "core.errors.invalidModuleStructure": "Invalid module structure",
            "common.loading": "Loading...",
            "common.error": "Error"
          };
          `,
                ],
                invalid: [],
              });
            });

            describe("Tool and Service Examples", () => {
              it("should handle tool definitions", () => {
                ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
                  valid: [
                    `
          class GreetTool extends BaseTool {
            constructor() {
              const definition = {
                name: "greet",
                description: "greetperson",
                parameters: [
                  {
                    name: "name",
                    type: ParameterType.STRING,
                    description: "personname"
                  }
                ]
              };
              super(definition);
            }
          }
          `,
                  ],
                  invalid: [],
                });
              });

              it("should handle service class definitions", () => {
                ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
                  valid: [
                    `
          export class ComfyService {
            private baseUrl: string;
            private apiKey: string;
            
            constructor(baseUrl: string, apiKey: string) {
              this.baseUrl = baseUrl;
              this.apiKey = apiKey;
            }
            
            async generateImage(prompt: string) {
              const response = await fetch(\`\${this.baseUrl}/generate\`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": \`Bearer \${this.apiKey}\`
                },
                body: JSON.stringify({ prompt })
              });
              return response.json();
            }
          }
          `,
                  ],
                  invalid: [],
                });
              });

              describe("Complex Real-World Scenarios", () => {
                it("should handle mixed technical and user-facing code", () => {
                  ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
                    valid: [
                      `
          import { Component } from "solid-js";
          import { useI18n } from "reynard-themes";
          
          const MyComponent: Component = () => {
            const { t } = useI18n();
            const config = { theme: "dark", language: "en" };
            
            return (
              <div>
                <h1>{t("welcome.title")}</h1>
                <p>{t("welcome.message")}</p>
              </div>
            );
          };
          `,
                    ],
                    invalid: [
                      {
                        code: `
            import { Component } from "solid-js";
            
            const MyComponent: Component = () => {
              const config = { theme: "dark", language: "en" };
              const title = "Welcome to our app";
              
              return (
                <div>
                  <h1>Welcome to our app</h1>
                  <p>This is a test message</p>
                </div>
              );
            };
            `,
                        errors: [
                          {
                            message:
                              "Hardcoded string found: \"Welcome to our app\". Consider using i18n.t('welcome.to.our.app') instead.",
                            type: "Literal",
                          },
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
                        output: `
            import { Component } from "solid-js";
            
            const MyComponent: Component = () => {
              const config = { theme: "dark", language: "en" };
              const title = "Welcome to our app";
              
              return (
                <div>
                  <h1>{i18n.t('welcome.to.our.app')}</h1>
                  <p>{i18n.t('this.is.a.test.message')}</p>
                </div>
              );
            };
            `,
                      },
                    ],
                  });
                });

                it("should handle complex ECS system with mixed content", () => {
                  ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
                    valid: [
                      `
          import { ComponentType, createWorld } from "../index";
          import { Position, Velocity, Health } from "./components";
          
          export class GameSystem {
            private world: any;
            private positionType!: ComponentType<Position>;
            
            constructor() {
              this.world = createWorld();
              this.setupComponents();
            }
            
            private setupComponents() {
              const registry = this.world.getComponentRegistry();
              this.positionType = registry.register("position", Position);
            }
          }
          `,
                    ],
                    invalid: [],
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
