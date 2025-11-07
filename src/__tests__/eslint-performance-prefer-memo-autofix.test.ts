/**
 * Auto-fix Test Suite for prefer-memo ESLint Rule
 * Tests automatic code fixes and suggestions
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

describe("prefer-memo ESLint Rule - Auto-fix", () => {
  describe("Array Operations Auto-fix", () => {
    it("should provide fix for array operations in JSX", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{items.map(item => item.name)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{data.filter(x => x.active)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{items.reduce((acc, item) => acc + item.value, 0)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
        ],
      });
    });

    it("should provide fix for array operations in variable declarations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `
              function MyComponent() {
                const data = items.map(item => item.name);
                return <div>{data}</div>;
              }
            `,
            errors: [{ messageId: "suggestMemo" }],
            output: `
              function MyComponent() {
                const data = createMemo(() => expression);
                return <div>{data}</div>;
              }
            `,
          },
        ],
      });
    });

    it("should provide fix for array operations in return statements", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `
              function MyComponent() {
                return <div>{items.map(item => <span key={item.id}>{item.name}</span>)}</div>;
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
            output: `
              function MyComponent() {
                return <div>{createMemo(() => expression)}</div>;
              }
            `,
          },
        ],
      });
    });
  });

  describe("Mathematical Operations Auto-fix", () => {
    it("should provide fix for mathematical operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{a * b}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{width / height}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{total % count}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{base ** exponent}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
        ],
      });
    });

    it("should provide fix for mathematical operations in component context", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `
              function MyComponent() {
                return <div>{width * height}</div>;
              }
            `,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `
              function MyComponent() {
                return <div>{createMemo(() => expression)}</div>;
              }
            `,
          },
        ],
      });
    });
  });

  describe("String Operations Auto-fix", () => {
    it("should provide fix for string operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{text.toUpperCase()}</div>`,
            errors: [{ messageId: "stringOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{text.toLowerCase()}</div>`,
            errors: [{ messageId: "stringOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{text.trim()}</div>`,
            errors: [{ messageId: "stringOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{text.replace(/old/g, 'new')}</div>`,
            errors: [{ messageId: "stringOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{text.split(',').length}</div>`,
            errors: [{ messageId: "stringOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{items.join(', ')}</div>`,
            errors: [{ messageId: "stringOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
        ],
      });
    });
  });

  describe("Object Operations Auto-fix", () => {
    it("should provide fix for object operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{Object.keys(obj).length}</div>`,
            errors: [{ messageId: "objectOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{Object.values(obj).length}</div>`,
            errors: [{ messageId: "objectOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{Object.entries(obj).length}</div>`,
            errors: [{ messageId: "objectOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{Object.assign({}, obj).property}</div>`,
            errors: [{ messageId: "objectOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{Object.freeze(obj).property}</div>`,
            errors: [{ messageId: "objectOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{Object.seal(obj).property}</div>`,
            errors: [{ messageId: "objectOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
        ],
      });
    });
  });

  describe("Complex Expression Auto-fix", () => {
    it("should provide fix for complex nested expressions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{items.map(item => item.name).filter(name => name.length > 0).length}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{Object.keys(obj).map(key => obj[key]).filter(value => value > 0)}</div>`,
            errors: [{ messageId: "objectOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{text.split(',').map(s => s.trim()).filter(s => s.length > 0)}</div>`,
            errors: [{ messageId: "stringOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
        ],
      });
    });

    it("should provide fix for ternary expressions with expensive branches", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{condition ? items.map(item => item.name) : 'No items'}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{condition ? a * b : c * d}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
        ],
      });
    });
  });

  describe("Binary Expression Auto-fix", () => {
    it("should provide fix for binary expressions in component context", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `
              function MyComponent() {
                return <div>{width * height}</div>;
              }
            `,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `
              function MyComponent() {
                return <div>{createMemo(() => expression)}</div>;
              }
            `,
          },
          {
            code: `
              function MyComponent() {
                return <div>{total / count}</div>;
              }
            `,
            errors: [{ messageId: "mathematicalOperation" }],
            output: `
              function MyComponent() {
                return <div>{createMemo(() => expression)}</div>;
              }
            `,
          },
        ],
      });
    });
  });

  describe("Auto-fix Edge Cases", () => {
    it("should handle self-closing elements", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<img src={items.map(item => item.url).join(',')} />`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<img src={createMemo(() => expression)} />`,
          },
        ],
      });
    });

    it("should handle fragments", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<>{
              items.map(item => <span key={item.id}>{item.name}</span>)
            }</>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<>{
              createMemo(() => expression)
            }</>`,
          },
        ],
      });
    });

    it("should handle nested JSX", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `
              <div>
                <span>{items.map(item => item.name)}</span>
                <p>{a * b}</p>
              </div>
            `,
            errors: [{ messageId: "arrayOperation" }, { messageId: "mathematicalOperation" }],
            output: `
              <div>
                <span>{createMemo(() => expression)}</span>
                <p>{createMemo(() => expression)}</p>
              </div>
            `,
          },
        ],
      });
    });

    it("should handle template literals", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{\`Items: \${items.map(item => item.name).join(', ')}\`}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{\`Items: \${createMemo(() => expression)}\`}</div>`,
          },
        ],
      });
    });
  });

  describe("Auto-fix Validation", () => {
    it("should produce valid code after fixes", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // These should be valid after auto-fix
          `<div>{createMemo(() => expression)}</div>`,
          `function MyComponent() {
            const data = createMemo(() => expression);
            return <div>{data}</div>;
          }`,
        ],
        invalid: [],
      });
    });

    it("should not fix already memoized expressions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `<div>{createMemo(() => items.map(item => item.name))}</div>`,
          `<div>{createMemo(() => a * b)}</div>`,
          `<div>{createMemo(() => text.toUpperCase())}</div>`,
          `<div>{createMemo(() => Object.keys(obj))}</div>`,
        ],
        invalid: [],
      });
    });

    it("should not fix expressions outside component context", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `const data = items.map(item => item.name);`,
          `const result = a * b;`,
          `const upper = text.toUpperCase();`,
          `const keys = Object.keys(obj);`,
        ],
        invalid: [],
      });
    });
  });

  describe("Auto-fix Integration", () => {
    it("should work with other ESLint rules", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `
              function MyComponent() {
                const unused = 'test';
                return <div>{items.map(item => item.name)}</div>;
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
            output: `
              function MyComponent() {
                const unused = 'test';
                return <div>{createMemo(() => expression)}</div>;
              }
            `,
          },
        ],
      });
    });

    it("should preserve code formatting", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `
              function MyComponent() {
                return (
                  <div>
                    {items.map(item => item.name)}
                  </div>
                );
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
            output: `
              function MyComponent() {
                return (
                  <div>
                    {createMemo(() => expression)}
                  </div>
                );
              }
            `,
          },
        ],
      });
    });

    it("should handle TypeScript syntax", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [],
        invalid: [
          {
            code: `<div>{(data as string[]).map(item => item.toUpperCase())}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
          {
            code: `<div>{items.map<string>(item => item.name)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
            output: `<div>{createMemo(() => expression)}</div>`,
          },
        ],
      });
    });
  });
});
