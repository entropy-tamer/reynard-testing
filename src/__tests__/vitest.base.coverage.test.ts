import { describe, it, expect } from "vitest";
import { defineConfig } from "vitest/config";
import { createBaseVitestConfig } from "../config/vitest.base.js";

describe("Vitest Configuration Coverage", () => {
  describe("coverage exclusions", () => {
    it("should include standard exclusions in all configurations", () => {
      const config = createBaseVitestConfig({ packageName: "test-package" });

      const expectedExclusions = [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/test-setup.ts",
        "**/fixtures/**",
        "**/mocks/**",
      ];

      expectedExclusions.forEach(exclusion => {
        expect((config.test!.coverage as any).exclude).toContain(exclusion);
      });
    });

    it("should include custom exclusions", () => {
      const customExclusions = ["custom/**", "test-files/**"];
      const config = createBaseVitestConfig({
        packageName: "test-package",
        excludeFromCoverage: customExclusions,
      });

      customExclusions.forEach(exclusion => {
        expect((config.test!.coverage as any).exclude).toContain(exclusion);
      });
    });
  });

  describe("manual vitest config coverage", () => {
    it("should be able to create config with custom coverage thresholds manually", () => {
      const customThresholds = {
        branches: 90,
        functions: 95,
        lines: 95,
        statements: 95,
      };

      const config = defineConfig({
        test: {
          environment: "happy-dom",
          globals: true,
          coverage: {
            provider: "v8",
            thresholds: {
              global: customThresholds,
            },
          },
        },
      });

      expect(config.test).toBeDefined();
      expect(config.test!.coverage).toBeDefined();
      expect((config.test!.coverage as any).thresholds.global).toEqual(customThresholds);
    });

    it("should be able to create config with custom exclusions manually", () => {
      const customExclusions = ["custom/**", "test-files/**"];

      const config = defineConfig({
        test: {
          environment: "happy-dom",
          globals: true,
          coverage: {
            provider: "v8",
            exclude: [
              "node_modules/",
              "dist/",
              "coverage/",
              "**/*.d.ts",
              "**/*.config.*",
              "**/test-setup.ts",
              "**/fixtures/**",
              "**/mocks/**",
              ...customExclusions,
            ],
          },
        },
      });

      expect(config.test).toBeDefined();
      expect(config.test!.coverage).toBeDefined();
      customExclusions.forEach(exclusion => {
        expect((config.test!.coverage as any).exclude).toContain(exclusion);
      });
    });
  });
});
