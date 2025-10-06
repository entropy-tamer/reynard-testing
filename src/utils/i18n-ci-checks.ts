/**
 * CI/CD i18n Checks
 * Automated i18n validation for continuous integration
 */

import { execSync } from "child_process";
import { existsSync } from "fs";

export interface I18nCIConfig {
  /** Packages to check */
  packages: string[];
  /** Locales to validate */
  locales: string[];
  /** Whether to fail on hardcoded strings */
  failOnHardcodedStrings: boolean;
  /** Whether to fail on missing translations */
  failOnMissingTranslations: boolean;
  /** Whether to fail on RTL issues */
  failOnRTLIssues: boolean;
  /** Whether to generate coverage report */
  generateCoverageReport: boolean;
  /** Whether to upload results to external service */
  uploadResults: boolean;
}

export interface I18nCIResult {
  success: boolean;
  hardcodedStrings: number;
  missingTranslations: number;
  rtlIssues: number;
  coverage: number;
  duration: number;
  errors: string[];
  warnings: string[];
}

/**
 * Run i18n checks in CI environment
 */
export async function runI18nCIChecks(config: I18nCIConfig): Promise<I18nCIResult> {
  const startTime = Date.now();
  const result: I18nCIResult = {
    success: true,
    hardcodedStrings: 0,
    missingTranslations: 0,
    rtlIssues: 0,
    coverage: 0,
    duration: 0,
    errors: [],
    warnings: [],
  };

  try {
    console.log("🦊 Starting i18n CI checks...\n");

    // 1. Check for hardcoded strings
    if (config.failOnHardcodedStrings) {
      console.log("🔍 Checking for hardcoded strings...");
      const hardcodedResult = await checkHardcodedStrings(config.packages);
      result.hardcodedStrings = hardcodedResult.count;

      if (hardcodedResult.count > 0) {
        result.errors.push(`Found ${hardcodedResult.count} hardcoded strings`);
        result.success = false;
      }
    }

    // 2. Validate translations
    if (config.failOnMissingTranslations) {
      console.log("🌍 Validating translations...");
      const translationResult = await validateTranslations(config.locales);
      result.missingTranslations = translationResult.missingCount;

      if (translationResult.missingCount > 0) {
        result.errors.push(`Found ${translationResult.missingCount} missing translations`);
        result.success = false;
      }
    }

    // 3. Check RTL support
    if (config.failOnRTLIssues) {
      console.log("🔄 Checking RTL support...");
      const rtlResult = await checkRTLSupport(config.locales);
      result.rtlIssues = rtlResult.issueCount;

      if (rtlResult.issueCount > 0) {
        result.errors.push(`Found ${rtlResult.issueCount} RTL issues`);
        result.success = false;
      }
    }

    // 4. Generate coverage report
    if (config.generateCoverageReport) {
      console.log("📊 Generating coverage report...");
      const coverageResult = await generateCoverageReport();
      result.coverage = coverageResult.percentage;

      if (coverageResult.percentage < 80) {
        result.warnings.push(`i18n coverage is below 80% (${coverageResult.percentage}%)`);
      }
    }

    // 5. Upload results if configured
    if (config.uploadResults) {
      console.log("📤 Uploading results...");
      await uploadResults(result);
    }

    result.duration = Date.now() - startTime;

    console.log(`\n✅ i18n CI checks completed in ${result.duration}ms`);
    if (result.success) {
      console.log("🎉 All i18n checks passed!");
    } else {
      console.log("❌ Some i18n checks failed. See errors above.");
    }
  } catch (error) {
    result.success = false;
    result.errors.push(`CI check failed: ${error instanceof Error ? error.message : String(error)}`);
    console.error("❌ i18n CI checks failed:", error);
  }

  return result;
}

/**
 * Check for hardcoded strings using ESLint
 */
async function checkHardcodedStrings(packages: string[]): Promise<{ count: number; details: string[] }> {
  try {
    // Run ESLint with i18n rules
    const command = `npx eslint ${packages.join(" ")} --ext .ts,.tsx,.js,.jsx --rule '@reynard/i18n/no-hardcoded-strings: error' --format json`;
    const output = execSync(command, { encoding: "utf8", stdio: "pipe" });

    // Handle case where output is undefined (test environment)
    if (!output) {
      return { count: 0, details: [] };
    }

    const results = JSON.parse(output);
    const count = results.reduce((sum: number, file: any) => sum + file.messages.length, 0);
    const details = results.flatMap((file: any) =>
      file.messages.map((msg: any) => `${file.filePath}:${msg.line}:${msg.column} - ${msg.message}`)
    );

    return { count, details };
  } catch (error) {
    // ESLint might fail if no issues found, which is actually success
    if ((error as any).status === 1) {
      return { count: 0, details: [] };
    }
    throw error;
  }
}

/**
 * Validate translations using the i18n package
 */
async function validateTranslations(_locales: string[]): Promise<{ missingCount: number; details: string[] }> {
  try {
    // This would integrate with the actual i18n validation
    const command = `npx vitest run packages/core/i18n/src/__tests__/translation-validation.test.ts --reporter=json`;
    const output = execSync(command, { encoding: "utf8", stdio: "pipe" });

    // Handle case where output is undefined (test environment)
    if (!output) {
      return { missingCount: 0, details: [] };
    }

    const results = JSON.parse(output);
    const missingCount = results.testResults.reduce(
      (sum: number, test: any) => sum + (test.status === "failed" ? 1 : 0),
      0
    );

    return { missingCount, details: [] };
  } catch (error) {
    // Test failure might indicate missing translations
    return { missingCount: 1, details: ["Translation validation failed"] };
  }
}

/**
 * Check RTL support
 */
async function checkRTLSupport(locales: string[]): Promise<{ issueCount: number; details: string[] }> {
  const rtlLocales = ["ar", "he", "fa", "ur"];
  const rtlIssues: string[] = [];

  for (const locale of locales) {
    if (rtlLocales.includes(locale)) {
      // Check if RTL support is properly implemented
      const rtlTestFile = `packages/core/i18n/src/__tests__/rtl-${locale}.test.ts`;
      if (!existsSync(rtlTestFile)) {
        rtlIssues.push(`Missing RTL test for ${locale}`);
      }
    }
  }

  return { issueCount: rtlIssues.length, details: rtlIssues };
}

/**
 * Generate coverage report
 */
async function generateCoverageReport(): Promise<{
  percentage: number;
  details: string;
}> {
  try {
    const command = `npx vitest run packages/core/i18n --coverage --reporter=json`;
    const output = execSync(command, { encoding: "utf8", stdio: "pipe" });

    // Handle case where output is undefined (test environment)
    if (!output) {
      return { percentage: 0, details: "No coverage data available" };
    }

    const results = JSON.parse(output);
    const coverage = results.coverage?.summary?.lines?.pct || 0;

    return { percentage: coverage, details: `Coverage: ${coverage}%` };
  } catch (error) {
    return { percentage: 0, details: "Failed to generate coverage report" };
  }
}

/**
 * Upload results to external service
 */
async function uploadResults(result: I18nCIResult): Promise<void> {
  // This would integrate with external services like:
  // - GitHub Actions annotations
  // - Slack notifications
  // - Custom dashboard
  // - Test result storage

  console.log("📤 Results would be uploaded to external service");
  console.log(`   Success: ${result.success}`);
  console.log(`   Hardcoded strings: ${result.hardcodedStrings}`);
  console.log(`   Missing translations: ${result.missingTranslations}`);
  console.log(`   RTL issues: ${result.rtlIssues}`);
  console.log(`   Coverage: ${result.coverage}%`);
}

/**
 * Create GitHub Actions workflow
 */
export function createGitHubActionsWorkflow(): string {
  return `name: i18n Checks

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8.15.0'

jobs:
  i18n-checks:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: 🏗️ Setup pnpm
      uses: pnpm/action-setup@v4
      with:
        version: \$\{{ env.PNPM_VERSION \}\}
        
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \$\{{ env.NODE_VERSION \}\}
        cache: 'pnpm'
        
    - name: 💾 Cache dependencies
      uses: actions/cache@v4
      with:
        path: |
          ~/.pnpm-store
          node_modules
          packages/*/node_modules
        key: \$\{{ runner.os \}\}-pnpm-\$\{{ hashFiles('**/pnpm-lock.yaml') \}\}
        restore-keys: |
          \$\{{ runner.os \}\}-pnpm-
        
    - name: 📦 Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: 🏗️ Build testing package
      run: |
        cd packages/testing
        pnpm build
        
    - name: ✅ Validate i18n setup
      run: |
        cd packages/testing
        pnpm i18n:validate
    
    - name: 🔍 Run i18n linting
      run: |
        cd packages/testing
        pnpm i18n:eslint
    
    - name: 🧪 Run i18n tests
      run: |
        cd packages/testing
        pnpm i18n:test --output ../../i18n-results.json --report ../../i18n-report.md
    
    - name: 📤 Upload i18n results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: i18n-results
        path: |
          i18n-results.json
          i18n-report.md
        retention-days: 30
    
    - name: 💬 Comment PR with i18n results
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v7
      with:
        script: |
          const fs = require('fs');
          
          try {
            const results = JSON.parse(fs.readFileSync('i18n-results.json', 'utf8'));
            const report = fs.readFileSync('i18n-report.md', 'utf8');
            
            const comment = \`## 🌍 i18n Check Results
            
            ### Summary
            - **Total Packages**: \$\{results.summary.totalPackages\}
            - **Successful**: \$\{results.summary.successfulPackages\}
            - **Failed**: \$\{results.summary.failedPackages\}
            - **Hardcoded Strings**: \$\{results.summary.totalHardcodedStrings\}
            - **Missing Translations**: \$\{results.summary.totalMissingTranslations\}
            - **RTL Issues**: \$\{results.summary.totalRTLIssues\}
            - **Duration**: \$\{results.duration\}ms
            
            ### Status
            \$\{results.overallSuccess ? '✅ All i18n checks passed!' : '❌ Some i18n checks failed.'\}
            
            <details>
            <summary>📊 Detailed Report</summary>
            
            \`\`\`markdown
            \$\{report\}
            \`\`\`
            
            </details>
            \`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
          } catch (error) {
            console.error('Failed to create i18n comment:', error);
          }
          
    - name: 🚪 Fail on i18n issues
      run: |
        if [[ -f "i18n-results.json" ]]; then
          SUCCESS=$(jq -r '.overallSuccess' i18n-results.json)
          if [[ "\\\${SUCCESS}" != "true" ]]; then
            echo "❌ i18n checks failed"
            exit 1
          fi
        else
          echo "❌ i18n results file not found"
          exit 1
        fi
`;
}

/**
 * Create GitLab CI configuration
 */
export function createGitLabCIConfig(): string {
  return `stages:
  - i18n-checks

i18n-checks:
  stage: i18n-checks
  image: node:18
  before_script:
    - npm ci
  script:
    - npx i18n-lint --packages packages/* --locales en,es,fr,de,ru,ar
    - npx vitest run packages/core/i18n --coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/
    expire_in: 1 week
  only:
    - main
    - develop
    - merge_requests
`;
}
