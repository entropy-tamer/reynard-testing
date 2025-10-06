/**
 * Example integration of i18n testing tools into Reynard packages
 * This file demonstrates how to use the i18n testing utilities
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  detectHardcodedStrings,
  validateTranslations,
  runI18nTests,
  generateI18nReport,
  type I18nTestConfig,
} from "./i18n-testing";

// Example 1: Basic hardcoded string detection
describe("Hardcoded String Detection Example", () => {
  it("should detect hardcoded strings in a React component", () => {
    const componentCode = `
      import { Component } from 'solid-js';
      
      export function WelcomeComponent() {
        return (
          <div>
            <h1>Welcome to our application</h1>
            <p>Please enter your name below</p>
            <input placeholder="Enter your name" />
            <button>Submit</button>
          </div>
        );
      }
    `;

    const config: I18nTestConfig = {
      packages: ["packages/ui"],
      locales: ["en", "es"],
      checkHardcodedStrings: true,
      validateCompleteness: true,
      testPluralization: true,
      testRTL: true,
      ignorePatterns: ["^[a-z]+[A-Z][a-z]*$", "^[A-Z_]+$"],
    };

    const results = detectHardcodedStrings("WelcomeComponent.tsx", componentCode, config);

    expect(results).toHaveLength(4);
    expect(results[0].text).toBe("Welcome to our application");
    expect(results[1].text).toBe("Please enter your name below");
    expect(results[2].text).toBe("Enter your name");
    expect(results[3].text).toBe("Submit");
  });

  it("should ignore technical terms and camelCase", () => {
    const componentCode = `
      import { Component } from 'solid-js';
      
      export function TechnicalComponent() {
        return (
          <div className="test-class" id="test-id">
            <span>camelCase</span>
            <span>CONSTANT_VALUE</span>
            <span>id</span>
            <span>className</span>
          </div>
        );
      }
    `;

    const config: I18nTestConfig = {
      packages: ["packages/ui"],
      locales: ["en"],
      checkHardcodedStrings: true,
      validateCompleteness: false,
      testPluralization: false,
      testRTL: false,
      ignorePatterns: ["^[a-z]+[A-Z][a-z]*$", "^[A-Z_]+$"],
    };

    const results = detectHardcodedStrings("TechnicalComponent.tsx", componentCode, config);

    expect(results).toHaveLength(0);
  });
});

// Example 2: Translation validation
describe("Translation Validation Example", () => {
  it("should validate translation completeness", async () => {
    const config: I18nTestConfig = {
      packages: ["packages/core/i18n"],
      locales: ["en", "es", "fr"],
      checkHardcodedStrings: false,
      validateCompleteness: true,
      testPluralization: true,
      testRTL: false,
      ignorePatterns: [],
    };

    const results = await validateTranslations(config);

    expect(results).toHaveLength(3);

    // Check that each locale has validation results
    const locales = results.map(r => r.locale);
    expect(locales).toContain("en");
    expect(locales).toContain("es");
    expect(locales).toContain("fr");
  });
});

// Example 3: Comprehensive i18n testing
describe("Comprehensive i18n Testing Example", () => {
  it("should run all i18n tests and generate report", async () => {
    const config: I18nTestConfig = {
      packages: ["packages/ui", "packages/core/i18n"],
      locales: ["en", "es", "fr", "de", "ru", "ar"],
      checkHardcodedStrings: true,
      validateCompleteness: true,
      testPluralization: true,
      testRTL: true,
      ignorePatterns: ["^[a-z]+[A-Z][a-z]*$", "^[A-Z_]+$"],
    };

    const result = await runI18nTests(config);

    expect(result).toHaveProperty("hardcodedStrings");
    expect(result).toHaveProperty("translationValidation");
    expect(result).toHaveProperty("rtlIssues");
    expect(result).toHaveProperty("performanceMetrics");

    const report = generateI18nReport(result);
    expect(report).toContain("# i18n Test Report");
    expect(report).toContain("## Performance Metrics");
  });
});

// Example 4: Integration with existing test suites
describe("Integration with Existing Test Suites", () => {
  beforeEach(() => {
    // Clear any global state that might affect tests
    // This would be done in your actual test setup
  });

  it("should integrate with component tests", () => {
    // Example of how to integrate i18n testing with existing component tests
    const componentCode = `
      import { Component } from 'solid-js';
      import { useI18n } from 'reynard-i18n';
      
      export function LocalizedComponent() {
        const { t } = useI18n();
        
        return (
          <div>
            <h1>{t('welcome.title')}</h1>
            <p>{t('welcome.message')}</p>
            <button>{t('common.submit')}</button>
          </div>
        );
      }
    `;

    const config: I18nTestConfig = {
      packages: ["packages/ui"],
      locales: ["en"],
      checkHardcodedStrings: true,
      validateCompleteness: false,
      testPluralization: false,
      testRTL: false,
      ignorePatterns: [],
    };

    const results = detectHardcodedStrings("LocalizedComponent.tsx", componentCode, config);

    // Should not find any hardcoded strings since we're using i18n
    expect(results).toHaveLength(0);
  });

  it("should work with pluralization tests", () => {
    // Example of how to test pluralization
    const pluralizationCode = `
      import { useI18n } from 'reynard-i18n';
      
      export function ItemList({ count }: { count: number }) {
        const { t } = useI18n();
        
        return (
          <div>
            <p>{t('items.count', { count })}</p>
          </div>
        );
      }
    `;

    const config: I18nTestConfig = {
      packages: ["packages/ui"],
      locales: ["en", "ru", "ar"],
      checkHardcodedStrings: true,
      validateCompleteness: true,
      testPluralization: true,
      testRTL: true,
      ignorePatterns: [],
    };

    const results = detectHardcodedStrings("ItemList.tsx", pluralizationCode, config);

    // Should not find hardcoded strings
    expect(results).toHaveLength(0);
  });
});

// Example 5: Performance testing
describe("Performance Testing Example", () => {
  it("should measure i18n performance", async () => {
    const config: I18nTestConfig = {
      packages: ["packages/core/i18n"],
      locales: ["en", "es", "fr", "de", "ru", "ar"],
      checkHardcodedStrings: true,
      validateCompleteness: true,
      testPluralization: true,
      testRTL: true,
      ignorePatterns: [],
    };

    const startTime = performance.now();
    const result = await runI18nTests(config);
    const endTime = performance.now();

    expect(result.performanceMetrics.loadTime).toBeGreaterThan(0);
    expect(result.performanceMetrics.loadTime).toBeLessThan(endTime - startTime + 100);
    expect(result.performanceMetrics.memoryUsage).toBeGreaterThan(0);
  });
});

// Example 6: Error handling
describe("Error Handling Example", () => {
  it("should handle missing translation files gracefully", async () => {
    const config: I18nTestConfig = {
      packages: ["packages/nonexistent"],
      locales: ["en"],
      checkHardcodedStrings: false,
      validateCompleteness: true,
      testPluralization: false,
      testRTL: false,
      ignorePatterns: [],
    };

    // This should not throw an error
    const result = await runI18nTests(config);

    expect(result).toHaveProperty("translationValidation");
    expect(result.translationValidation).toHaveLength(1);
  });

  it("should handle invalid configuration gracefully", async () => {
    const config: I18nTestConfig = {
      packages: [],
      locales: [],
      checkHardcodedStrings: false,
      validateCompleteness: false,
      testPluralization: false,
      testRTL: false,
      ignorePatterns: [],
    };

    // This should not throw an error
    const result = await runI18nTests(config);

    expect(result).toHaveProperty("hardcodedStrings");
    expect(result).toHaveProperty("translationValidation");
    expect(result).toHaveProperty("rtlIssues");
    expect(result).toHaveProperty("performanceMetrics");
  });
});

// Example 7: Custom ignore patterns
describe("Custom Ignore Patterns Example", () => {
  it("should respect custom ignore patterns", () => {
    const componentCode = `
      import { Component } from 'solid-js';
      
      export function CustomComponent() {
        return (
          <div>
            <h1>Welcome to our application</h1>
            <p>This is a test message</p>
            <span>test-pattern</span>
            <span>another-pattern</span>
          </div>
        );
      }
    `;

    const config: I18nTestConfig = {
      packages: ["packages/ui"],
      locales: ["en"],
      checkHardcodedStrings: true,
      validateCompleteness: false,
      testPluralization: false,
      testRTL: false,
      ignorePatterns: ["test-pattern", "another-pattern"],
    };

    const results = detectHardcodedStrings("CustomComponent.tsx", componentCode, config);

    // Should find the first two strings but ignore the custom patterns
    expect(results).toHaveLength(2);
    expect(results[0].text).toBe("Welcome to our application");
    expect(results[1].text).toBe("This is a test message");
  });
});
