/**
 * Tests for complex scenarios in i18n ESLint plugin
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

describe("Complex Scenarios", () => {
  it("should handle template literals with variables", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          function createMessage(name: string) {
            return \`Hello \${name}, welcome to our app!\`;
          }
          `,
        },
        {
          code: `
          const apiUrl = \`https://api.example.com/v\${version}/users/\${userId}\`;
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle conditional expressions", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const message = isLoggedIn ? "Welcome back!" : "Please log in";
          `,
        },
        {
          code: `
          const status = error ? "Error occurred" : "Success";
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle switch statements", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          function getStatusMessage(status: string) {
            switch (status) {
              case "loading":
                return "Loading...";
              case "success":
                return "Operation completed";
              case "error":
                return "Something went wrong";
              default:
                return "Unknown status";
            }
          }
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle try-catch blocks", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          try {
            await riskyOperation();
          } catch (error) {
            console.error("Operation failed:", error.message);
            throw new Error("Failed to complete operation");
          }
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle async/await patterns", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          async function fetchUserData() {
            try {
              const response = await fetch("/api/users");
              if (!response.ok) {
                throw new Error("Failed to fetch user data");
              }
              return await response.json();
            } catch (error) {
              console.error("Error fetching user data:", error);
              return null;
            }
          }
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle class methods", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          class UserService {
            async createUser(userData: any) {
              try {
                const response = await fetch("/api/users", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                    },
                  body: JSON.stringify(userData)
                });
                
                if (!response.ok) {
                  throw new Error("Failed to create user");
                }
                
                return await response.json();
              } catch (error) {
                console.error("Error creating user:", error);
                throw error;
              }
            }
          }
          `,
        },
      ],
      invalid: [],
    });
  });
});
