/**
 * Types for i18n Package Testing Orchestrator
 */

import type { I18nTestResult } from "./i18n-testing.js";

export interface PackageI18nTestResult {
  packageName: string;
  packagePath: string;
  success: boolean;
  results: I18nTestResult;
  errors: string[];
  warnings: string[];
}

export interface GlobalI18nTestResult {
  overallSuccess: boolean;
  packageResults: PackageI18nTestResult[];
  summary: {
    totalPackages: number;
    successfulPackages: number;
    failedPackages: number;
    totalHardcodedStrings: number;
    totalMissingTranslations: number;
    totalRTLIssues: number;
    averageCoverage: number;
  };
  duration: number;
  report: string;
}
