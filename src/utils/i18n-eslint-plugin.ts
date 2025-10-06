/**
 * ESLint Plugin for i18n Testing
 * Detects hardcoded strings and i18n issues in Reynard packages
 */

import type { Rule } from "eslint";

// ESLint rule definitions
export const i18nRules: Record<string, Rule.RuleModule> = {
  "no-hardcoded-strings": {
    meta: {
      type: "problem" as const,
      docs: {
        description: "Disallow hardcoded strings in JSX/TSX files",
        category: "Best Practices",
        recommended: true,
      },
      fixable: "code",
      schema: [
        {
          type: "object",
          properties: {
            ignorePatterns: {
              type: "array",
              items: { type: "string" },
              default: [],
            },
            minLength: {
              type: "number",
              default: 3,
            },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context: Rule.RuleContext) {
      const options = context.options[0] || {};
      const ignorePatterns = options.ignorePatterns || [];
      const minLength = options.minLength || 3;

      return {
        JSXText(node: any) {
          const text = node.value.trim();

          if (text.length < minLength) return;
          if (ignorePatterns.some((pattern: string) => text.match(new RegExp(pattern)))) return;
          if (isTechnicalTerm(text)) return;

          context.report({
            node,
            message: `Hardcoded string found: "${text}". Consider using i18n.t('${generateTranslationKey(text)}') instead.`,
            fix(fixer: any) {
              return fixer.replaceText(node, `{i18n.t('${generateTranslationKey(text)}')}`);
            },
          });
        },

        Literal(node: any) {
          if (typeof node.value !== "string") return;
          if (node.value.length < minLength) return;
          if (ignorePatterns.some((pattern: string) => node.value.match(new RegExp(pattern)))) return;
          if (isTechnicalTerm(node.value)) return;

          // Skip if parent is already using i18n
          if (
            node.parent &&
            node.parent.type === "CallExpression" &&
            node.parent.callee &&
            (node.parent.callee.name === "t" || node.parent.callee.property?.name === "t")
          ) {
            return;
          }

          // Skip if in technical contexts
          if (isInTechnicalContext(node)) {
            return;
          }

          // Skip if it's a user-facing string that should be internationalized
          if (!isUserFacingString(node)) {
            return;
          }

          context.report({
            node,
            message: `Hardcoded string found: "${node.value}". Consider using i18n.t('${generateTranslationKey(node.value)}') instead.`,
          });
        },
      };
    },
  },

  "no-untranslated-keys": {
    meta: {
      type: "problem",
      docs: {
        description: "Ensure all translation keys exist in translation files",
        category: "Best Practices",
        recommended: true,
      },
      schema: [
        {
          type: "object",
          properties: {
            translationFiles: {
              type: "array",
              items: { type: "string" },
              default: ["src/lang/**/*.ts"],
            },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context: any) {
      // const options = context.options[0] || {};
      // const _translationFiles = options.translationFiles || ["src/lang/**/*.ts"];

      return {
        CallExpression(node: any) {
          if (
            node.callee &&
            (node.callee.name === "t" ||
              (node.callee.type === "MemberExpression" && node.callee.property?.name === "t"))
          ) {
            const key = node.arguments[0];
            if (key && key.type === "Literal" && typeof key.value === "string") {
              // This would check against actual translation files
              // For now, just report as a warning
              context.report({
                node: key,
                message: `Translation key "${key.value}" should be validated against translation files.`,
              });
            }
          }
        },
      };
    },
  },
};

// Helper functions
function generateTranslationKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".")
    .substring(0, 50);
}

function isTechnicalTerm(text: string): boolean {
  const technicalTerms = [
    "id",
    "class",
    "type",
    "name",
    "value",
    "key",
    "index",
    "count",
    "size",
    "width",
    "height",
    "color",
    "url",
    "path",
    "file",
    "dir",
    "src",
    "alt",
    "title",
    "role",
    "aria",
    "data",
    "test",
    "spec",
    "mock",
    "stub",
    "fixture",
    "commander",
    "eslint",
    "typescript",
    "javascript",
    "node",
    "npm",
    "pnpm",
    "yarn",
    "webpack",
    "vite",
    "rollup",
    "babel",
    "jest",
    "vitest",
    "mocha",
    "chai",
    "sinon",
    "cypress",
    "playwright",
    "selenium",
    "karma",
    "jasmine",
    "ava",
    "tape",
    "tap",
    "nyc",
    "istanbul",
    "c8",
    "esbuild",
    "swc",
    "tsc",
    "tsx",
    "jsx",
    "ts",
    "js",
    "mjs",
    "cjs",
    "json",
    "yaml",
    "yml",
    "toml",
    "ini",
    "env",
    "dotenv",
    "config",
    "package",
    "lock",
    "lockfile",
    "manifest",
    "readme",
    "changelog",
    "license",
    "gitignore",
    "gitattributes",
    "editorconfig",
    "prettier",
    "eslintrc",
    "tsconfig",
    "jsconfig",
    "babelrc",
    "webpack",
    "rollup",
    "vite",
    "vitest",
    "jest",
    "cypress",
    "playwright",
    "karma",
    "jasmine",
    "mocha",
    "chai",
    "sinon",
    "ava",
    "tape",
    "tap",
    "nyc",
    "istanbul",
    "c8",
    "esbuild",
    "swc",
    "tsc",
    "tsx",
    "jsx",
    "ts",
    "js",
    "mjs",
    "cjs",
    "json",
    "yaml",
    "yml",
    "toml",
    "ini",
    "env",
    "dotenv",
    "config",
    "package",
    "lock",
    "lockfile",
    "manifest",
    "readme",
    "changelog",
    "license",
    "gitignore",
    "gitattributes",
    "editorconfig",
    "prettier",
    "eslintrc",
    "tsconfig",
    "jsconfig",
    "babelrc",
  ];

  return (
    technicalTerms.includes(text.toLowerCase()) ||
    /^[a-z]+[A-Z][a-z]*$/.test(text) || // camelCase
    /^[A-Z_]+$/.test(text) || // CONSTANTS
    /^[a-z-]+$/.test(text) || // kebab-case
    /^[a-z]+\.[a-z]+$/.test(text) || // dot notation
    /^[a-z]+:[a-z]+$/.test(text) || // colon notation
    /^[a-z]+\/[a-z]+$/.test(text) || // slash notation
    /^[a-z]+\.[a-z]+\.[a-z]+$/.test(text) || // nested dot notation
    /^oklch\([^)]+\)$/.test(text) || // OKLCH color values
    /^#[0-9a-fA-F]{3,8}$/.test(text) || // hex color values
    /^rgb\([^)]+\)$/.test(text) || // RGB color values
    /^rgba\([^)]+\)$/.test(text) || // RGBA color values
    /^hsl\([^)]+\)$/.test(text) || // HSL color values
    /^hsla\([^)]+\)$/.test(text) || // HSLA color values
    /^[0-9]+(px|em|rem|%|vh|vw|pt|pc|in|cm|mm)$/.test(text) || // CSS units
    /^[0-9]+(\.[0-9]+)?$/.test(text) // numeric values
  );
}

function isInTranslationFile(node: any): boolean {
  // Check if we're in a translation file by looking at the file path
  const sourceCode = node.sourceCode || node.getSourceCode?.();
  if (!sourceCode) return false;

  const filename = sourceCode.getFilename();
  if (!filename) return false;

  // Check if the file is in a translation directory or has translation-related names
  return (
    filename.includes("/translations/") ||
    filename.includes("/lang/") ||
    filename.includes("/i18n/") ||
    filename.includes("/locales/") ||
    /\.(translation|i18n|locale)\.(ts|js|json)$/i.test(filename) ||
    /\/lang\/[a-z]{2}\//.test(filename) || // e.g., /lang/en/, /lang/es/
    /\/translations\/data\/lang\/[a-z]{2}\//.test(filename) // e.g., /translations/data/lang/en/
  );
}

function isInTranslationObjectValue(node: any): boolean {
  // Check if we're inside a translation object value
  let current = node;
  let depth = 0;
  const maxDepth = 10; // Prevent infinite loops

  while (current && current.parent && depth < maxDepth) {
    const parent = current.parent;

    // If we're in a Property and it's a value (not a key), check if it looks like a translation
    if (parent.type === "Property" && parent.value === current) {
      // Check if the parent object or variable name suggests it's a translation
      let obj = parent;
      let objDepth = 0;

      while (obj && obj.parent && objDepth < 5) {
        if (obj.parent.type === "VariableDeclarator" && obj.parent.id?.name) {
          const varName = obj.parent.id.name.toLowerCase();
          if (
            varName.includes("translation") ||
            varName.includes("i18n") ||
            varName.includes("locale") ||
            varName.includes("lang") ||
            /^[a-z]{2}$/.test(varName)
          ) {
            // e.g., 'en', 'es', 'fr'
            return true;
          }
        }

        if (obj.parent.type === "ExportNamedDeclaration" || obj.parent.type === "ExportDefaultDeclaration") {
          return true; // Assume exported objects in translation files are translations
        }

        obj = obj.parent;
        objDepth++;
      }
    }

    current = current.parent;
    depth++;
  }

  return false;
}

function isInThemeContext(node: any): boolean {
  // Check if we're in a theme/color configuration context
  let current = node;
  let depth = 0;
  const maxDepth = 10;

  while (current && current.parent && depth < maxDepth) {
    const parent = current.parent;

    // If we're in a Property and it's a value, check if it's theme-related
    if (parent.type === "Property" && parent.value === current) {
      // Check if the property key suggests it's a theme/color value
      if (parent.key && typeof parent.key.value === "string") {
        const key = parent.key.value.toLowerCase();
        if (
          key.includes("color") ||
          key.includes("theme") ||
          key.includes("background") ||
          key.includes("foreground") ||
          key.includes("primary") ||
          key.includes("secondary") ||
          key.includes("accent") ||
          key.includes("surface") ||
          key.includes("border") ||
          key.includes("shadow") ||
          key.includes("gradient") ||
          key.includes("palette")
        ) {
          return true;
        }
      }

      // Check if the parent object or variable name suggests it's a theme
      let obj = parent;
      let objDepth = 0;

      while (obj && obj.parent && objDepth < 5) {
        if (obj.parent.type === "VariableDeclarator" && obj.parent.id?.name) {
          const varName = obj.parent.id.name.toLowerCase();
          if (
            varName.includes("theme") ||
            varName.includes("color") ||
            varName.includes("palette") ||
            varName.includes("style") ||
            varName.includes("design") ||
            varName.includes("brand")
          ) {
            return true;
          }
        }

        if (obj.parent.type === "ExportNamedDeclaration" || obj.parent.type === "ExportDefaultDeclaration") {
          // Check if the export name suggests it's a theme
          if (obj.parent.declaration?.id?.name) {
            const exportName = obj.parent.declaration.id.name.toLowerCase();
            if (exportName.includes("theme") || exportName.includes("color") || exportName.includes("palette")) {
              return true;
            }
          }
        }

        obj = obj.parent;
        objDepth++;
      }
    }

    current = current.parent;
    depth++;
  }

  return false;
}

function isInTechnicalContext(node: any): boolean {
  const parent = node.parent;
  if (!parent) return false;

  // Skip if we're in a translation file (translation values should be hardcoded)
  if (isInTranslationFile(node)) return true;

  // Skip if we're inside a translation object value
  if (isInTranslationObjectValue(node)) return true;

  // Skip if we're in a theme/color configuration context
  if (isInThemeContext(node)) return true;

  // Skip import statements
  if (parent.type === "ImportDeclaration") return true;
  if (parent.type === "ImportSpecifier") return true;
  if (parent.type === "ImportDefaultSpecifier") return true;
  if (parent.type === "ImportNamespaceSpecifier") return true;

  // Skip require statements
  if (parent.type === "CallExpression" && parent.callee?.name === "require") return true;

  // Skip module.exports
  if (
    parent.type === "AssignmentExpression" &&
    parent.left?.type === "MemberExpression" &&
    parent.left.object?.name === "module" &&
    parent.left.property?.name === "exports"
  )
    return true;

  // Skip exports
  if (parent.type === "ExportNamedDeclaration") return true;
  if (parent.type === "ExportDefaultDeclaration") return true;
  if (parent.type === "ExportAllDeclaration") return true;

  // Skip constructor calls
  if (parent.type === "NewExpression") return true;

  // Skip function calls with technical names
  if (parent.type === "CallExpression" && parent.callee) {
    const calleeName = parent.callee.name || parent.callee.property?.name;
    if (calleeName && isTechnicalTerm(calleeName)) return true;
  }

  // Skip object property keys
  if (parent.type === "Property" && parent.key === node) return true;

  // Skip array elements that are technical
  if (parent.type === "ArrayExpression") return true;

  // Skip template literals in technical contexts
  if (parent.type === "TemplateLiteral") return true;

  // Skip string literals in technical contexts
  if (parent.type === "BinaryExpression" && (parent.operator === "+" || parent.operator === "||")) return true;

  // Skip regex patterns
  if (parent.type === "RegExpLiteral") return true;

  // Skip switch cases
  if (parent.type === "SwitchCase") return true;

  // Skip throw statements
  if (parent.type === "ThrowStatement") return true;

  // Skip console statements
  if (
    parent.type === "CallExpression" &&
    parent.callee?.type === "MemberExpression" &&
    parent.callee.object?.name === "console"
  )
    return true;

  // Skip process statements
  if (
    parent.type === "CallExpression" &&
    parent.callee?.type === "MemberExpression" &&
    parent.callee.object?.name === "process"
  )
    return true;

  // Skip window/document statements
  if (
    parent.type === "CallExpression" &&
    parent.callee?.type === "MemberExpression" &&
    (parent.callee.object?.name === "window" || parent.callee.object?.name === "document")
  )
    return true;

  return false;
}

function isUserFacingString(node: any): boolean {
  const parent = node.parent;
  if (!parent) return false;

  // User-facing strings are typically in JSX
  if (parent.type === "JSXElement") return true;
  if (parent.type === "JSXFragment") return true;
  if (parent.type === "JSXExpressionContainer") return true;

  // User-facing strings in return statements
  if (parent.type === "ReturnStatement") return true;

  // User-facing strings in variable declarations that might be displayed
  if (
    parent.type === "VariableDeclarator" &&
    parent.id?.name &&
    /^(title|label|text|message|description|content|heading|caption|placeholder|tooltip|help|error|warning|success|info)$/i.test(
      parent.id.name
    )
  ) {
    return true;
  }

  // User-facing strings in object properties that might be displayed
  if (
    parent.type === "Property" &&
    parent.key?.name &&
    /^(title|label|text|message|description|content|heading|caption|placeholder|tooltip|help|error|warning|success|info)$/i.test(
      parent.key.name
    )
  ) {
    return true;
  }

  // User-facing strings in function parameters that might be displayed
  if (parent.type === "FunctionDeclaration" || parent.type === "ArrowFunctionExpression") {
    return true;
  }

  // User-facing strings in call expressions that might be displayed
  if (
    parent.type === "CallExpression" &&
    parent.callee?.name &&
    /^(alert|confirm|prompt|log|warn|error|info|debug)$/i.test(parent.callee.name)
  ) {
    return true;
  }

  return false;
}

// Export the plugin
export const i18nPlugin = {
  rules: i18nRules,
  configs: {
    recommended: {
      plugins: ["@reynard/i18n"],
      rules: {
        "@reynard/i18n/no-hardcoded-strings": "error",
        "@reynard/i18n/no-untranslated-keys": "warn",
      },
    },
  },
};
