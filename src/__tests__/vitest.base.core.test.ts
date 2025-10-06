import { describe, it, expect, vi } from "vitest";
import {
  createBaseVitestConfig,
  createComponentTestConfig,
  createUtilityTestConfig,
  createIntegrationTestConfig,
} from "../config/vitest.base.js";

describe("Vitest Configuration Core Functions", () => {
  describe("createBaseVitestConfig", () => {
    it("should create a base vitest configuration with default options", () => {
      const config = createBaseVitestConfig({ packageName: "test-package" });

      expect(config).toBeDefined();
      expect(config.plugins).toBeDefined();
      expect(config.test).toBeDefined();
      expect(config.test!.environment).toBe("happy-dom");
      expect(config.test!.globals).toBe(true);
      expect(config.test!.setupFiles).toEqual(["./src/test-setup.ts"]);
    });

    it("should create a base vitest configuration with custom options", () => {
      const customSetupFiles = ["./custom-setup.ts"];
      const customPlugins = [vi.fn()];
      const customCoverageThresholds = {
        branches: 90,
        functions: 95,
        lines: 95,
        statements: 95,
      };
      const customExcludeFromCoverage = ["custom-exclude/**"];

      const config = createBaseVitestConfig({
        packageName: "test-package",
        setupFiles: customSetupFiles,
        additionalPlugins: customPlugins,
        coverageThresholds: customCoverageThresholds,
        excludeFromCoverage: customExcludeFromCoverage,
      });

      expect(config.test!.setupFiles).toEqual(customSetupFiles);
      expect(config.plugins).toHaveLength(2); // solid plugin + custom plugin
      expect((config.test!.coverage as any).thresholds.global).toEqual(customCoverageThresholds);
      expect((config.test!.coverage as any).exclude).toContain("custom-exclude/**");
    });

    it("should handle minimal options", () => {
      const config = createBaseVitestConfig({ packageName: "minimal-package" });

      expect((config.test!.coverage as any).thresholds.global).toEqual({
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      });
    });

    it("should include solid plugin by default", () => {
      const config = createBaseVitestConfig({ packageName: "test-package" });

      expect(config.plugins).toHaveLength(1);
      expect(config.plugins![0]).toBeDefined();
    });

    it("should set up happy-dom environment options correctly", () => {
      const config = createBaseVitestConfig({ packageName: "test-package" });

      expect(config.test!.environmentOptions!.happyDOM).toEqual({
        url: "http://localhost:3000",
        settings: {
          disableJavaScriptFileLoading: true,
          disableJavaScriptEvaluation: true,
          disableCSSFileLoading: true,
        },
      });
    });

    it("should configure coverage provider and reporters", () => {
      const config = createBaseVitestConfig({ packageName: "test-package" });

      expect((config.test!.coverage as any).provider).toBe("v8");
      expect((config.test!.coverage as any).reporter).toEqual(["text", "html", "lcov"]);
    });
  });

  describe("specialized config functions", () => {
    it("should create component test config with higher coverage thresholds", () => {
      const config = createComponentTestConfig("component-package");

      expect((config.test!.coverage as any).thresholds.global).toEqual({
        branches: 85,
        functions: 90,
        lines: 90,
        statements: 90,
      });
    });

    it("should create utility test config with highest coverage thresholds", () => {
      const config = createUtilityTestConfig("utility-package");

      expect((config.test!.coverage as any).thresholds.global).toEqual({
        branches: 90,
        functions: 95,
        lines: 95,
        statements: 95,
      });
    });

    it("should create integration test config with lower coverage thresholds", () => {
      const config = createIntegrationTestConfig("integration-package");

      expect((config.test!.coverage as any).thresholds.global).toEqual({
        branches: 75,
        functions: 80,
        lines: 80,
        statements: 80,
      });
    });
  });
});
