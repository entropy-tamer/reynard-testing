/**
 * @file Shared types and interfaces for the Reynard ESLint plugin
 * Provides type definitions for rules, configurations, and utilities
 */

import type { Rule } from "eslint";
import type { TSESTree } from "@typescript-eslint/types";

// ============================================================================
// Core Plugin Types
// ============================================================================

export interface PluginMeta {
  name: string;
  version: string;
  description?: string;
}

export interface PluginConfig {
  plugins: string[];
  rules: Record<string, string | [string, ...any[]]>;
  extends?: string[];
}

// ============================================================================
// AST Parser Types
// ============================================================================

export interface ASTParserOptions {
  sourceType?: "module" | "script";
  ecmaVersion?: number;
  jsx?: boolean;
  ecmaFeatures?: {
    jsx?: boolean;
    globalReturn?: boolean;
    impliedStrict?: boolean;
  };
}

export interface NodeFinderOptions {
  type: string;
  includeChildren?: boolean;
  filter?: (node: TSESTree.Node) => boolean;
}

// ============================================================================
// Translation File Types
// ============================================================================

export interface TranslationFile {
  path: string;
  content: Record<string, any>;
  locale: string;
  namespace?: string;
  lastModified: number;
}

export interface TranslationKey {
  key: string;
  value: string;
  namespace?: string;
  locale: string;
}

export interface TranslationValidationResult {
  isValid: boolean;
  missingKeys: string[];
  invalidKeys: string[];
  suggestions: string[];
}

// ============================================================================
// Cache Types
// ============================================================================

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  cleanupInterval?: number;
}

// ============================================================================
// Rule Configuration Types
// ============================================================================

export interface I18nRuleOptions {
  enabled?: boolean;
  strictMode?: boolean;
  translationFiles?: string[];
  ignorePatterns?: string[];
  minLength?: number;
  autoFix?: boolean;
}

export interface AccessibilityRuleOptions {
  enabled?: boolean;
  strictMode?: boolean;
  ignorePatterns?: string[];
  requireAlt?: boolean;
  validateAria?: boolean;
  checkKeyboard?: boolean;
}

export interface PerformanceRuleOptions {
  enabled?: boolean;
  strictMode?: boolean;
  ignorePatterns?: string[];
  checkMemoization?: boolean;
  checkRerenders?: boolean;
  suggestOptimizations?: boolean;
}

// ============================================================================
// Rule Context Extensions
// ============================================================================

export interface ExtendedRuleContext extends Rule.RuleContext {
  parserServices?: {
    program?: any;
    esTreeNodeToTSNodeMap?: Map<TSESTree.Node, any>;
    tsNodeToESTreeNodeMap?: Map<any, TSESTree.Node>;
  };
}

// ============================================================================
// Error and Fix Types
// ============================================================================

export interface RuleError {
  node: TSESTree.Node;
  message: string;
  messageId?: string;
  data?: Record<string, any>;
  fix?: Rule.Fix;
  suggest?: any[];
}

export interface FixSuggestion {
  desc: string;
  fix: Rule.Fix;
}

// ============================================================================
// Plugin Export Types
// ============================================================================

export interface PluginExport {
  meta: PluginMeta;
  rules: Record<string, Rule.RuleModule>;
  configs: Record<string, PluginConfig>;
}

// ============================================================================
// Utility Types
// ============================================================================

export type FilePattern = string | RegExp;
export type LocaleCode = string;
export type Namespace = string;

export interface FileMatchResult {
  matched: boolean;
  groups?: Record<string, string>;
  path: string;
}

// ============================================================================
// SolidJS Specific Types
// ============================================================================

export interface SolidJSNode {
  type: "JSXElement" | "JSXFragment" | "CallExpression";
  solidType?: "component" | "signal" | "effect" | "memo" | "resource";
}

export interface ComponentInfo {
  name: string;
  props: string[];
  signals: string[];
  effects: string[];
  memos: string[];
  isOptimized: boolean;
}

// ============================================================================
// Accessibility Types
// ============================================================================

export interface AriaAttribute {
  name: string;
  value: string;
  required: boolean;
  validValues?: string[];
}

export interface AccessibilityIssue {
  type: "missing-alt" | "invalid-aria" | "keyboard-navigation" | "focus-management";
  severity: "error" | "warning" | "info";
  message: string;
  node: TSESTree.Node;
  fix?: Rule.Fix;
  suggestions?: any[];
}

// ============================================================================
// Performance Types
// ============================================================================

export interface PerformanceIssue {
  type: "unnecessary-rerender" | "missing-memo" | "expensive-computation" | "unstable-deps";
  severity: "error" | "warning" | "info";
  message: string;
  node: TSESTree.Node;
  fix?: Rule.Fix;
  suggestions?: any[];
  impact: "low" | "medium" | "high";
}

// ============================================================================
// Export all types
// ============================================================================

export type { Rule, TSESTree };
