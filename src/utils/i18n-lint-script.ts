#!/usr/bin/env node

/**
 * Project-wide i18n Linting Script
 * Scans all Reynard packages for i18n issues
 */

import { runI18nTests, generateI18nReport, type I18nTestConfig } from "./i18n-testing.js";

// Configuration
const DEFAULT_CONFIG: I18nTestConfig = {
  packages: ["packages/*"],
  locales: ["en", "es", "fr", "de", "ru", "ar"],
  checkHardcodedStrings: true,
  validateCompleteness: true,
  testPluralization: true,
  testRTL: true,
  ignorePatterns: [
    "^[a-z]+[A-Z][a-z]*$", // camelCase
    "^[A-Z_]+$", // CONSTANTS
    "^[0-9]+$", // numbers
    "^[a-z]{1,2}$", // short strings
    "^(id|class|type|name|value|key|index|count|size|width|height|color|url|path|file|dir|src|alt|title|role|aria|data|test|spec|mock|stub|fixture)$", // technical terms
  ],
};

// File extensions to check
// const CHECKED_EXTENSIONS = [".tsx", ".jsx", ".ts", ".js"];

// Directories to ignore
// const IGNORE_DIRS = ["node_modules", ".git", "dist", "build", "coverage", "__tests__", "test"];

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);

  console.log("🦊 Starting i18n linting across Reynard packages...\n");

  try {
    const result = await runI18nTests(config);
    const report = generateI18nReport(result);

    console.log(report);

    // Exit with error code if issues found
    const hasErrors =
      result.hardcodedStrings.length > 0 ||
      result.translationValidation.some(v => v.missingKeys.length > 0) ||
      result.rtlIssues.length > 0;

    if (hasErrors) {
      console.log("\n❌ i18n issues found. Please fix them before committing.");
      process.exit(1);
    } else {
      console.log("\n✅ No i18n issues found!");
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error running i18n tests:", error);
    process.exit(1);
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): I18nTestConfig {
  const config = { ...DEFAULT_CONFIG };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--packages":
        config.packages = args[++i].split(",");
        break;
      case "--locales":
        config.locales = args[++i].split(",");
        break;
      case "--no-hardcoded-strings":
        config.checkHardcodedStrings = false;
        break;
      case "--no-completeness":
        config.validateCompleteness = false;
        break;
      case "--no-pluralization":
        config.testPluralization = false;
        break;
      case "--no-rtl":
        config.testRTL = false;
        break;
      case "--ignore-patterns":
        config.ignorePatterns = args[++i].split(",");
        break;
      case "--help":
        printHelp();
        process.exit(0);
        break;
    }
  }

  return config;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
Usage: i18n-lint [options]

Options:
  --packages <packages>     Comma-separated list of packages to check (default: packages/*)
  --locales <locales>       Comma-separated list of locales to validate (default: en,es,fr,de,ru,ar)
  --no-hardcoded-strings    Skip hardcoded string detection
  --no-completeness         Skip translation completeness validation
  --no-pluralization        Skip pluralization testing
  --no-rtl                  Skip RTL support testing
  --ignore-patterns <patterns> Comma-separated list of regex patterns to ignore
  --help                    Show this help message

Examples:
  i18n-lint                                    # Run with default settings
  i18n-lint --packages packages/core/i18n,packages/ui  # Check specific packages
  i18n-lint --locales en,es                    # Check specific locales
  i18n-lint --no-hardcoded-strings             # Skip hardcoded string detection
`);
}

/**
 * Find all files to check
 */
// function _findFilesToCheck(packages: string[]): string[] {
//   const files: string[] = [];
//
//   for (const packagePattern of packages) {
//     const packagePath = packagePattern.replace("*", "");
//     if (statSync(packagePath).isDirectory()) {
//       files.push(...findFilesInDirectory(packagePath));
//     }
//   }
//
//   return files;
// }

/**
 * Recursively find files in directory
 */
// function findFilesInDirectory(dir: string): string[] {
//   const files: string[] = [];
//
//   try {
//     const entries = readdirSync(dir);
//
//     for (const entry of entries) {
//       const fullPath = join(dir, entry);
//       const stat = statSync(fullPath);
//
//       if (stat.isDirectory()) {
//         if (!IGNORE_DIRS.includes(entry)) {
//           files.push(...findFilesInDirectory(fullPath));
//         }
//       } else if (stat.isFile()) {
//         const ext = extname(fullPath);
//         if (CHECKED_EXTENSIONS.includes(ext)) {
//           files.push(fullPath);
//         }
//       }
//     }
//   } catch (error) {
//     console.warn(`Warning: Could not read directory ${dir}:`, error);
//   }
//
//   return files;
// }

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
