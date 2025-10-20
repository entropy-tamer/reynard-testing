/**
 * @file AST parsing utilities for the Reynard ESLint plugin
 * Provides robust TypeScript/JSX parsing and node traversal utilities
 */

import { parse } from '@typescript-eslint/parser';
import type { TSESTree } from '@typescript-eslint/types';
import type { ASTParserOptions, NodeFinderOptions } from '../types.js';

// ============================================================================
// Core AST Parsing Functions
// ============================================================================

/**
 * Parse code string into AST using TypeScript ESLint parser
 * @param code - Source code to parse
 * @param options - Parser options
 * @returns Parsed AST program
 */
export function parseCode(code: string, options: ASTParserOptions = {}): TSESTree.Program {
  const defaultOptions = {
    sourceType: 'module' as const,
    ecmaVersion: 2022 as any,
    jsx: true,
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
      impliedStrict: true,
    },
    ...options,
  };

  try {
    return parse(code, defaultOptions);
  } catch (error) {
    throw new Error(`Failed to parse code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Find nodes of a specific type in the AST
 * @param ast - AST node to search in
 * @param type - Node type to find
 * @param includeChildren - Whether to search in child nodes
 * @returns Array of matching nodes
 */
export function findNodes(ast: TSESTree.Node, type: string, includeChildren = true): TSESTree.Node[] {
  const nodes: TSESTree.Node[] = [];

  function traverse(node: TSESTree.Node) {
    if (node.type === type) {
      nodes.push(node);
    }

    if (includeChildren) {
      for (const key in node) {
        const value = (node as any)[key];
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item && typeof item === 'object' && item.type) {
              traverse(item);
            }
          });
        } else if (value && typeof value === 'object' && value.type) {
          traverse(value);
        }
      }
    }
  }

  traverse(ast);
  return nodes;
}

/**
 * Find nodes with advanced filtering options
 * @param ast - AST node to search in
 * @param options - Search options
 * @returns Array of matching nodes
 */
export function findNodesWithOptions(ast: TSESTree.Node, options: NodeFinderOptions): TSESTree.Node[] {
  const nodes: TSESTree.Node[] = [];

  function traverse(node: TSESTree.Node) {
    if (node.type === options.type) {
      if (!options.filter || options.filter(node)) {
        nodes.push(node);
      }
    }

    if (options.includeChildren !== false) {
      for (const key in node) {
        const value = (node as any)[key];
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item && typeof item === 'object' && item.type) {
              traverse(item);
            }
          });
        } else if (value && typeof value === 'object' && value.type) {
          traverse(value);
        }
      }
    }
  }

  traverse(ast);
  return nodes;
}

/**
 * Get the text content of a node from source code
 * @param node - AST node
 * @param sourceCode - Original source code
 * @returns Text content of the node
 */
export function getNodeText(node: TSESTree.Node, sourceCode: string): string {
  if (!node.range) {
    return '';
  }

  const [start, end] = node.range;
  return sourceCode.slice(start, end);
}

/**
 * Get the line and column information for a node
 * @param node - AST node
 * @param sourceCode - Original source code
 * @returns Location information
 */
export function getNodeLocation(node: TSESTree.Node, _sourceCode: string): { line: number; column: number } {
  if (!node.loc) {
    return { line: 1, column: 0 };
  }

  return {
    line: node.loc.start.line,
    column: node.loc.start.column,
  };
}

// ============================================================================
// SolidJS Specific AST Utilities
// ============================================================================

/**
 * Check if a node is a SolidJS component
 * @param node - AST node to check
 * @returns True if the node is a SolidJS component
 */
export function isSolidJSComponent(node: TSESTree.Node): boolean {
  if (node.type !== 'JSXElement') {
    return false;
  }

  const jsxElement = node as TSESTree.JSXElement;
  const openingElement = jsxElement.openingElement;
  
  // Check for SolidJS component patterns
  if (openingElement.name.type === 'JSXIdentifier') {
    const name = openingElement.name.name;
    // SolidJS components typically start with uppercase
    return /^[A-Z]/.test(name);
  }

  return false;
}

/**
 * Check if a node is a SolidJS signal
 * @param node - AST node to check
 * @returns True if the node is a SolidJS signal
 */
export function isSolidJSSignal(node: TSESTree.Node): boolean {
  if (node.type !== 'CallExpression') {
    return false;
  }

  const callExpression = node as TSESTree.CallExpression;
  
  if (callExpression.callee.type === 'Identifier') {
    const name = callExpression.callee.name;
    return ['createSignal', 'createMemo', 'createEffect', 'createResource'].includes(name);
  }

  return false;
}

/**
 * Extract component props from a JSX element
 * @param node - JSX element node
 * @returns Array of prop names
 */
export function extractJSXProps(node: TSESTree.JSXElement): string[] {
  const props: string[] = [];

  for (const attribute of node.openingElement.attributes) {
    if (attribute.type === 'JSXAttribute' && attribute.name.type === 'JSXIdentifier') {
      props.push(attribute.name.name);
    }
  }

  return props;
}

// ============================================================================
// String and Text Utilities
// ============================================================================

/**
 * Check if a string is a hardcoded string that should be internationalized
 * @param text - Text to check
 * @param minLength - Minimum length to consider
 * @param ignorePatterns - Patterns to ignore
 * @returns True if the string should be internationalized
 */
export function isHardcodedString(text: string, minLength = 3, ignorePatterns: string[] = []): boolean {
  if (text.length < minLength) {
    return false;
  }

  // Check against ignore patterns
  for (const pattern of ignorePatterns) {
    if (new RegExp(pattern).test(text)) {
      return false;
    }
  }

  // Check for technical terms that shouldn't be translated
  const technicalTerms = [
    /^[A-Z_]+$/, // UPPERCASE constants
    /^\d+$/, // Numbers only
    /^[a-z]+\.(js|ts|tsx|jsx|css|scss|html|json)$/, // File extensions
    /^https?:\/\//, // URLs
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email addresses
    /^#[0-9a-fA-F]{3,6}$/, // Hex colors
    /^\d+px$/, // CSS units
    /^[a-z-]+$/, // CSS class names
    /^[A-Z][a-zA-Z0-9]*$/, // PascalCase (likely component names)
  ];

  for (const pattern of technicalTerms) {
    if (pattern.test(text)) {
      return false;
    }
  }

  return true;
}

/**
 * Extract translation key from a function call
 * @param node - Call expression node
 * @returns Translation key if found, null otherwise
 */
export function extractTranslationKey(node: TSESTree.CallExpression): string | null {
  if (node.callee.type === 'Identifier' && node.callee.name === 't') {
    if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
      const arg = node.arguments[0] as TSESTree.Literal;
      if (typeof arg.value === 'string') {
        return arg.value;
      }
    }
  }

  if (node.callee.type === 'MemberExpression' && 
      node.callee.property.type === 'Identifier' && 
      node.callee.property.name === 't') {
    if (node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
      const arg = node.arguments[0] as TSESTree.Literal;
      if (typeof arg.value === 'string') {
        return arg.value;
      }
    }
  }

  return null;
}

// ============================================================================
// Accessibility Utilities
// ============================================================================

/**
 * Check if a JSX element has an alt attribute
 * @param node - JSX element node
 * @returns True if the element has an alt attribute
 */
export function hasAltAttribute(node: TSESTree.JSXElement): boolean {
  for (const attribute of node.openingElement.attributes) {
    if (attribute.type === 'JSXAttribute' && 
        attribute.name.type === 'JSXIdentifier' && 
        attribute.name.name === 'alt') {
      return true;
    }
  }
  return false;
}

/**
 * Get the value of an alt attribute
 * @param node - JSX element node
 * @returns Alt attribute value or null
 */
export function getAltAttributeValue(node: TSESTree.JSXElement): string | null {
  for (const attribute of node.openingElement.attributes) {
    if (attribute.type === 'JSXAttribute' && 
        attribute.name.type === 'JSXIdentifier' && 
        attribute.name.name === 'alt') {
      if (attribute.value && attribute.value.type === 'Literal') {
        return attribute.value.value as string;
      }
    }
  }
  return null;
}

/**
 * Check if a JSX element has ARIA attributes
 * @param node - JSX element node
 * @returns Array of ARIA attribute names
 */
export function getAriaAttributes(node: TSESTree.JSXElement): string[] {
  const ariaAttributes: string[] = [];

  for (const attribute of node.openingElement.attributes) {
    if (attribute.type === 'JSXAttribute' && 
        attribute.name.type === 'JSXIdentifier' && 
        attribute.name.name.startsWith('aria-')) {
      ariaAttributes.push(attribute.name.name);
    }
  }

  return ariaAttributes;
}

// ============================================================================
// Performance Utilities
// ============================================================================

/**
 * Check if a function call is a SolidJS memoization function
 * @param node - Call expression node
 * @returns True if the call is a memoization function
 */
export function isMemoizationCall(node: TSESTree.CallExpression): boolean {
  if (node.callee.type === 'Identifier') {
    const name = node.callee.name;
    return ['createMemo', 'createEffect', 'createResource'].includes(name);
  }
  return false;
}

/**
 * Check if a JSX element might cause unnecessary re-renders
 * @param node - JSX element node
 * @returns True if the element might cause re-renders
 */
export function mightCauseRerenders(node: TSESTree.JSXElement): boolean {
  // Check for inline functions in props
  for (const attribute of node.openingElement.attributes) {
    if (attribute.type === 'JSXAttribute' && attribute.value) {
      if (attribute.value.type === 'JSXExpressionContainer') {
        const expression = attribute.value.expression;
        if (expression.type === 'ArrowFunctionExpression' || 
            expression.type === 'FunctionExpression') {
          return true;
        }
      }
    }
  }
  return false;
}

// All exports are already done above with individual export statements
