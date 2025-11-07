/**
 * @file ESLint rule: aria-props
 * Validates ARIA attribute usage for accessibility
 */

import type { Rule } from "eslint";
import type { TSESTree } from "@typescript-eslint/types";
import type { AccessibilityRuleOptions } from "../../types.js";
import { getAriaAttributes } from "../../utils/index.js";

// ============================================================================
// ARIA Validation Data
// ============================================================================

const VALID_ARIA_ATTRIBUTES = new Set([
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
]);

const VALID_ARIA_ROLES = new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "button",
  "cell",
  "checkbox",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "dialog",
  "directory",
  "document",
  "feed",
  "figure",
  "form",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "navigation",
  "none",
  "note",
  "option",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "textbox",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
]);

const ARIA_ATTRIBUTE_VALUES: Record<string, Set<string>> = {
  "aria-autocomplete": new Set(["inline", "list", "both", "none"]),
  "aria-checked": new Set(["true", "false", "mixed"]),
  "aria-current": new Set(["page", "step", "location", "date", "time", "true", "false"]),
  "aria-expanded": new Set(["true", "false"]),
  "aria-haspopup": new Set(["true", "false", "menu", "listbox", "tree", "grid", "dialog"]),
  "aria-hidden": new Set(["true", "false"]),
  "aria-invalid": new Set(["true", "false", "grammar", "spelling"]),
  "aria-live": new Set(["off", "polite", "assertive"]),
  "aria-modal": new Set(["true", "false"]),
  "aria-multiline": new Set(["true", "false"]),
  "aria-multiselectable": new Set(["true", "false"]),
  "aria-orientation": new Set(["horizontal", "vertical"]),
  "aria-pressed": new Set(["true", "false", "mixed"]),
  "aria-readonly": new Set(["true", "false"]),
  "aria-required": new Set(["true", "false"]),
  "aria-selected": new Set(["true", "false"]),
  "aria-sort": new Set(["ascending", "descending", "none", "other"]),
};

// ============================================================================
// Rule Definition
// ============================================================================

export const ariaProps: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Validate ARIA attribute usage for accessibility",
      category: "Accessibility",
      recommended: true,
      url: "https://github.com/entropy-tamer/reynard/blob/main/packages/core/testing/src/eslint-plugin/rules/accessibility/aria-props.ts",
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          enabled: {
            type: "boolean",
            default: true,
          },
          validateAria: {
            type: "boolean",
            default: true,
          },
          ignorePatterns: {
            type: "array",
            items: { type: "string" },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidAriaAttribute: 'Invalid ARIA attribute "{{attribute}}"',
      invalidAriaRole: 'Invalid ARIA role "{{role}}"',
      invalidAriaValue: 'Invalid value "{{value}}" for ARIA attribute "{{attribute}}". Valid values: {{validValues}}',
      missingAriaLabel: 'Element with role "{{role}}" should have aria-label or aria-labelledby',
      conflictingAriaAttributes: "Conflicting ARIA attributes: {{attributes}}",
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = (context.options[0] as AccessibilityRuleOptions) || {};
    const enabled = options.enabled !== false;
    const validateAria = options.validateAria !== false;
    // const ignorePatterns = options.ignorePatterns || []; // TODO: Implement ignore patterns

    // Early return if rule is disabled
    if (!enabled) {
      return {} as Rule.RuleListener;
    }

    // ========================================================================
    // Helper Functions
    // ========================================================================

    /**
     * Get ARIA role from element
     */
    function getAriaRole(node: TSESTree.JSXElement): string | null {
      for (const attribute of node.openingElement.attributes) {
        if (
          attribute.type === "JSXAttribute" &&
          attribute.name.type === "JSXIdentifier" &&
          attribute.name.name === "role"
        ) {
          if (attribute.value && attribute.value.type === "Literal" && typeof attribute.value.value === "string") {
            return attribute.value.value;
          }
        }
      }
      return null;
    }

    /**
     * Get ARIA attribute value
     */
    function getAriaAttributeValue(node: TSESTree.JSXElement, attributeName: string): string | null {
      for (const attribute of node.openingElement.attributes) {
        if (
          attribute.type === "JSXAttribute" &&
          attribute.name.type === "JSXIdentifier" &&
          attribute.name.name === attributeName
        ) {
          if (attribute.value && attribute.value.type === "Literal" && typeof attribute.value.value === "string") {
            return attribute.value.value;
          }
        }
      }
      return null;
    }

    /**
     * Check if element has aria-label or aria-labelledby
     */
    function hasAriaLabel(node: TSESTree.JSXElement): boolean {
      return (
        getAriaAttributeValue(node, "aria-label") !== null || getAriaAttributeValue(node, "aria-labelledby") !== null
      );
    }

    /**
     * Check for conflicting ARIA attributes
     */
    function getConflictingAriaAttributes(node: TSESTree.JSXElement): string[] {
      const conflicts: string[] = [];
      const ariaAttributes = getAriaAttributes(node);

      // Check for conflicting attributes
      if (ariaAttributes.includes("aria-label") && ariaAttributes.includes("aria-labelledby")) {
        conflicts.push("aria-label and aria-labelledby");
      }

      if (ariaAttributes.includes("aria-describedby") && ariaAttributes.includes("aria-errormessage")) {
        conflicts.push("aria-describedby and aria-errormessage");
      }

      return conflicts;
    }

    /**
     * Report invalid ARIA attribute
     */
    function reportInvalidAriaAttribute(node: TSESTree.JSXElement, attribute: string) {
      context.report({
        node,
        messageId: "invalidAriaAttribute",
        data: { attribute },
      });
    }

    /**
     * Report invalid ARIA role
     */
    function reportInvalidAriaRole(node: TSESTree.JSXElement, role: string) {
      context.report({
        node,
        messageId: "invalidAriaRole",
        data: { role },
      });
    }

    /**
     * Report invalid ARIA value
     */
    function reportInvalidAriaValue(
      node: TSESTree.JSXElement,
      attribute: string,
      value: string,
      validValues: string[]
    ) {
      context.report({
        node,
        messageId: "invalidAriaValue",
        data: {
          attribute,
          value,
          validValues: validValues.join(", "),
        },
      });
    }

    /**
     * Report missing ARIA label
     */
    function reportMissingAriaLabel(node: TSESTree.JSXElement, role: string) {
      context.report({
        node,
        messageId: "missingAriaLabel",
        data: { role },
      });
    }

    /**
     * Report conflicting ARIA attributes
     */
    function reportConflictingAriaAttributes(node: TSESTree.JSXElement, conflicts: string[]) {
      context.report({
        node,
        messageId: "conflictingAriaAttributes",
        data: { attributes: conflicts.join(", ") },
      });
    }

    // ========================================================================
    // Rule Implementation
    // ========================================================================

    return {
      JSXElement(node: any) {
        if (!validateAria) {
          return;
        }

        const ariaAttributes = getAriaAttributes(node);
        const role = getAriaRole(node);

        // Validate ARIA role
        if (role && !VALID_ARIA_ROLES.has(role)) {
          reportInvalidAriaRole(node, role);
        }

        // Validate ARIA attributes
        for (const attribute of ariaAttributes) {
          if (!VALID_ARIA_ATTRIBUTES.has(attribute)) {
            reportInvalidAriaAttribute(node, attribute);
            continue;
          }

          // Validate attribute values
          const value = getAriaAttributeValue(node, attribute);
          if (value && ARIA_ATTRIBUTE_VALUES[attribute]) {
            const validValues = ARIA_ATTRIBUTE_VALUES[attribute];
            if (!validValues.has(value)) {
              reportInvalidAriaValue(node, attribute, value, Array.from(validValues));
            }
          }
        }

        // Check for missing aria-label on interactive elements
        if (role && ["button", "link", "menuitem", "tab", "option"].includes(role)) {
          if (!hasAriaLabel(node)) {
            reportMissingAriaLabel(node, role);
          }
        }

        // Check for conflicting ARIA attributes
        const conflicts = getConflictingAriaAttributes(node);
        if (conflicts.length > 0) {
          reportConflictingAriaAttributes(node, conflicts);
        }
      },
    };
  },
};

export default ariaProps;
