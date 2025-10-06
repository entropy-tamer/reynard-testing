/**
 * Core i18n Package Testing Orchestrator
 * Main coordination logic for i18n testing across all Reynard packages
 */

import { existsSync } from "fs";
import { runI18nTests, type I18nTestConfig } from "./i18n-testing";
import { defaultI18nTestingConfig, getEnabledPackages, type PackageI18nConfig } from "../config/i18n-testing-config";
import type { PackageI18nTestResult, GlobalI18nTestResult } from "./i18n-orchestrator-types";
import { generateSummary, generateGlobalReport } from "./i18n-orchestrator-summary";

/**
 * Run i18n tests for all enabled packages
 */
export async function runAllPackageI18nTests(): Promise<GlobalI18nTestResult> {
  const startTime = Date.now();
  const enabledPackages = await getEnabledPackages();
  const packageResults: PackageI18nTestResult[] = [];

  console.log(`🦊 Starting i18n tests for ${enabledPackages.length} packages...\n`);

  for (const pkg of enabledPackages) {
    console.log(`📦 Testing package: ${pkg.name}`);

    try {
      const result = await runPackageI18nTests(pkg);
      packageResults.push(result);

      if (result.success) {
        console.log(`✅ ${pkg.name}: PASSED`);
      } else {
        console.log(`❌ ${pkg.name}: FAILED`);
        result.errors.forEach(error => console.log(`   Error: ${error}`));
        result.warnings.forEach(warning => console.log(`   Warning: ${warning}`));
      }
    } catch (error) {
      const errorResult: PackageI18nTestResult = {
        packageName: pkg.name,
        packagePath: pkg.path,
        success: false,
        results: {
          hardcodedStrings: [],
          translationValidation: [],
          rtlIssues: [],
          performanceMetrics: { loadTime: 0, memoryUsage: 0 },
        },
        errors: [`Failed to run tests: ${error instanceof Error ? error.message : String(error)}`],
        warnings: [],
      };
      packageResults.push(errorResult);
      console.log(`💥 ${pkg.name}: ERROR - ${error instanceof Error ? error.message : String(error)}`);
    }

    console.log(""); // Empty line for readability
  }

  const duration = Date.now() - startTime;
  const summary = generateSummary(packageResults);
  const overallSuccess = summary.failedPackages === 0;
  const report = generateGlobalReport(packageResults, summary, duration);

  console.log(`\n🎯 i18n Testing Complete!`);
  console.log(`   Duration: ${duration}ms`);
  console.log(`   Packages: ${summary.successfulPackages}/${summary.totalPackages} passed`);
  console.log(`   Hardcoded strings: ${summary.totalHardcodedStrings}`);
  console.log(`   Missing translations: ${summary.totalMissingTranslations}`);
  console.log(`   RTL issues: ${summary.totalRTLIssues}`);
  console.log(`   Overall: ${overallSuccess ? "✅ SUCCESS" : "❌ FAILED"}\n`);

  return {
    overallSuccess,
    packageResults,
    summary,
    duration,
    report,
  };
}

/**
 * Run i18n tests for a specific package
 */
export async function runPackageI18nTests(pkg: PackageI18nConfig): Promise<PackageI18nTestResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if package directory exists
  if (!existsSync(pkg.path)) {
    errors.push(`Package directory not found: ${pkg.path}`);
    return createErrorResult(pkg, errors, warnings);
  }

  // Create test configuration for this package
  const testConfig: I18nTestConfig = {
    packages: [pkg.path],
    locales: defaultI18nTestingConfig.locales,
    checkHardcodedStrings: pkg.failOnHardcodedStrings,
    validateCompleteness: pkg.validateCompleteness,
    testPluralization: true,
    testRTL: pkg.testRTL,
    ignorePatterns: [...defaultI18nTestingConfig.defaultIgnorePatterns, ...pkg.ignorePatterns],
  };

  // Run the tests
  const results = await runI18nTests(testConfig);

  // Check for hardcoded strings
  if (pkg.failOnHardcodedStrings && results.hardcodedStrings.length > 0) {
    errors.push(`Found ${results.hardcodedStrings.length} hardcoded strings`);
  }

  // Check for missing translations
  const missingTranslations = results.translationValidation.reduce(
    (sum, validation) => sum + validation.missingKeys.length,
    0
  );
  if (pkg.validateCompleteness && missingTranslations > 0) {
    errors.push(`Found ${missingTranslations} missing translations`);
  }

  // Check for RTL issues
  if (pkg.testRTL && results.rtlIssues.length > 0) {
    warnings.push(`Found ${results.rtlIssues.length} RTL issues`);
  }

  const success = errors.length === 0;

  return {
    packageName: pkg.name,
    packagePath: pkg.path,
    success,
    results,
    errors,
    warnings,
  };
}

/**
 * Create error result for failed package tests
 */
function createErrorResult(pkg: PackageI18nConfig, errors: string[], warnings: string[]): PackageI18nTestResult {
  return {
    packageName: pkg.name,
    packagePath: pkg.path,
    success: false,
    results: {
      hardcodedStrings: [],
      translationValidation: [],
      rtlIssues: [],
      performanceMetrics: { loadTime: 0, memoryUsage: 0 },
    },
    errors,
    warnings,
  };
}
