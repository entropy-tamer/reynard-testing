/**
 * AST Parsing Tests for prefer-memo ESLint Rule
 * Tests the detection logic for expensive computations that should be memoized
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

describe("prefer-memo ESLint Rule - AST Parsing", () => {
  describe("Array Operations Detection", () => {
    it("should detect expensive array operations in JSX", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Already memoized array operations
          `const memoizedData = createMemo(() => items.map(item => item.name));`,
          `const filtered = createMemo(() => data.filter(x => x.active));`,
        ],
        invalid: [
          {
            code: `<div>{items.map(item => <span key={item.id}>{item.name}</span>)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{data.filter(x => x.active).length}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{items.reduce((acc, item) => acc + item.value, 0)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{items.find(item => item.id === targetId)?.name}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{items.some(item => item.active)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{items.every(item => item.valid)}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{items.sort((a, b) => a.name.localeCompare(b.name))}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{items.reverse()}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
        ],
      });
    });

    it("should detect array operations in variable declarations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Outside component context - should not trigger
          `const data = items.map(item => item.name);`,
        ],
        invalid: [
          {
            code: `
              function MyComponent() {
                const processedData = items.map(item => item.name);
                return <div>{processedData}</div>;
              }
            `,
            errors: [{ messageId: "suggestMemo" }],
          },
          {
            code: `
              function MyComponent() {
                const filtered = data.filter(x => x.active);
                return <div>{filtered.length}</div>;
              }
            `,
            errors: [{ messageId: "suggestMemo" }],
          },
        ],
      });
    });
  });

  describe("Mathematical Operations Detection", () => {
    it("should detect expensive mathematical operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations that are not expensive
          `<div>{a + b}</div>`,
          `<div>{a - b}</div>`,
          // Already memoized
          `const result = createMemo(() => a * b);`,
        ],
        invalid: [
          {
            code: `<div>{a * b}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
          },
          {
            code: `<div>{a / b}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
          },
          {
            code: `<div>{a % b}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
          },
          {
            code: `<div>{a ** b}</div>`,
            errors: [{ messageId: "mathematicalOperation" }],
          },
        ],
      });
    });

    it("should detect mathematical operations in component context", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple operations outside component context
          `<div>{width + height}</div>`,
          `<div>{total - count}</div>`,
        ],
        invalid: [
          {
            code: `
              function MyComponent() {
                return <div>{width * height}</div>;
              }
            `,
            errors: [{ messageId: "mathematicalOperation" }],
          },
          {
            code: `
              function MyComponent() {
                return <div>{total / count}</div>;
              }
            `,
            errors: [{ messageId: "mathematicalOperation" }],
          },
        ],
      });
    });
  });

  describe("String Operations Detection", () => {
    it("should detect expensive string operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple string operations
          `<div>{text}</div>`,
          `<div>{text + suffix}</div>`,
          // Already memoized
          `const upper = createMemo(() => text.toUpperCase());`,
        ],
        invalid: [
          {
            code: `<div>{text.toUpperCase()}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
          {
            code: `<div>{text.toLowerCase()}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
          {
            code: `<div>{text.trim()}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
          {
            code: `<div>{text.replace(/old/g, 'new')}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
          {
            code: `<div>{text.split(',').length}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
          {
            code: `<div>{items.join(', ')}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
        ],
      });
    });
  });

  describe("Object Operations Detection", () => {
    it("should detect expensive object operations", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple object access
          `<div>{obj.property}</div>`,
          // Already memoized
          `const keys = createMemo(() => Object.keys(obj));`,
        ],
        invalid: [
          {
            code: `<div>{Object.keys(obj).length}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
          {
            code: `<div>{Object.values(obj).length}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
          {
            code: `<div>{Object.entries(obj).length}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
          {
            code: `<div>{Object.assign({}, obj).property}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
          {
            code: `<div>{Object.freeze(obj).property}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
          {
            code: `<div>{Object.seal(obj).property}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
        ],
      });
    });
  });

  describe("Memoization Detection", () => {
    it("should recognize already memoized expressions", () => {
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

    it("should detect nested memoization", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          `<div>{createMemo(() => createMemo(() => items.map(item => item.name)))}</div>`,
        ],
        invalid: [],
      });
    });
  });

  describe("Component Context Detection", () => {
    it("should detect component functions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Non-component functions should not trigger
          `function helper() {
            const data = items.map(item => item.name);
            return data;
          }`,
        ],
        invalid: [
          {
            code: `
              function MyComponent() {
                const data = items.map(item => item.name);
                return <div>{data}</div>;
              }
            `,
            errors: [{ messageId: "suggestMemo" }],
          },
          {
            code: `
              function UserProfile() {
                const processed = data.filter(x => x.active);
                return <div>{processed.length}</div>;
              }
            `,
            errors: [{ messageId: "suggestMemo" }],
          },
        ],
      });
    });

    it("should detect arrow function components", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Non-component arrow functions should not trigger
          `const helper = () => {
            const data = items.map(item => item.name);
            return data;
          };`,
        ],
        invalid: [
          {
            code: `
              const MyComponent = () => {
                const data = items.map(item => item.name);
                return <div>{data}</div>;
              };
            `,
            errors: [{ messageId: "suggestMemo" }],
          },
        ],
      });
    });
  });

  describe("Return Statement Detection", () => {
    it("should detect expensive operations in return statements", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple returns
          `function MyComponent() {
            return <div>Hello</div>;
          }`,
        ],
        invalid: [
          {
            code: `
              function MyComponent() {
                return <div>{items.map(item => <span key={item.id}>{item.name}</span>)}</div>;
              }
            `,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `
              function MyComponent() {
                return <div>{a * b}</div>;
              }
            `,
            errors: [{ messageId: "mathematicalOperation" }],
          },
        ],
      });
    });
  });

  describe("Complex Expression Detection", () => {
    it("should detect complex nested expressions", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple expressions should not trigger
          `<div>{items.length}</div>`,
          `<div>{obj.property}</div>`,
          `<div>{text}</div>`,
        ],
        invalid: [
          {
            code: `<div>{items.map(item => item.name).filter(name => name.length > 0).length}</div>`,
            errors: [{ messageId: "arrayOperation" }],
          },
          {
            code: `<div>{Object.keys(obj).map(key => obj[key]).filter(value => value > 0)}</div>`,
            errors: [{ messageId: "objectOperation" }],
          },
          {
            code: `<div>{text.split(',').map(s => s.trim()).filter(s => s.length > 0)}</div>`,
            errors: [{ messageId: "stringOperation" }],
          },
        ],
      });
    });

    it("should detect ternary expressions with expensive branches", () => {
      ruleTester.run("prefer-memo", preferMemo, {
        valid: [
          // Simple ternary expressions should not trigger
          `<div>{condition ? 'Yes' : 'No'}</div>`,
          `<div>{condition ? a + b : c + d}</div>`,
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
        ],
      });
    });
  });
});
