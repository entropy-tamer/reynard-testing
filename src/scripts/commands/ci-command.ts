#!/usr/bin/env node
/**
 * CI Command - Run i18n checks suitable for CI/CD
 */

import { Command } from "commander";
import { runAllPackageI18nTests } from "../../utils/i18n-package-orchestrator";

export interface CICommandOptions {
  failOnHardcoded?: boolean;
  failOnMissing?: boolean;
  failOnRtl?: boolean;
  coverageThreshold?: string;
}

/**
 * Handle the CI command action
 */
const handleCICommand = async (options: CICommandOptions): Promise<void> => {
  try {
    console.log("🦊 Running i18n CI checks...\n");

    const result = await runAllPackageI18nTests();

    let failed = false;

    // Check hardcoded strings
    if (options.failOnHardcoded && result.summary.totalHardcodedStrings > 0) {
      console.log(`❌ Found ${result.summary.totalHardcodedStrings} hardcoded strings`);
      failed = true;
    }

    // Check missing translations
    if (options.failOnMissing && result.summary.totalMissingTranslations > 0) {
      console.log(`❌ Found ${result.summary.totalMissingTranslations} missing translations`);
      failed = true;
    }

    // Check RTL issues
    if (options.failOnRtl && result.summary.totalRTLIssues > 0) {
      console.log(`❌ Found ${result.summary.totalRTLIssues} RTL issues`);
      failed = true;
    }

    // Check coverage
    const coverageThreshold = parseInt(options.coverageThreshold || "80");
    if (result.summary.averageCoverage < coverageThreshold) {
      console.log(`❌ Coverage ${result.summary.averageCoverage.toFixed(1)}% is below threshold ${coverageThreshold}%`);
      failed = true;
    }

    if (failed) {
      console.log("\n❌ CI checks failed!");
      process.exit(1);
    } else {
      console.log("\n✅ All CI checks passed!");
      process.exit(0);
    }
  } catch (error) {
    console.error("💥 Error running CI checks:", error);
    process.exit(1);
  }
};

export const createCICommand = (): Command => {
  const command = new Command("ci");

  command
    .description("Run i18n checks suitable for CI/CD")
    .option("--fail-on-hardcoded", "Fail on hardcoded strings", true)
    .option("--fail-on-missing", "Fail on missing translations", true)
    .option("--fail-on-rtl", "Fail on RTL issues", false)
    .option("--coverage-threshold <threshold>", "Coverage threshold percentage", "80")
    .action(handleCICommand);

  return command;
};
