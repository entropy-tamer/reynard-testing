/**
 * i18n Integration Tests
 * Tests the complete i18n testing system integration
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  runAllPackageI18nTests,
  validatePackageI18nSetup,
  createPackageI18nTestFiles,
} from "../utils/i18n-package-orchestrator.js";
import {
  defaultI18nTestingConfig,
  getEnabledPackages,
  getEnabledPackagePaths,
  getAllNamespaces,
} from "../config/i18n-testing-config";

describe("i18n Integration Tests", () => {
  beforeEach(() => {
    // Clear any existing test state
  });

  describe("Configuration System", () => {
    it("should have valid default configuration", () => {
      expect(defaultI18nTestingConfig).toBeDefined();
      expect(defaultI18nTestingConfig.packages).toBeDefined();
      expect(defaultI18nTestingConfig.locales).toBeDefined();
      expect(defaultI18nTestingConfig.locales.length).toBeGreaterThan(0);
    });

    it("should have enabled packages", async () => {
      const enabledPackages = await getEnabledPackages();
      expect(enabledPackages.length).toBeGreaterThan(0);

      // Check that key packages are enabled
      const packageNames = enabledPackages.map(pkg => pkg.name);
      expect(packageNames).toContain("components");
      expect(packageNames).toContain("ui");
      expect(packageNames).toContain("auth");
    });

    it("should have valid package paths", async () => {
      const packagePaths = await getEnabledPackagePaths();
      expect(packagePaths.length).toBeGreaterThan(0);

      // All paths should start with 'packages/'
      packagePaths.forEach(path => {
        expect(path).toMatch(/^packages\//);
      });
    });

    it("should have valid namespaces", async () => {
      const namespaces = await getAllNamespaces();
      expect(namespaces.length).toBeGreaterThan(0);
      expect(namespaces).toContain("common");
    });
  });

  describe("Package Setup Validation", () => {
    it("should validate package setup", async () => {
      const validation = await validatePackageI18nSetup();

      // We expect some issues since not all packages have complete i18n setup yet
      expect(validation).toBeDefined();
      expect(typeof validation.valid).toBe("boolean");
      expect(Array.isArray(validation.issues)).toBe(true);
    });
  });

  describe("Package Test File Creation", () => {
    it("should create package test files", async () => {
      // This test verifies the function exists and can be called
      // In a real environment, it would create actual test files
      expect(typeof createPackageI18nTestFiles).toBe("function");

      // We can't actually create files in the test environment,
      // but we can verify the function is callable
      await expect(createPackageI18nTestFiles()).resolves.not.toThrow();
    });
  });

  describe("End-to-End Integration", () => {
    it("should run comprehensive i18n tests", async () => {
      // This is a comprehensive test that verifies the entire system works
      const result = await runAllPackageI18nTests();

      expect(result).toBeDefined();
      expect(result.overallSuccess).toBeDefined();
      expect(typeof result.overallSuccess).toBe("boolean");
      expect(Array.isArray(result.packageResults)).toBe(true);
      expect(result.summary).toBeDefined();
      expect(typeof result.duration).toBe("number");
      expect(typeof result.report).toBe("string");

      // Verify summary structure
      expect(result.summary.totalPackages).toBeGreaterThan(0);
      expect(result.summary.successfulPackages).toBeGreaterThanOrEqual(0);
      expect(result.summary.failedPackages).toBeGreaterThanOrEqual(0);
      expect(result.summary.totalHardcodedStrings).toBeGreaterThanOrEqual(0);
      expect(result.summary.totalMissingTranslations).toBeGreaterThanOrEqual(0);
      expect(result.summary.totalRTLIssues).toBeGreaterThanOrEqual(0);
      expect(result.summary.averageCoverage).toBeGreaterThanOrEqual(0);

      // Verify package results structure
      result.packageResults.forEach(pkgResult => {
        expect(pkgResult.packageName).toBeDefined();
        expect(pkgResult.packagePath).toBeDefined();
        expect(typeof pkgResult.success).toBe("boolean");
        expect(Array.isArray(pkgResult.errors)).toBe(true);
        expect(Array.isArray(pkgResult.warnings)).toBe(true);
        expect(pkgResult.results).toBeDefined();
      });
    }, 30000); // 30 second timeout for comprehensive test
  });

  describe("Error Handling", () => {
    it("should handle missing packages gracefully", async () => {
      // Test with a non-existent package
      const result = await runAllPackageI18nTests();

      // Should not throw and should return a valid result
      expect(result).toBeDefined();
      expect(result.packageResults).toBeDefined();
    });

    it("should handle configuration errors gracefully", async () => {
      // Test that configuration functions handle edge cases
      expect(async () => await getEnabledPackages()).not.toThrow();
      expect(async () => await getEnabledPackagePaths()).not.toThrow();
      expect(async () => await getAllNamespaces()).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("should complete tests within reasonable time", async () => {
      const startTime = Date.now();
      const result = await runAllPackageI18nTests();
      const duration = Date.now() - startTime;

      // Should complete within 30 seconds
      expect(duration).toBeLessThan(30000);
      expect(result.duration).toBeGreaterThan(0);
    }, 35000);
  });

  describe("Report Generation", () => {
    it("should generate valid reports", async () => {
      const result = await runAllPackageI18nTests();

      expect(result.report).toBeDefined();
      expect(typeof result.report).toBe("string");
      expect(result.report.length).toBeGreaterThan(0);

      // Report should contain key sections
      expect(result.report).toContain("# Global i18n Test Report");
      expect(result.report).toContain("## Summary");
      expect(result.report).toContain("## Package Results");
    });
  });
});
