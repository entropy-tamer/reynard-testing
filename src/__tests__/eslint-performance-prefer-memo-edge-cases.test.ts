/**
 * Edge Cases Test Suite for prefer-memo ESLint Rule
 * Tests edge cases and boundary conditions
 */

import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { preferMemo } from "../eslint-plugin/rules/performance/prefer-memo";

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

describe("prefer-memo ESLint Rule - Edge Cases", () => {
  describe("Empty Files and Whitespace", () => {
    it("should handle empty files", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          {
            code: "",
          },
        ],
        invalid: [],
      });
    });

    it("should handle files with only comments", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          {
            code: `
              // This is a comment
              /* This is a block comment */
            `,
          },
        ],
        invalid: [],
      });
    });

    it("should handle files with only whitespace", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          {
            code: "   \n\t  \n  ",
          },
        ],
        invalid: [],
      });
    });
  });

  describe("Already Memoized Expressions", () => {
    it("should not trigger for already memoized expressions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `<div>{createMemo(() => items.map(item => item.name))}</div>`,
          `<div>{createMemo(() => a * b)}</div>`,
          `<div>{createMemo(() => text.toUpperCase())}</div>`,
          `<div>{createMemo(() => Object.keys(obj))}</div>`,
          // Nested memoization
          `<div>{createMemo(() => createMemo(() => items.map(item => item.name)))}</div>`,
          // Variable with memoized value
          `const memoizedData = createMemo(() => items.map(item => item.name));
           <div>{memoizedData}</div>`,
        ],
        invalid: [],
      });
    });

    it("should handle memoized expressions in different contexts", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `function MyComponent() {
            const data = createMemo(() => items.map(item => item.name));
            return <div>{data}</div>;
          }`,
          `function MyComponent() {
            const result = createMemo(() => a * b);
            return <div>{result}</div>;
          }`,
        ],
        invalid: [],
      });
    });
  });

  describe("Nested Expensive Operations", () => {
    it("should detect nested expensive operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `<div>{items.length}</div>`,
          `<div>{obj.property}</div>`,
          `<div>{text}</div>`,
        ],
        invalid: [
          {
            code: `<div>{items.map(item => item.data.filter(x => x.active).length)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{Object.keys(obj).map(key => obj[key] * 2)}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
          {
            code: `<div>{text.split(',').map(s => s.trim().toUpperCase())}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
        ],
      });
    });

    it("should handle deeply nested operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `<div>{items.length}</div>`,
        ],
        invalid: [
          {
            code: `<div>{items.map(item => item.data.filter(x => x.active).map(y => y.name).join(', '))}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });

  describe("Ternary Expressions", () => {
    it("should detect expensive operations in ternary branches", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple ternary
          `<div>{condition ? 'Yes' : 'No'}</div>`,
          // Already memoized
          `<div>{condition ? createMemo(() => items.map(item => item.name)) : 'No items'}</div>`,
        ],
        invalid: [
          {
            code: `<div>{condition ? items.map(item => item.name) : 'No items'}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{condition ? a * b : c * d}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
          },
          {
            code: `<div>{condition ? text.toUpperCase() : text.toLowerCase()}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
        ],
      });
    });

    it("should handle nested ternary expressions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple ternary should not trigger
          `<div>{condition1 ? 'Yes' : 'No'}</div>`,
        ],
        invalid: [
          {
            code: `<div>{condition1 ? (condition2 ? items.map(item => item.name) : 'No items') : 'Default'}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });

  describe("Complex Call Chains", () => {
    it("should detect expensive operations in call chains", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `<div>{getData()}</div>`,
          `<div>{getText()}</div>`,
          `<div>{getObject()}</div>`,
        ],
        invalid: [
          {
            code: `<div>{getData().map(item => item.name).filter(name => name.length > 0)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{getText().split(',').map(s => s.trim()).join(' | ')}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
          {
            code: `<div>{getObject().keys().map(key => key.toUpperCase())}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
        ],
      });
    });

    it("should handle method chaining", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `<div>{items.length}</div>`,
        ],
        invalid: [
          {
            code: `<div>{items.map(item => item.name).sort().reverse()}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });

  describe("Disabled Rule Scenarios", () => {
    it("should respect disabled rule configuration", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          {
            code: `<div>{items.map(item => item.name)}</div>`,
            options: [{ enabled: false }],
          },
          {
            code: `<div>{a * b}</div>`,
            options: [{ checkMemoization: false }],
          },
        ],
        invalid: [],
      });
    });

    it("should respect ignore patterns", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          {
            code: `<div className="ignore-memo">{items.map(item => item.name)}</div>`,
            options: [{ ignorePatterns: ["ignore-memo"] }],
          },
        ],
        invalid: [],
      });
    });
  });

  describe("Edge Case Expressions", () => {
    it("should handle empty arrays and objects", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [`<div>{[].length}</div>`, `<div>{Object.keys({}).length}</div>`, `<div>{''.length}</div>`],
        invalid: [],
      });
    });

    it("should handle null and undefined", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [`<div>{null}</div>`, `<div>{undefined}</div>`, `<div>{data?.map(item => item.name)}</div>`],
        invalid: [],
      });
    });

    it("should handle template literals", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [`<div>{\`Hello \${name}\`}</div>`, `<div>{\`Count: \${items.length}\`}</div>`],
        invalid: [
          {
            code: `<div>{\`Items: \${items.map(item => item.name).join(', ')}\`}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });

  describe("Function Context Edge Cases", () => {
    it("should handle non-component functions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `function helper() {
            const data = items.map(item => item.name);
            return data;
          }`,
          `const utility = () => {
            const result = a * b;
            return result;
          };`,
        ],
        invalid: [],
      });
    });

    it("should handle class methods", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `class MyClass {
            method() {
              const data = items.map(item => item.name);
              return data;
            }
          }`,
        ],
        invalid: [],
      });
    });

    it("should handle arrow functions in non-component context", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `const processData = () => {
            const data = items.map(item => item.name);
            return data;
          };`,
        ],
        invalid: [],
      });
    });
  });

  describe("JSX Edge Cases", () => {
    it("should handle self-closing elements", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `<img src="test.jpg" />`,
        ],
        invalid: [
          {
            code: `<img src={items.map(item => item.url).join(',')} />`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });

    it("should handle fragments", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `<>{
            <span>Hello</span>
          }</>`,
        ],
        invalid: [
          {
            code: `<>{
              items.map(item => <span key={item.id}>{item.name}</span>)
            }</>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });

    it("should handle nested JSX", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `
            <div>
              <span>{items.length}</span>
              <p>{a + b}</p>
            </div>
          `,
        ],
        invalid: [
          {
            code: `
              <div>
                <span>{items.map(item => item.name)}</span>
                <p>{a * b}</p>
              </div>
            `,
            errors: [{ messageId: "arrayOperation" }, { messageId: "mathematicalOperation" }],
          },
        ],
      });
    });
  });

  describe("TypeScript Edge Cases", () => {
    it("should handle type assertions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [`<div>{(data as string[]).length}</div>`],
        invalid: [
          {
            code: `<div>{(data as string[]).map(item => item.toUpperCase())}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });

    it("should handle generic types", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations should not trigger
          `<div>{items.length}</div>`,
        ],
        invalid: [
          {
            code: `<div>{items.map<string>(item => item.name)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });
  });
});
