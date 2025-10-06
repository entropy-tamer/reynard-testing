/**
 * Positive Detection Tests for i18n ESLint Plugin
 * Tests that verify the plugin correctly detects and reports hardcoded strings
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

describe("i18n ESLint Plugin - Positive Detection", () => {
  describe("JSX Text Content Detection", () => {
    it("should detect hardcoded text in JSX elements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: "<h1>Welcome to our application</h1>",
            errors: [
              {
                message:
                  "Hardcoded string found: \"Welcome to our application\". Consider using i18n.t('welcome.to.our.application') instead.",
                type: "JSXText",
              },
            ],
          },
          {
            code: "<p>Please enter your email address</p>",
            errors: [
              {
                message:
                  "Hardcoded string found: \"Please enter your email address\". Consider using i18n.t('please.enter.your.email.address') instead.",
                type: "JSXText",
              },
            ],
          },
          {
            code: "<button>Save Changes</button>",
            errors: [
              {
                message: "Hardcoded string found: \"Save Changes\". Consider using i18n.t('save.changes') instead.",
                type: "JSXText",
              },
            ],
          },
        ],
      });
    });

    it("should detect multiple hardcoded strings in JSX", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            <div>
              <h1>Welcome to our app</h1>
              <p>This is a test message</p>
              <button>Click here</button>
            </div>
            `,
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
              {
                message: "Hardcoded string found: \"Click here\". Consider using i18n.t('click.here') instead.",
                type: "JSXText",
              },
            ],
          },
        ],
      });
    });

    it("should detect hardcoded strings in JSX attributes", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: '<input placeholder="Enter your name" />',
            errors: [
              {
                message:
                  "Hardcoded string found: \"Enter your name\". Consider using i18n.t('enter.your.name') instead.",
                type: "Literal",
              },
            ],
          },
          {
            code: '<img alt="Profile picture" src="image.jpg" />',
            errors: [
              {
                message:
                  "Hardcoded string found: \"Profile picture\". Consider using i18n.t('profile.picture') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Variable Declaration Detection", () => {
    it("should detect user-facing variable declarations", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: 'const title = "Welcome to our application";',
            errors: [
              {
                message:
                  "Hardcoded string found: \"Welcome to our application\". Consider using i18n.t('welcome.to.our.application') instead.",
                type: "Literal",
              },
            ],
          },
          {
            code: 'const message = "Hello world";',
            errors: [
              {
                message: "Hardcoded string found: \"Hello world\". Consider using i18n.t('hello.world') instead.",
                type: "Literal",
              },
            ],
          },
          {
            code: 'const description = "This is a description";',
            errors: [
              {
                message:
                  "Hardcoded string found: \"This is a description\". Consider using i18n.t('this.is.a.description') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should detect user-facing object properties", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const config = {
              title: "Application Title",
              description: "Application Description",
              buttonText: "Click Me"
            };
            `,
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
              {
                message: "Hardcoded string found: \"Click Me\". Consider using i18n.t('click.me') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Function Return Value Detection", () => {
    it("should detect hardcoded strings in return statements", () => {
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
          {
            code: 'return "Success!";',
            errors: [
              {
                message: "Hardcoded string found: \"Success!\". Consider using i18n.t('success') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should detect hardcoded strings in function expressions", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const getMessage = () => {
              return "Welcome back!";
            };
            `,
            errors: [
              {
                message: "Hardcoded string found: \"Welcome back!\". Consider using i18n.t('welcome.back') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Component Props Detection", () => {
    it("should detect hardcoded strings in component props", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: '<Button label="Submit Form" />',
            errors: [
              {
                message: "Hardcoded string found: \"Submit Form\". Consider using i18n.t('submit.form') instead.",
                type: "Literal",
              },
            ],
          },
          {
            code: '<Modal title="Confirm Action" />',
            errors: [
              {
                message: "Hardcoded string found: \"Confirm Action\". Consider using i18n.t('confirm.action') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Form and Input Detection", () => {
    it("should detect hardcoded strings in form elements", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            <form>
              <label>Full Name</label>
              <input placeholder="Enter your full name" />
              <button>Submit</button>
            </form>
            `,
            errors: [
              {
                message: "Hardcoded string found: \"Full Name\". Consider using i18n.t('full.name') instead.",
                type: "JSXText",
              },
              {
                message:
                  "Hardcoded string found: \"Enter your full name\". Consider using i18n.t('enter.your.full.name') instead.",
                type: "Literal",
              },
              {
                message: "Hardcoded string found: \"Submit\". Consider using i18n.t('submit') instead.",
                type: "JSXText",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Error and Status Message Detection", () => {
    it("should detect hardcoded error messages", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const errorMessages = {
              validation: "Please check your input",
              network: "Connection failed",
              auth: "Invalid credentials"
            };
            `,
            errors: [
              {
                message:
                  "Hardcoded string found: \"Please check your input\". Consider using i18n.t('please.check.your.input') instead.",
                type: "Literal",
              },
              {
                message:
                  "Hardcoded string found: \"Connection failed\". Consider using i18n.t('connection.failed') instead.",
                type: "Literal",
              },
              {
                message:
                  "Hardcoded string found: \"Invalid credentials\". Consider using i18n.t('invalid.credentials') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });

    it("should detect hardcoded status messages", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const statusMessages = {
              loading: "Please wait...",
              success: "Operation completed successfully",
              warning: "Please review your settings"
            };
            `,
            errors: [
              {
                message: "Hardcoded string found: \"Please wait...\". Consider using i18n.t('please.wait') instead.",
                type: "Literal",
              },
              {
                message:
                  "Hardcoded string found: \"Operation completed successfully\". Consider using i18n.t('operation.completed.successfully') instead.",
                type: "Literal",
              },
              {
                message:
                  "Hardcoded string found: \"Please review your settings\". Consider using i18n.t('please.review.your.settings') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Navigation and Menu Detection", () => {
    it("should detect hardcoded navigation text", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
            `,
            errors: [
              {
                message: "Hardcoded string found: \"Home\". Consider using i18n.t('home') instead.",
                type: "JSXText",
              },
              {
                message: "Hardcoded string found: \"About Us\". Consider using i18n.t('about.us') instead.",
                type: "JSXText",
              },
              {
                message: "Hardcoded string found: \"Contact\". Consider using i18n.t('contact') instead.",
                type: "JSXText",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Complex Real-World Scenarios", () => {
    it("should detect hardcoded strings in complex component", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const UserProfile = () => {
              const [user, setUser] = useState(null);
              
              return (
                <div className="profile">
                  <h1>User Profile</h1>
                  <p>Welcome back, {user?.name}!</p>
                  <button onClick={() => setUser(null)}>
                    Sign Out
                  </button>
                </div>
              );
            };
            `,
            errors: [
              {
                message: "Hardcoded string found: \"User Profile\". Consider using i18n.t('user.profile') instead.",
                type: "JSXText",
              },
              {
                message: "Hardcoded string found: \"Welcome back, \". Consider using i18n.t('welcome.back') instead.",
                type: "JSXText",
              },
              {
                message: "Hardcoded string found: \"Sign Out\". Consider using i18n.t('sign.out') instead.",
                type: "JSXText",
              },
            ],
          },
        ],
      });
    });

    it("should detect hardcoded strings in form validation", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [],
        invalid: [
          {
            code: `
            const validateForm = (data) => {
              const errors = [];
              
              if (!data.email) {
                errors.push("Email is required");
              }
              
              if (!data.password) {
                errors.push("Password is required");
              }
              
              if (data.password && data.password.length < 8) {
                errors.push("Password must be at least 8 characters");
              }
              
              return errors;
            };
            `,
            errors: [
              {
                message:
                  "Hardcoded string found: \"Email is required\". Consider using i18n.t('email.is.required') instead.",
                type: "Literal",
              },
              {
                message:
                  "Hardcoded string found: \"Password is required\". Consider using i18n.t('password.is.required') instead.",
                type: "Literal",
              },
              {
                message:
                  "Hardcoded string found: \"Password must be at least 8 characters\". Consider using i18n.t('password.must.be.at.least.8.characters') instead.",
                type: "Literal",
              },
            ],
          },
        ],
      });
    });
  });

  describe("Minimum Length Configuration", () => {
    it("should respect minimum length setting", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: 'const short = "ab";', // Below minimum length
            options: [{ minLength: 3 }],
          },
        ],
        invalid: [
          {
            code: 'const long = "Hello World";', // Above minimum length
            options: [{ minLength: 3 }],
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

  describe("Custom Ignore Patterns", () => {
    it("should detect strings not matching ignore patterns", () => {
      ruleTester.run("no-hardcoded-strings", i18nRules["no-hardcoded-strings"], {
        valid: [
          {
            code: 'const special = "special-pattern";',
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
