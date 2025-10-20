/**
 * Documentation Test Runner CLI
 *
 * Command-line tool to run documentation tests across all packages
 */

import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createDocTestFile, generateDocTestReport, validateDocExamples } from "./doc-tests/index";

export interface PackageConfig {
  name: string;
  path: string;
  docPath: string;
  setup?: string;
}

export const PACKAGES: PackageConfig[] = [
  {
    name: "reynard-core",
    path: "packages/core/core",
    docPath: "packages/core/core/README.md",
    setup: `
      import { NotificationsProvider, createNotifications } from 'reynard-core';
    `,
  },
  {
    name: "reynard-components-core",
    path: "packages/ui/components-core",
    docPath: "packages/ui/components-core/README.md",
    setup: `
      import { Button, Card, TextField } from 'reynard-primitives';
      import { Modal, Tabs } from 'reynard-components-core';
      import { ReynardProvider } from 'reynard-themes';
      import 'reynard-themes/themes.css';
    `,
  },
  {
    name: "reynard-auth",
    path: "packages/services/auth",
    docPath: "packages/services/auth/README.md",
    setup: `
      import { AuthProvider, LoginForm, RegisterForm, useAuth } from 'reynard-auth';
      import { ReynardProvider } from 'reynard-themes';
      import 'reynard-themes/themes.css';
    `,
  },
  {
    name: "reynard-chat",
    path: "packages/services/chat",
    docPath: "packages/services/chat/README.md",
    setup: `
      import { ChatContainer, useChat, useStreamingChat, useP2PChat } from 'reynard-chat';
      import { ReynardProvider } from 'reynard-themes';
      import 'reynard-themes/themes.css';
    `,
  },
  {
    name: "reynard-testing",
    path: "packages/core/testing",
    docPath: "packages/core/testing/README.md",
    setup: `
      import { renderWithProviders, mockFetch, createMockUser } from 'reynard-testing';
      import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
    `,
  },
  {
    name: "reynard-algorithms",
    path: "packages/core/algorithms",
    docPath: "packages/core/algorithms/README.md",
    setup: `
      import { UnionFind, checkCollision, SpatialHash, PerformanceTimer } from 'reynard-algorithms';
    `,
  },
  {
    name: "reynard-file-processing",
    path: "packages/file-processing",
    docPath: "packages/file-processing/README.md",
    setup: `
      import { FileProcessingPipeline, ThumbnailGenerator } from 'reynard-file-processing';
    `,
  },
];

/**
 * Generate documentation test files for all packages
 * @param rootPath
 * @example
 */
export function generateAllDocTests(rootPath: string = process.cwd()) {
  console.log("🦊 Generating documentation test files...");

  PACKAGES.forEach(pkg => {
    const testFilePath = join(rootPath, pkg.path, "src", "doc-tests.test.ts");
    const testDir = dirname(testFilePath);

    // Ensure test directory exists
    if (!existsSync(testDir)) {
      execSync(`mkdir -p "${testDir}"`, { stdio: "inherit" });
    }

    // Generate test file
    const testContent = createDocTestFile({
      docPath: pkg.docPath,
      packageName: pkg.name,
      setup: pkg.setup || "",
    });

    writeFileSync(testFilePath, testContent);
    console.log(`✅ Generated: ${testFilePath}`);
  });

  console.log("🎉 All documentation test files generated!");
}

/**
 * Validate all documentation examples
 * @param rootPath
 * @example
 */
export function validateAllDocs(rootPath: string = process.cwd()) {
  console.log("🦦 Validating documentation examples...");

  const reports: string[] = [];
  let totalValid = 0;
  let totalInvalid = 0;

  PACKAGES.forEach(pkg => {
    const docPath = join(rootPath, pkg.docPath);

    if (existsSync(docPath)) {
      const validation = validateDocExamples(docPath);
      const report = generateDocTestReport(docPath);

      totalValid += validation.valid;
      totalInvalid += validation.invalid;

      reports.push(`## ${pkg.name}\n${report}`);

      console.log(`📊 ${pkg.name}: ${validation.valid} valid, ${validation.invalid} invalid`);
    } else {
      console.log(`⚠️  ${pkg.name}: Documentation file not found at ${docPath}`);
    }
  });

  // Generate combined report
  const combinedReport = `
# Reynard Documentation Test Report

## Overall Summary
- **Total Examples**: ${totalValid + totalInvalid}
- **Valid Examples**: ${totalValid}
- **Invalid Examples**: ${totalInvalid}
- **Success Rate**: ${totalInvalid === 0 ? "100%" : ((totalValid / (totalValid + totalInvalid)) * 100).toFixed(1)}%

## Package Reports

${reports.join("\n\n")}

## Next Steps
${
  totalInvalid > 0
    ? "1. Review and fix invalid examples\n2. Run `npm run test:docs` to execute tests\n3. Update documentation as needed"
    : "1. All examples are valid!\n2. Run `npm run test:docs` to execute tests\n3. Consider adding more examples"
}
`;

  const reportPath = join(rootPath, "docs-test-report.md");
  writeFileSync(reportPath, combinedReport);

  console.log(`📋 Full report saved to: ${reportPath}`);
  console.log(`🎯 Overall: ${totalValid} valid, ${totalInvalid} invalid examples`);
}

/**
 * Run documentation tests for a specific package
 * @param packageName
 * @param rootPath
 * @example
 */
export function runPackageDocTests(packageName: string, rootPath: string = process.cwd()) {
  const pkg = PACKAGES.find(p => p.name === packageName);

  if (!pkg) {
    console.error(`❌ Package ${packageName} not found`);
    return;
  }

  console.log(`🧪 Running documentation tests for ${packageName}...`);

  try {
    execSync(`cd "${join(rootPath, pkg.path)}" && npm run test:docs`, {
      stdio: "inherit",
      cwd: join(rootPath, pkg.path),
    });
    console.log(`✅ Documentation tests passed for ${packageName}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Documentation tests failed for ${packageName}:`, errorMessage);
  }
}

/**
 * Run documentation tests for all packages
 * @param rootPath
 * @example
 */
export function runAllDocTests(rootPath: string = process.cwd()) {
  console.log("🐺 Running documentation tests for all packages...");

  const results: { package: string; success: boolean; error?: string }[] = [];

  PACKAGES.forEach(pkg => {
    try {
      console.log(`\n🧪 Testing ${pkg.name}...`);
      execSync(`cd "${join(rootPath, pkg.path)}" && npm run test:docs`, {
        stdio: "pipe",
        cwd: join(rootPath, pkg.path),
      });

      results.push({ package: pkg.name, success: true });
      console.log(`✅ ${pkg.name} passed`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({
        package: pkg.name,
        success: false,
        error: errorMessage,
      });
      console.log(`❌ ${pkg.name} failed`);
    }
  });

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n📊 Documentation Test Summary:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log(`\n❌ Failed packages:`);
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  - ${r.package}: ${r.error}`);
      });
  }

  return results;
}

/**
 * CLI interface
 * @example
 */
export function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "generate":
      generateAllDocTests();
      break;

    case "validate":
      validateAllDocs();
      break;

    case "test":
      if (args[1]) {
        runPackageDocTests(args[1]);
      } else {
        runAllDocTests();
      }
      break;

    case "all":
      generateAllDocTests();
      validateAllDocs();
      runAllDocTests();
      break;

    default:
      console.log(`
🦊 Reynard Documentation Test Runner

Usage:
  npm run doc-tests <command> [package]

Commands:
  generate    Generate documentation test files for all packages
  validate    Validate all documentation examples
  test        Run documentation tests (optionally for specific package)
  all         Run all commands (generate, validate, test)

Examples:
  npm run doc-tests generate
  npm run doc-tests validate
  npm run doc-tests test reynard-core
  npm run doc-tests test
  npm run doc-tests all
`);
  }
}

// Run if called directly
if (typeof require !== "undefined" && require.main === require.main) {
  main();
}
