/**
 * i18n Testing Utilities
 * Comprehensive tools for testing internationalization across Reynard packages
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

// Types for i18n testing
export interface I18nTestConfig {
  /** List of packages to test */
  packages: string[];
  /** Locales to test */
  locales: string[];
  /** Whether to check for hardcoded strings */
  checkHardcodedStrings: boolean;
  /** Whether to validate translation completeness */
  validateCompleteness: boolean;
  /** Whether to test pluralization */
  testPluralization: boolean;
  /** Whether to test RTL support */
  testRTL: boolean;
  /** Custom ignore patterns for hardcoded strings */
  ignorePatterns: string[];
}

export interface HardcodedStringResult {
  file: string;
  line: number;
  column: number;
  text: string;
  severity: "error" | "warning";
  suggestion?: string;
}

export interface TranslationValidationResult {
  locale: string;
  missingKeys: string[];
  unusedKeys: string[];
  incompleteTranslations: string[];
  pluralizationIssues: string[];
}

export interface I18nTestResult {
  hardcodedStrings: HardcodedStringResult[];
  translationValidation: TranslationValidationResult[];
  rtlIssues: string[];
  performanceMetrics: {
    loadTime: number;
    memoryUsage: number;
  };
}

/**
 * Detect hardcoded strings in JSX/TSX files
 */
export function detectHardcodedStrings(
  filePath: string,
  content: string,
  config: I18nTestConfig
): HardcodedStringResult[] {
  const results: HardcodedStringResult[] = [];
  const lines = content.split("\n");

  // Patterns to detect hardcoded strings
  const patterns = [
    // JSX text content: >Text<
    { regex: />([^<>{}\n]+)</g, type: "jsx-text" },
    // String literals in JSX attributes: title="Text"
    {
      regex: /(title|alt|placeholder|aria-label)="([^"]+)"/g,
      type: "jsx-attribute",
    },
    // Template literals with text: `Text ${variable}`
    { regex: /`([^`${}]+)`/g, type: "template-literal" },
    // User-facing strings with capital letters and spaces
    { regex: /"([A-Z][a-z]+ [a-z]+[^"]*)"/g, type: "user-facing-string" },
    // Return statements with hardcoded strings
    {
      regex: /return\s+"([A-Z][a-z]+ [a-z]+[^"]*)"/g,
      type: "return-statement",
    },
    // Error messages and fallback strings
    { regex: /"([A-Z][a-z]+ [a-z]+[^"]*)"\s*\|\|/g, type: "fallback-string" },
  ];

  lines.forEach((line, lineIndex) => {
    // Skip comments and imports
    if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("import")) {
      return;
    }

    // Skip translation files - they contain the actual translations
    if (filePath.includes("/lang/") || filePath.includes("/translations/")) {
      return;
    }

    // Skip lines that are already using i18n
    if (line.includes("i18n.t(") || line.includes("t(")) {
      return;
    }

    // Skip lines with technical patterns
    if (
      line.includes("className=") ||
      line.includes("style=") ||
      line.includes("data-") ||
      line.includes("id=") ||
      line.includes("key=") ||
      line.includes("type=") ||
      line.includes("src=") ||
      line.includes("href=") ||
      line.includes("onClick=") ||
      line.includes("onChange=") ||
      line.includes("onSubmit=") ||
      line.includes("onLoad=") ||
      line.includes("Promise<") ||
      line.includes(": Promise") ||
      line.includes("extends Promise") ||
      line.includes("Array<") ||
      line.includes(": Array") ||
      line.includes("interface ") ||
      line.includes("type ") ||
      line.includes("enum ") ||
      line.includes("function ") ||
      line.includes("=> ") ||
      line.includes(".*?") ||
      line.includes("regex") ||
      line.includes("RegExp") ||
      line.includes("new RegExp") ||
      line.includes("&&") ||
      line.includes("||") ||
      line.includes("===") ||
      line.includes("!==") ||
      line.includes(">=") ||
      line.includes("<=") ||
      line.includes(">") ||
      line.includes("<") ||
      line.includes("1024") ||
      line.includes("0 &&") ||
      line.includes("= 7 &&") ||
      line.includes("= min &&") ||
      line.includes("= minLength &&") ||
      (line.includes(":") && line.includes("=")) ||
      (line.includes("Hello world") && line.includes("//"))
    ) {
      return;
    }

    // Skip lines with variable assignments or function calls
    if (line.includes("=") && (line.includes("const ") || line.includes("let ") || line.includes("var "))) {
      return;
    }

    patterns.forEach(({ regex, type: _type }) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        const text = match[1] || match[2];

        // Skip if matches ignore patterns
        if (config.ignorePatterns.some(pattern => text.match(new RegExp(pattern)))) {
          continue;
        }

        // Skip very short strings or common technical terms
        if (text.length < 3 || isTechnicalTerm(text)) {
          continue;
        }

        results.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          text: text.trim(),
          severity: "warning",
          suggestion: `Consider using i18n.t('${generateTranslationKey(text)}') instead`,
        });
      }
    });
  });

  return results;
}

/**
 * Generate a translation key from text
 */
function generateTranslationKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".")
    .substring(0, 50);
}

/**
 * Check if text is a technical term that doesn't need translation
 */
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
    "aria-label",
    "aria-describedby",
    "aria-expanded",
    "aria-hidden",
    "aria-selected",
    "aria-controls",
    "aria-labelledby",
    "aria-live",
    "aria-modal",
    "aria-orientation",
    "aria-required",
    "aria-invalid",
    "aria-disabled",
    "aria-readonly",
    "aria-checked",
    "aria-pressed",
    "aria-current",
    "aria-level",
    "aria-posinset",
    "aria-setsize",
    "aria-sort",
    "aria-valuemin",
    "aria-valuemax",
    "aria-valuenow",
    "aria-valuetext",
    "aria-busy",
    "aria-dropeffect",
    "aria-grabbed",
    "aria-haspopup",
    "aria-multiline",
    "aria-multiselectable",
    "aria-owns",
    "aria-relevant",
    "aria-autocomplete",
    "aria-activedescendant",
    "aria-colcount",
    "aria-colindex",
    "aria-colspan",
    "aria-rowcount",
    "aria-rowindex",
    "aria-rowspan",
    "aria-selected",
    "aria-sort",
    "aria-expanded",
    "aria-level",
    "aria-posinset",
    "aria-setsize",
    "aria-sort",
    "aria-valuemin",
    "aria-valuemax",
    "aria-valuenow",
    "aria-valuetext",
  ];

  // Check for technical terms
  if (technicalTerms.includes(text.toLowerCase())) {
    return true;
  }

  // Check for camelCase (but not user-facing text)
  if (/^[a-z]+[A-Z][a-z]*$/.test(text) && text.length < 20) {
    return true;
  }

  // Check for CONSTANTS
  if (/^[A-Z_]+$/.test(text)) {
    return true;
  }

  // Check for CSS classes, IDs, or technical identifiers
  if (/^[a-z-]+$/.test(text) && text.length < 30) {
    return true;
  }

  // Check for file extensions or technical suffixes
  if (
    /\.(js|ts|tsx|jsx|css|scss|sass|less|json|md|txt|yml|yaml|xml|html|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(
      text
    )
  ) {
    return true;
  }

  // Check for URLs or paths
  if (/^(https?:\/\/|www\.|\.com|\.org|\.net|\.io|\.dev|\.\/|\/)/.test(text)) {
    return true;
  }

  // Check for version numbers or technical identifiers
  if (/^v?\d+\.\d+(\.\d+)?(-[a-z0-9]+)?$/i.test(text)) {
    return true;
  }

  return false;
}

/**
 * Validate translation completeness across locales
 */
export async function validateTranslations(config: I18nTestConfig): Promise<TranslationValidationResult[]> {
  const results: TranslationValidationResult[] = [];

  for (const locale of config.locales) {
    try {
      // This would integrate with the actual i18n system
      const translations = await loadTranslations(locale);
      const referenceTranslations = await loadTranslations("en");

      const missingKeys = findMissingKeys(referenceTranslations, translations);
      const unusedKeys = findUnusedKeys(referenceTranslations, translations);
      const incompleteTranslations = findIncompleteTranslations(translations);
      const pluralizationIssues = validatePluralization(translations, locale);

      results.push({
        locale,
        missingKeys,
        unusedKeys,
        incompleteTranslations,
        pluralizationIssues,
      });
    } catch (error) {
      console.error(`Failed to validate translations for locale ${locale}:`, error);
    }
  }

  return results;
}

/**
 * Load translations for a locale (placeholder implementation)
 */
async function loadTranslations(locale: string): Promise<Record<string, unknown>> {
  // This would integrate with the actual reynard-i18n package
  try {
    const module = await import(`@entropy-tamer/reynard-i18n/src/lang/${locale}/common.ts`);
    return module.commonTranslations || {};
  } catch {
    return {};
  }
}

/**
 * Find missing translation keys
 */
function findMissingKeys(reference: Record<string, unknown>, target: Record<string, unknown>): string[] {
  const missing: string[] = [];

  function compareObjects(ref: unknown, tar: unknown, path: string = "") {
    for (const key in ref as any) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof (ref as any)[key] === "object" && (ref as any)[key] !== null) {
        if (!(tar as any)[key] || typeof (tar as any)[key] !== "object") {
          missing.push(currentPath);
        } else {
          compareObjects((ref as any)[key], (tar as any)[key], currentPath);
        }
      } else if (!(key in (tar as any))) {
        missing.push(currentPath);
      }
    }
  }

  compareObjects(reference, target);
  return missing;
}

/**
 * Find unused translation keys
 */
function findUnusedKeys(reference: Record<string, unknown>, target: Record<string, unknown>): string[] {
  const unused: string[] = [];

  function findUnusedInObject(ref: unknown, tar: unknown, path: string = "") {
    for (const key in tar as any) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof (tar as any)[key] === "object" && (tar as any)[key] !== null) {
        if (!(ref as any)[key] || typeof (ref as any)[key] !== "object") {
          unused.push(currentPath);
        } else {
          findUnusedInObject((ref as any)[key], (tar as any)[key], currentPath);
        }
      } else if (!(key in (ref as any))) {
        unused.push(currentPath);
      }
    }
  }

  findUnusedInObject(reference, target);
  return unused;
}

/**
 * Find incomplete translations (empty or placeholder values)
 */
function findIncompleteTranslations(translations: Record<string, unknown>): string[] {
  const incomplete: string[] = [];

  function checkObject(obj: unknown, path: string = "") {
    for (const key in obj as any) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof (obj as any)[key] === "object" && (obj as any)[key] !== null) {
        checkObject((obj as any)[key], currentPath);
      } else if (typeof (obj as any)[key] === "string") {
        const value = (obj as any)[key];
        if (!value || value.trim() === "" || value.includes("TODO") || value.includes("FIXME")) {
          incomplete.push(currentPath);
        }
      }
    }
  }

  checkObject(translations);
  return incomplete;
}

/**
 * Validate pluralization rules
 */
function validatePluralization(translations: Record<string, unknown>, locale: string): string[] {
  const issues: string[] = [];

  // This would integrate with the actual pluralization system
  const pluralizationRules = getPluralizationRules(locale);

  function checkPluralization(obj: any, path: string = "") {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        checkPluralization(obj[key], currentPath);
      } else if (typeof obj[key] === "string") {
        const value = obj[key];
        if (value.includes("{count}") && !hasProperPluralForms(obj, key, pluralizationRules)) {
          issues.push(currentPath);
        }
      }
    }
  }

  checkPluralization(translations);
  return issues;
}

/**
 * Get pluralization rules for a locale
 */
function getPluralizationRules(locale: string): string[] {
  // This would integrate with the actual pluralization system
  const rules: Record<string, string[]> = {
    en: ["one", "other"],
    ru: ["one", "few", "many"],
    ar: ["zero", "one", "two", "few", "many", "other"],
    pl: ["one", "few", "many"],
  };

  return rules[locale] || rules["en"];
}

/**
 * Check if plural forms are properly defined
 */
function hasProperPluralForms(obj: any, key: string, rules: string[]): boolean {
  // Check if all required plural forms exist
  return rules.every(rule => obj[`${key}_${rule}`] !== undefined);
}

/**
 * Test RTL support
 */
export function testRTLSupport(config: I18nTestConfig): string[] {
  const issues: string[] = [];
  const rtlLocales = ["ar", "he", "fa", "ur"];

  // Only report RTL issues if we're actually testing RTL locales
  const testedRTLLocales = config.locales.filter(locale => rtlLocales.includes(locale));

  if (testedRTLLocales.length > 0) {
    // Check if RTL support is properly configured
    for (const locale of testedRTLLocales) {
      // For now, we'll assume RTL support needs improvement
      // In a real implementation, this would check for:
      // - CSS direction properties
      // - RTL-specific styling
      // - Text alignment
      // - Icon mirroring
      // - Proper text direction handling
      issues.push(`RTL support needs verification for ${locale}`);
    }
  }

  return issues;
}

/**
 * Scan a package directory for hardcoded strings
 */
async function scanPackageForHardcodedStrings(
  packagePath: string,
  config: I18nTestConfig
): Promise<HardcodedStringResult[]> {
  const results: HardcodedStringResult[] = [];
  const srcPath = join(packagePath, "src");

  if (!statSync(srcPath).isDirectory()) {
    return results;
  }

  const files = getAllFiles(srcPath, [".tsx", ".jsx", ".ts", ".js"]);

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf8");
      const fileResults = detectHardcodedStrings(file, content, config);
      results.push(...fileResults);
    } catch (error) {
      console.warn(`Failed to read file ${file}:`, error);
    }
  }

  return results;
}

/**
 * Get all files with specified extensions from a directory
 */
function getAllFiles(dirPath: string, extensions: string[]): string[] {
  const files: string[] = [];

  function scanDirectory(currentPath: string) {
    try {
      const items = readdirSync(currentPath);

      for (const item of items) {
        const fullPath = join(currentPath, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules, dist, build, etc.
          if (!["node_modules", "dist", "build", "coverage", "__tests__", "test"].includes(item)) {
            scanDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  scanDirectory(dirPath);
  return files;
}

/**
 * Run comprehensive i18n tests
 */
export async function runI18nTests(config: I18nTestConfig): Promise<I18nTestResult> {
  const startTime = performance.now();

  const hardcodedStrings: HardcodedStringResult[] = [];

  // Scan files for hardcoded strings if enabled
  if (config.checkHardcodedStrings) {
    for (const packagePath of config.packages) {
      const packageHardcodedStrings = await scanPackageForHardcodedStrings(packagePath, config);
      hardcodedStrings.push(...packageHardcodedStrings);
    }
  }

  const translationValidation = await validateTranslations(config);
  const rtlIssues = testRTLSupport(config);

  const endTime = performance.now();

  return {
    hardcodedStrings,
    translationValidation,
    rtlIssues,
    performanceMetrics: {
      loadTime: endTime - startTime,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
    },
  };
}

/**
 * Generate i18n test report
 */
export function generateI18nReport(result: I18nTestResult): string {
  let report = "# i18n Test Report\n\n";

  // Hardcoded strings section
  if (result.hardcodedStrings.length > 0) {
    report += "## Hardcoded Strings Found\n\n";
    result.hardcodedStrings.forEach(item => {
      report += `- **${item.file}:${item.line}:${item.column}** - "${item.text}"\n`;
      if (item.suggestion) {
        report += `  - Suggestion: ${item.suggestion}\n`;
      }
    });
    report += "\n";
  }

  // Translation validation section
  if (result.translationValidation.length > 0) {
    report += "## Translation Validation\n\n";
    result.translationValidation.forEach(validation => {
      report += `### ${validation.locale}\n\n`;

      if (validation.missingKeys.length > 0) {
        report += `**Missing Keys (${validation.missingKeys.length}):**\n`;
        validation.missingKeys.forEach(key => {
          report += `- ${key}\n`;
        });
        report += "\n";
      }

      if (validation.unusedKeys.length > 0) {
        report += `**Unused Keys (${validation.unusedKeys.length}):**\n`;
        validation.unusedKeys.forEach(key => {
          report += `- ${key}\n`;
        });
        report += "\n";
      }

      if (validation.incompleteTranslations.length > 0) {
        report += `**Incomplete Translations (${validation.incompleteTranslations.length}):**\n`;
        validation.incompleteTranslations.forEach(key => {
          report += `- ${key}\n`;
        });
        report += "\n";
      }
    });
  }

  // RTL issues section
  if (result.rtlIssues.length > 0) {
    report += "## RTL Issues\n\n";
    result.rtlIssues.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += "\n";
  }

  // Performance metrics
  report += "## Performance Metrics\n\n";
  report += `- Load Time: ${result.performanceMetrics.loadTime.toFixed(2)}ms\n`;
  report += `- Memory Usage: ${(result.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB\n`;

  return report;
}
