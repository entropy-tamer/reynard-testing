/**
 * Tests for nested context detection in i18n ESLint plugin
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

describe("Nested Context Detection", () => {
  it("should handle deeply nested object structures", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const config = {
            api: {
              endpoints: {
                users: "/api/users",
                posts: "/api/posts"
                },
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer token"
              }
              },
            ui: {
              themes: ["light", "dark", "auto"],
              components: {
                button: {
                  variants: ["primary", "secondary", "tertiary"]
                }
              }
            }
          };
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle nested JSX components", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          function NestedComponent() {
            return (
              <div className="container">
                <header className="header">
                  <nav className="nav">
                    <ul className="nav-list">
                      <li className="nav-item">
                        <a href="/" className="nav-link">Home</a>
                      </li>
                    </ul>
                  </nav>
                </header>
              </div>
            );
          }
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle nested function calls", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          function processData() {
            const result = transformData(
              filterData(
                fetchData("/api/data"),
                { status: "active" }
              ),
              { format: "json" }
            );
            return result;
          }
          `,
        },
      ],
      invalid: [],
    });
  });

  it("should handle nested array structures", () => {
    ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
      valid: [
        {
          code: `
          const menuItems = [
            {
              label: "Home",
              path: "/",
              children: [
                { label: "Dashboard", path: "/dashboard" },
                { label: "Profile", path: "/profile" }
              ]
              },
            {
              label: "Settings",
              path: "/settings",
              children: [
                { label: "Account", path: "/settings/account" },
                { label: "Privacy", path: "/settings/privacy" }
              ]
            }
          ];
          `,
        },
      ],
      invalid: [],
    });
  });
});
