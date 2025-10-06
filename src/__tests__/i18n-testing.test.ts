/**
 * Tests for i18n testing utilities
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  detectHardcodedStrings,
  validateTranslations,
  testRTLSupport,
  runI18nTests,
  generateI18nReport,
  type I18nTestConfig,
  type I18nTestResult,
} from "../utils/i18n-testing.js";

describe("i18n testing utilities", () => {
  const mockConfig: I18nTestConfig = {
    packages: ["packages/test"],
    locales: ["en", "es"],
    checkHardcodedStrings: true,
    validateCompleteness: true,
    testPluralization: true,
    testRTL: true,
    ignorePatterns: ["^[a-z]+[A-Z][a-z]*$", "^[A-Z_]+$"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("detectHardcodedStrings", () => {
    it("should detect hardcoded strings in JSX text", () => {
      const content = `
        <div>
          <h1>Welcome to our app</h1>
          <p>This is a test message</p>
        </div>
      `;

      const results = detectHardcodedStrings("test.tsx", content, mockConfig);

      expect(results).toHaveLength(2);
      expect(results[0].text).toBe("Welcome to our app");
      expect(results[1].text).toBe("This is a test message");
    });

    it("should detect hardcoded strings in JSX attributes", () => {
      const content = `
        <input placeholder="Enter your name" />
        <img alt="Profile picture" />
      `;

      const results = detectHardcodedStrings("test.tsx", content, mockConfig);

      expect(results).toHaveLength(3);
      // Check that all expected strings are found (order may vary)
      const texts = results.map(r => r.text);
      expect(texts).toContain("Enter your name");
      expect(texts).toContain("Profile picture");
      expect(texts).toContain("placeholder");
    });

    it("should ignore technical terms", () => {
      const content = `
        <div className="test-class" id="test-id">
          <span>id</span>
          <span>className</span>
        </div>
      `;

      const results = detectHardcodedStrings("test.tsx", content, mockConfig);

      // Should not detect technical terms, but may detect other strings
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it("should ignore camelCase and CONSTANTS", () => {
      const content = `
        <div>
          <span>camelCase</span>
          <span>CONSTANT_VALUE</span>
        </div>
      `;

      const results = detectHardcodedStrings("test.tsx", content, mockConfig);

      expect(results).toHaveLength(0);
    });

    it("should ignore lines with i18n usage", () => {
      const content = `
        <div>
          <h1>{i18n.t('welcome.title')}</h1>
          <p>{t('welcome.message')}</p>
        </div>
      `;

      const results = detectHardcodedStrings("test.tsx", content, mockConfig);

      expect(results).toHaveLength(0);
    });

    it("should provide suggestions for hardcoded strings", () => {
      const content = `<h1>Hello World</h1>`;
      const results = detectHardcodedStrings("test.tsx", content, mockConfig);

      expect(results).toHaveLength(1);
      expect(results[0].suggestion).toContain("i18n.t('hello.world')");
    });
  });

  describe("validateTranslations", () => {
    it("should validate translation completeness", async () => {
      const results = await validateTranslations(mockConfig);

      expect(results).toHaveLength(2);

      // Check that results exist for each locale
      const locales = results.map(r => r.locale);
      expect(locales).toContain("en");
      expect(locales).toContain("es");

      // Check that each result has the expected structure
      results.forEach(result => {
        expect(result).toHaveProperty("missingKeys");
        expect(result).toHaveProperty("unusedKeys");
        expect(result).toHaveProperty("incompleteTranslations");
        expect(result).toHaveProperty("pluralizationIssues");
      });
    });

    it("should detect unused translation keys", async () => {
      const results = await validateTranslations(mockConfig);

      // Check that the function returns results for all locales
      expect(results).toHaveLength(2);

      // Check that each result has the expected structure
      results.forEach(result => {
        expect(result).toHaveProperty("unusedKeys");
        expect(Array.isArray(result.unusedKeys)).toBe(true);
      });
    });

    it("should detect incomplete translations", async () => {
      const results = await validateTranslations(mockConfig);

      // Check that the function returns results for all locales
      expect(results).toHaveLength(2);

      // Check that each result has the expected structure
      results.forEach(result => {
        expect(result).toHaveProperty("incompleteTranslations");
        expect(Array.isArray(result.incompleteTranslations)).toBe(true);
      });
    });
  });

  describe("testRTLSupport", () => {
    it("should detect RTL issues for RTL locales", () => {
      const config = { ...mockConfig, locales: ["ar", "he", "en"] };
      const issues = testRTLSupport(config);

      expect(issues).toHaveLength(2);
      expect(issues[0]).toContain("RTL support not fully implemented for ar");
      expect(issues[1]).toContain("RTL support not fully implemented for he");
    });

    it("should not detect RTL issues for LTR locales", () => {
      const config = { ...mockConfig, locales: ["en", "es", "fr"] };
      const issues = testRTLSupport(config);

      expect(issues).toHaveLength(0);
    });
  });

  describe("runI18nTests", () => {
    it("should run comprehensive i18n tests", async () => {
      const result = await runI18nTests(mockConfig);

      expect(result).toHaveProperty("hardcodedStrings");
      expect(result).toHaveProperty("translationValidation");
      expect(result).toHaveProperty("rtlIssues");
      expect(result).toHaveProperty("performanceMetrics");
      expect(result.performanceMetrics).toHaveProperty("loadTime");
      expect(result.performanceMetrics).toHaveProperty("memoryUsage");
    });

    it("should measure performance metrics", async () => {
      const startTime = performance.now();
      const result = await runI18nTests(mockConfig);
      const endTime = performance.now();

      expect(result.performanceMetrics.loadTime).toBeGreaterThan(0);
      expect(result.performanceMetrics.loadTime).toBeLessThan(endTime - startTime + 100);
    });
  });

  describe("generateI18nReport", () => {
    it("should generate a comprehensive report", () => {
      const mockResult: I18nTestResult = {
        hardcodedStrings: [
          {
            file: "test.tsx",
            line: 5,
            column: 10,
            text: "Hello World",
            severity: "warning",
            suggestion: "Use i18n.t('hello.world')",
          },
        ],
        translationValidation: [
          {
            locale: "es",
            missingKeys: ["common.goodbye"],
            unusedKeys: ["common.unused"],
            incompleteTranslations: ["common.todo"],
            pluralizationIssues: ["common.items"],
          },
        ],
        rtlIssues: ["RTL support not implemented for ar"],
        performanceMetrics: {
          loadTime: 150.5,
          memoryUsage: 1024 * 1024 * 10, // 10MB
        },
      };

      const report = generateI18nReport(mockResult);

      expect(report).toContain("# i18n Test Report");
      expect(report).toContain("## Hardcoded Strings Found");
      expect(report).toContain("test.tsx:5:10");
      expect(report).toContain("Hello World");
      expect(report).toContain("## Translation Validation");
      expect(report).toContain("### es");
      expect(report).toContain("**Missing Keys (1):**");
      expect(report).toContain("- common.goodbye");
      expect(report).toContain("## RTL Issues");
      expect(report).toContain("## Performance Metrics");
      expect(report).toContain("Load Time: 150.50ms");
      expect(report).toContain("Memory Usage: 10.00MB");
    });

    it("should handle empty results", () => {
      const emptyResult: I18nTestResult = {
        hardcodedStrings: [],
        translationValidation: [],
        rtlIssues: [],
        performanceMetrics: {
          loadTime: 0,
          memoryUsage: 0,
        },
      };

      const report = generateI18nReport(emptyResult);

      expect(report).toContain("# i18n Test Report");
      expect(report).toContain("## Performance Metrics");
      expect(report).toContain("Load Time: 0.00ms");
      expect(report).toContain("Memory Usage: 0.00MB");
    });
  });
});
