#!/usr/bin/env node
/**
 * Run Command - Execute i18n tests for all packages
 */

import { Command } from "commander";
import { runAllPackageI18nTests } from "../../utils/i18n-package-orchestrator";
import { writeFileSync } from "fs";

export interface RunCommandOptions {
  packages?: string[];
  output?: string;
  report?: string;
  failFast?: boolean;
  verbose?: boolean;
}

/**
 * Handle the run command action
 */
const handleRunCommand = async (options: RunCommandOptions): Promise<void> => {
  try {
    console.log("🦊 Reynard i18n Testing CLI\n");

    if (options.verbose) {
      console.log("📋 Configuration:");
      console.log(`   Packages: ${options.packages ? options.packages.join(", ") : "all enabled"}`);
      console.log(`   Output: ${options.output || "console"}`);
      console.log(`   Report: ${options.report || "console"}`);
      console.log(`   Fail Fast: ${options.failFast ? "yes" : "no"}`);
      console.log("");
    }

    const result = await runAllPackageI18nTests();

    // Output JSON results if requested
    if (options.output) {
      const jsonOutput = {
        timestamp: new Date().toISOString(),
        success: result.overallSuccess,
        summary: result.summary,
        duration: result.duration,
        packages: result.packageResults.map(pkg => ({
          name: pkg.packageName,
          path: pkg.packagePath,
          success: pkg.success,
          errors: pkg.errors,
          warnings: pkg.warnings,
          hardcodedStrings: pkg.results.hardcodedStrings.length,
          missingTranslations: pkg.results.translationValidation.reduce((sum, v) => sum + v.missingKeys.length, 0),
          rtlIssues: pkg.results.rtlIssues.length,
        })),
      };

      writeFileSync(options.output, JSON.stringify(jsonOutput, null, 2));
      console.log(`📄 Results written to: ${options.output}`);
    }

    // Output Markdown report if requested
    if (options.report) {
      writeFileSync(options.report, result.report);
      console.log(`📊 Report written to: ${options.report}`);
    }

    // Exit with appropriate code
    process.exit(result.overallSuccess ? 0 : 1);
  } catch (error) {
    console.error("💥 Error running i18n tests:", error);
    process.exit(1);
  }
};

export const createRunCommand = (): Command => {
  const command = new Command("run");

  command
    .description("Run i18n tests for all enabled packages")
    .option("-p, --packages <packages...>", "Specific packages to test (default: all enabled)")
    .option("-o, --output <file>", "Output file for test results (JSON format)")
    .option("-r, --report <file>", "Output file for test report (Markdown format)")
    .option("--fail-fast", "Stop on first failure")
    .option("--verbose", "Verbose output")
    .action(handleRunCommand);

  return command;
};
