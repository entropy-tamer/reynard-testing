/**
 * Tests for i18n CI checks
 */
/* eslint-disable @reynard/i18n/no-hardcoded-strings */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { execSync } from "child_process";
import { existsSync } from "fs";
import {
  runI18nCIChecks,
  createGitHubActionsWorkflow,
  createGitLabCIConfig,
  type I18nCIConfig,
} from "../utils/i18n-ci-checks.js";

// Mock child_process
vi.mock("child_process", () => ({
  execSync: vi.fn(),
  default: {
    execSync: vi.fn(),
  },
}));

// Mock fs
vi.mock("fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

describe("i18n CI checks", () => {
  const mockConfig: I18nCIConfig = {
    packages: ["packages/test"],
    locales: ["en", "es"],
    failOnHardcodedStrings: true,
    failOnMissingTranslations: true,
    failOnRTLIssues: true,
    generateCoverageReport: true,
    uploadResults: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock implementations
    (execSync as any).mockReturnValue("[]");
    (existsSync as any).mockReturnValue(true);
  });

  describe("runI18nCIChecks", () => {
    it("should run all configured checks", async () => {
      // Mock successful ESLint run
      (execSync as any).mockReturnValue("[]");
      (existsSync as any).mockReturnValue(true);

      const result = await runI18nCIChecks(mockConfig);

      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("hardcodedStrings");
      expect(result).toHaveProperty("missingTranslations");
      expect(result).toHaveProperty("rtlIssues");
      expect(result).toHaveProperty("coverage");
      expect(result).toHaveProperty("duration");
      expect(result).toHaveProperty("errors");
      expect(result).toHaveProperty("warnings");
    });

    it("should detect hardcoded strings when ESLint finds issues", async () => {
      const mockESLintOutput = JSON.stringify([
        {
          filePath: "test.tsx",
          messages: [{ line: 5, column: 10, message: "Hardcoded string found" }],
        },
      ]);

      (execSync as any).mockReturnValue(mockESLintOutput);
      (existsSync as any).mockReturnValue(true);

      const result = await runI18nCIChecks(mockConfig);

      // The mock returns hardcoded strings, so they should be detected
      expect(result.hardcodedStrings).toBe(1);
      expect(result.success).toBe(false);
    });

    it("should handle ESLint failure gracefully", async () => {
      // Clear all mocks first
      vi.clearAllMocks();

      // Mock execSync to throw error for hardcoded strings check, but return success for others
      (execSync as any).mockImplementation((command: string) => {
        if (command.includes("eslint") && command.includes("@reynard/i18n/no-hardcoded-strings")) {
          const error = new Error("ESLint failed");
          (error as any).status = 1;
          throw error;
        }
        // Return success for other commands
        if (command.includes("vitest")) {
          return JSON.stringify({
            coverage: {
              summary: {
                lines: { pct: 85 },
              },
            },
          });
        }
        return "[]";
      });
      (existsSync as any).mockReturnValue(true);

      const result = await runI18nCIChecks(mockConfig);

      expect(result.hardcodedStrings).toBe(0);
      // The ESLint failure is handled gracefully (0 hardcoded strings), but other checks might fail
      expect(result.success).toBe(false);
    });

    it("should detect missing RTL tests", async () => {
      (execSync as any).mockReturnValue("[]");
      (existsSync as any).mockReturnValue(false);

      const config = { ...mockConfig, locales: ["ar", "he"] };
      const result = await runI18nCIChecks(config);

      expect(result.rtlIssues).toBe(2);
      expect(result.success).toBe(false);
      expect(result.errors).toContain("Found 2 RTL issues");
    });

    it("should generate coverage report", async () => {
      const mockCoverageOutput = JSON.stringify({
        coverage: {
          summary: {
            lines: { pct: 85 },
          },
        },
      });

      (execSync as any)
        .mockReturnValueOnce("[]") // ESLint
        .mockReturnValueOnce("[]") // Translation validation
        .mockReturnValueOnce(mockCoverageOutput); // Coverage
      (existsSync as any).mockReturnValue(true);

      const result = await runI18nCIChecks(mockConfig);

      // The mock returns 85% coverage, which is above the 80% threshold
      expect(result.coverage).toBe(85);
      expect(result.warnings).not.toContain("i18n coverage is below 80%");
    });

    it("should warn on low coverage", async () => {
      const mockCoverageOutput = JSON.stringify({
        coverage: {
          summary: {
            lines: { pct: 75 },
          },
        },
      });

      (execSync as any)
        .mockReturnValueOnce("[]") // ESLint
        .mockReturnValueOnce("[]") // Translation validation
        .mockReturnValueOnce(mockCoverageOutput); // Coverage
      (existsSync as any).mockReturnValue(true);

      const result = await runI18nCIChecks(mockConfig);

      // The mock returns 75% coverage, which is below the 80% threshold
      expect(result.coverage).toBe(75);
      expect(result.warnings).toContain("i18n coverage is below 80% (75%)");
    });

    it("should handle errors gracefully", async () => {
      (execSync as any).mockImplementation(() => {
        throw new Error("Command failed");
      });

      const result = await runI18nCIChecks(mockConfig);

      // The error is caught and handled gracefully, but the result is unsuccessful
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("CI check failed");
    });

    it("should measure duration", async () => {
      (execSync as any).mockReturnValue("[]");
      (existsSync as any).mockReturnValue(true);

      const startTime = Date.now();
      const result = await runI18nCIChecks(mockConfig);
      const endTime = Date.now();

      // Duration should be at least 0 (could be 0 in very fast test environment)
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(result.duration).toBeLessThan(endTime - startTime + 100);
    });
  });

  describe("createGitHubActionsWorkflow", () => {
    it("should create valid GitHub Actions workflow", () => {
      const workflow = createGitHubActionsWorkflow();

      expect(workflow).toContain("name: i18n Checks");
      expect(workflow).toContain("on:");
      expect(workflow).toContain("push:");
      expect(workflow).toContain("pull_request:");
      expect(workflow).toContain("jobs:");
      expect(workflow).toContain("i18n-checks:");
      expect(workflow).toContain("runs-on: ubuntu-latest");
      expect(workflow).toContain("steps:");
      expect(workflow).toContain("uses: actions/checkout@v4");
      expect(workflow).toContain("uses: pnpm/action-setup@v4");
      expect(workflow).toContain("uses: actions/setup-node@v4");
      expect(workflow).toContain("run: pnpm install --frozen-lockfile");
      expect(workflow).toContain("pnpm i18n:eslint");
      expect(workflow).toContain("pnpm i18n:test");
      expect(workflow).toContain("uses: actions/upload-artifact@v4");
      expect(workflow).toContain("uses: actions/github-script@v7");
    });

    it("should include PR comment functionality", () => {
      const workflow = createGitHubActionsWorkflow();

      expect(workflow).toContain("if: github.event_name == 'pull_request'");
      expect(workflow).toContain("const results = JSON.parse(fs.readFileSync('i18n-results.json', 'utf8'));");
      expect(workflow).toContain("github.rest.issues.createComment");
    });
  });

  describe("createGitLabCIConfig", () => {
    it("should create valid GitLab CI configuration", () => {
      const config = createGitLabCIConfig();

      expect(config).toContain("stages:");
      expect(config).toContain("- i18n-checks");
      expect(config).toContain("i18n-checks:");
      expect(config).toContain("stage: i18n-checks");
      expect(config).toContain("image: node:18");
      expect(config).toContain("before_script:");
      expect(config).toContain("- npm ci");
      expect(config).toContain("script:");
      expect(config).toContain("npx i18n-lint");
      expect(config).toContain("npx vitest run packages/core/i18n --coverage");
      expect(config).toContain("artifacts:");
      expect(config).toContain("reports:");
      expect(config).toContain("coverage_report:");
      expect(config).toContain("only:");
      expect(config).toContain("- main");
      expect(config).toContain("- develop");
      expect(config).toContain("- merge_requests");
    });

    it("should include coverage reporting", () => {
      const config = createGitLabCIConfig();

      expect(config).toContain("coverage_format: cobertura");
      expect(config).toContain("path: coverage/cobertura-coverage.xml");
      expect(config).toContain("expire_in: 1 week");
    });
  });
});
