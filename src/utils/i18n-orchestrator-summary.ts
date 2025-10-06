/**
 * Summary and Reporting for i18n Package Testing
 */

import type { PackageI18nTestResult, GlobalI18nTestResult } from "./i18n-orchestrator-types";

/**
 * Generate summary statistics
 */
export function generateSummary(packageResults: PackageI18nTestResult[]): GlobalI18nTestResult["summary"] {
  const totalPackages = packageResults.length;
  const successfulPackages = packageResults.filter(r => r.success).length;
  const failedPackages = totalPackages - successfulPackages;

  const totalHardcodedStrings = packageResults.reduce((sum, r) => sum + r.results.hardcodedStrings.length, 0);

  const totalMissingTranslations = packageResults.reduce(
    (sum, r) => sum + r.results.translationValidation.reduce((vSum, v) => vSum + v.missingKeys.length, 0),
    0
  );

  const totalRTLIssues = packageResults.reduce((sum, r) => sum + r.results.rtlIssues.length, 0);

  const totalCoverage = packageResults.reduce((sum, r) => sum + (r.results.performanceMetrics.loadTime > 0 ? 1 : 0), 0);
  const averageCoverage = totalPackages > 0 ? (totalCoverage / totalPackages) * 100 : 0;

  return {
    totalPackages,
    successfulPackages,
    failedPackages,
    totalHardcodedStrings,
    totalMissingTranslations,
    totalRTLIssues,
    averageCoverage,
  };
}

/**
 * Generate global test report
 */
export function generateGlobalReport(
  packageResults: PackageI18nTestResult[],
  summary: GlobalI18nTestResult["summary"],
  duration: number
): string {
  let report = "# Global i18n Test Report\n\n";

  // Summary section
  report += "## Summary\n\n";
  report += `- **Total Packages**: ${summary.totalPackages}\n`;
  report += `- **Successful**: ${summary.successfulPackages}\n`;
  report += `- **Failed**: ${summary.failedPackages}\n`;
  report += `- **Hardcoded Strings**: ${summary.totalHardcodedStrings}\n`;
  report += `- **Missing Translations**: ${summary.totalMissingTranslations}\n`;
  report += `- **RTL Issues**: ${summary.totalRTLIssues}\n`;
  report += `- **Average Coverage**: ${summary.averageCoverage.toFixed(1)}%\n`;
  report += `- **Duration**: ${duration}ms\n\n`;

  // Package results section
  report += "## Package Results\n\n";
  packageResults.forEach(result => {
    report += generatePackageReportSection(result);
  });

  return report;
}

/**
 * Generate report section for a single package
 */
function generatePackageReportSection(result: PackageI18nTestResult): string {
  const status = result.success ? "✅" : "❌";
  let section = `### ${status} ${result.packageName}\n\n`;
  section += `**Path**: \`${result.packagePath}\`\n\n`;

  if (result.errors.length > 0) {
    section += "**Errors:**\n";
    result.errors.forEach(error => {
      section += `- ${error}\n`;
    });
    section += "\n";
  }

  if (result.warnings.length > 0) {
    section += "**Warnings:**\n";
    result.warnings.forEach(warning => {
      section += `- ${warning}\n`;
    });
    section += "\n";
  }

  // Add detailed results
  if (result.results.hardcodedStrings.length > 0) {
    section += `**Hardcoded Strings (${result.results.hardcodedStrings.length}):**\n`;
    result.results.hardcodedStrings.slice(0, 5).forEach(hs => {
      section += `- \`${hs.text}\` at ${hs.file}:${hs.line}:${hs.column}\n`;
    });
    if (result.results.hardcodedStrings.length > 5) {
      section += `- ... and ${result.results.hardcodedStrings.length - 5} more\n`;
    }
    section += "\n";
  }

  if (result.results.translationValidation.length > 0) {
    const totalMissing = result.results.translationValidation.reduce((sum, v) => sum + v.missingKeys.length, 0);
    if (totalMissing > 0) {
      section += `**Missing Translations (${totalMissing}):**\n`;
      result.results.translationValidation.forEach(validation => {
        if (validation.missingKeys.length > 0) {
          section += `- **${validation.locale}**: ${validation.missingKeys.slice(0, 3).join(", ")}`;
          if (validation.missingKeys.length > 3) {
            section += ` ... and ${validation.missingKeys.length - 3} more`;
          }
          section += "\n";
        }
      });
      section += "\n";
    }
  }

  if (result.results.rtlIssues.length > 0) {
    section += `**RTL Issues (${result.results.rtlIssues.length}):**\n`;
    result.results.rtlIssues.forEach(issue => {
      section += `- ${issue}\n`;
    });
    section += "\n";
  }

  return section;
}
