/**
 * AST Parsing Tests for aria-props ESLint Rule
 * Tests the detection logic for ARIA attribute validation
 */

import { describe, it, expect } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { ariaProps } from "../eslint-plugin/rules/accessibility/aria-props";

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

describe("aria-props ESLint Rule - AST Parsing", () => {
  describe("Valid ARIA Attributes", () => {
    it("should accept valid ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-label="Close dialog">Close</div>`,
          `<button aria-pressed="false">Toggle</button>`,
          `<input aria-required="true" />`,
          `<div aria-expanded="true">Content</div>`,
          `<div aria-hidden="true">Hidden content</div>`,
          `<div aria-live="polite">Live region</div>`,
          `<div aria-modal="true">Modal dialog</div>`,
          `<div aria-selected="true">Selected item</div>`,
          `<div aria-checked="mixed">Checkbox</div>`,
          `<div aria-disabled="true">Disabled element</div>`,
        ],
        invalid: [],
      });
    });

    it("should accept valid ARIA attributes with dynamic values", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-label={dynamicLabel}>Content</div>`,
          `<button aria-pressed={isPressed}>Toggle</button>`,
          `<input aria-required={isRequired} />`,
          `<div aria-expanded={isExpanded}>Content</div>`,
          `<div aria-hidden={isHidden}>Content</div>`,
        ],
        invalid: [],
      });
    });
  });

  describe("Invalid ARIA Attributes", () => {
    it("should detect invalid ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [],
        invalid: [
          {
            code: `<div aria-invalid-attr="value">Content</div>`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
          {
            code: `<button aria-wrong-prop="true">Button</button>`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
          {
            code: `<input aria-bad-attribute="false" />`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
          {
            code: `<div aria-unknown="value">Content</div>`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
        ],
      });
    });

    it("should detect typos in ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [],
        invalid: [
          {
            code: `<div aria-lable="Close">Close</div>`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
          {
            code: `<button aria-presed="false">Toggle</button>`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
          {
            code: `<input aria-requred="true" />`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
          {
            code: `<div aria-expand="true">Content</div>`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
        ],
      });
    });
  });

  describe("ARIA Attribute Value Validation", () => {
    it("should validate boolean ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-hidden="true">Content</div>`,
          `<div aria-hidden="false">Content</div>`,
          `<div aria-hidden={true}>Content</div>`,
          `<div aria-hidden={false}>Content</div>`,
          `<div aria-hidden={isHidden}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div aria-hidden="yes">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
          {
            code: `<div aria-hidden="no">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
          {
            code: `<div aria-hidden="1">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
          {
            code: `<div aria-hidden="0">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
        ],
      });
    });

    it("should validate tristate ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-checked="true">Checkbox</div>`,
          `<div aria-checked="false">Checkbox</div>`,
          `<div aria-checked="mixed">Checkbox</div>`,
          `<div aria-checked={checked}>Checkbox</div>`,
        ],
        invalid: [
          {
            code: `<div aria-checked="yes">Checkbox</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
          {
            code: `<div aria-checked="indeterminate">Checkbox</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
        ],
      });
    });

    it("should validate live region ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-live="off">Content</div>`,
          `<div aria-live="polite">Content</div>`,
          `<div aria-live="assertive">Content</div>`,
          `<div aria-live={liveValue}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div aria-live="loud">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
          {
            code: `<div aria-live="quiet">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
        ],
      });
    });

    it("should validate orientation ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-orientation="horizontal">Content</div>`,
          `<div aria-orientation="vertical">Content</div>`,
          `<div aria-orientation={orientation}>Content</div>`,
        ],
        invalid: [
          {
            code: `<div aria-orientation="left">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
          {
            code: `<div aria-orientation="right">Content</div>`,
            errors: [{ messageId: "invalidAriaValue" }],
          },
        ],
      });
    });
  });

  describe("Element-Specific ARIA Attributes", () => {
    it("should validate ARIA attributes for interactive elements", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<button aria-pressed="false">Toggle</button>`,
          `<button aria-expanded="true">Menu</button>`,
          `<input aria-required="true" />`,
          `<input aria-invalid="false" />`,
          `<select aria-required="true">Options</select>`,
        ],
        invalid: [],
      });
    });

    it("should validate ARIA attributes for structural elements", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div role="banner" aria-label="Site header">Header</div>`,
          `<div role="main" aria-label="Main content">Content</div>`,
          `<div role="complementary" aria-label="Sidebar">Sidebar</div>`,
          `<div role="contentinfo" aria-label="Footer">Footer</div>`,
        ],
        invalid: [],
      });
    });

    it("should validate ARIA attributes for form elements", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<input aria-describedby="help-text" />`,
          `<input aria-errormessage="error-message" />`,
          `<input aria-autocomplete="list" />`,
          `<input aria-placeholder="Enter your name" />`,
        ],
        invalid: [],
      });
    });
  });

  describe("ARIA Role Validation", () => {
    it("should accept valid ARIA roles", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div role="button">Click me</div>`,
          `<div role="dialog">Modal</div>`,
          `<div role="alert">Alert message</div>`,
          `<div role="tablist">Tabs</div>`,
          `<div role="tab">Tab</div>`,
          `<div role="tabpanel">Tab content</div>`,
          `<div role="menuitem">Menu item</div>`,
          `<div role="menubar">Menu bar</div>`,
          `<div role="tree">Tree view</div>`,
          `<div role="treeitem">Tree item</div>`,
        ],
        invalid: [],
      });
    });

    it("should detect invalid ARIA roles", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [],
        invalid: [
          {
            code: `<div role="invalid-role">Content</div>`,
            errors: [{ messageId: "invalidAriaRole" }],
          },
          {
            code: `<div role="wrong-role">Content</div>`,
            errors: [{ messageId: "invalidAriaRole" }],
          },
          {
            code: `<div role="badrole">Content</div>`,
            errors: [{ messageId: "invalidAriaRole" }],
          },
        ],
      });
    });
  });

  describe("Multiple ARIA Attributes", () => {
    it("should validate multiple ARIA attributes on same element", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div 
            role="button" 
            aria-label="Close dialog" 
            aria-pressed="false"
            aria-expanded="true"
          >
            Close
          </div>`,
          `<input 
            aria-required="true" 
            aria-invalid="false"
            aria-describedby="help-text"
            aria-placeholder="Enter value"
          />`,
        ],
        invalid: [],
      });
    });

    it("should detect multiple invalid ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [],
        invalid: [
          {
            code: `<div 
              role="invalid-role" 
              aria-invalid-attr="value"
              aria-wrong-prop="true"
            >
              Content
            </div>`,
            errors: [
              { messageId: "invalidAriaRole" },
              { messageId: "invalidAriaAttribute" },
              { messageId: "invalidAriaAttribute" },
            ],
          },
        ],
      });
    });
  });

  describe("Dynamic ARIA Attributes", () => {
    it("should handle dynamic ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-label={dynamicLabel}>Content</div>`,
          `<button aria-pressed={isPressed}>Toggle</button>`,
          `<div role={dynamicRole}>Content</div>`,
          `<div aria-expanded={isExpanded}>Content</div>`,
        ],
        invalid: [],
      });
    });

    it("should handle template literals in ARIA attributes", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<div aria-label={\`Item \${index}\`}>Content</div>`,
          `<div aria-describedby={\`help-\${fieldId}\`}>Content</div>`,
        ],
        invalid: [],
      });
    });
  });

  describe("Self-Closing Elements", () => {
    it("should validate ARIA attributes on self-closing elements", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<input aria-required="true" />`,
          `<img aria-label="Description" />`,
          `<br aria-hidden="true" />`,
        ],
        invalid: [
          {
            code: `<input aria-invalid-attr="value" />`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
        ],
      });
    });
  });

  describe("Fragments", () => {
    it("should handle ARIA attributes in fragments", () => {
      ruleTester.run("aria-props", ariaProps, {
        valid: [
          `<>{
            <div aria-label="Content">Content</div>
          }</>`,
        ],
        invalid: [
          {
            code: `<>{
              <div aria-invalid-attr="value">Content</div>
            }</>`,
            errors: [{ messageId: "invalidAriaAttribute" }],
          },
        ],
      });
    });
  });
});

