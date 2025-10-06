/**
 * @fileoverview Vitest Database Reporter
 *
 * 🦦 *splashes with database integration enthusiasm* Custom Vitest reporter
 * that stores test results directly in the reynard_e2e PostgreSQL database.
 *
 * This reporter integrates with the TestingEcosystemService to provide
 * centralized test result storage and analysis.
 *
 * @author Quality-Otter-15 (Reynard Otter Specialist)
 * @since 1.0.0
 */

import type { Reporter } from "vitest/reporters";
import type { RunnerTask, RunnerTestCase, RunnerTestSuite } from "vitest";

// File type is deprecated in newer Vitest versions
// Based on usage patterns, File has at least these properties:
interface File {
  filepath: string;
  tasks: RunnerTask[];
}
import { writeFileSync } from "fs";
import { join } from "path";

export interface VitestDBReporterOptions {
  /** Base URL for the testing ecosystem API */
  apiBaseUrl?: string;
  /** Environment name (default: process.env.NODE_ENV || 'development') */
  environment?: string;
  /** Git branch name (default: process.env.GIT_BRANCH || 'unknown') */
  branch?: string;
  /** Git commit hash (default: process.env.GIT_COMMIT || 'unknown') */
  commit?: string;
  /** Test suite name (default: 'vitest') */
  testSuite?: string;
  /** Whether to store individual test results (default: true) */
  storeIndividualTests?: boolean;
  /** Whether to store coverage data (default: true) */
  storeCoverage?: boolean;
  /** Whether to store performance metrics (default: true) */
  storePerformance?: boolean;
}

export interface TestRunData {
  runId: string;
  testType: string;
  testSuite: string;
  environment: string;
  branch: string;
  commit: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  startTime: string;
  endTime: string;
  coverage?: any;
  performance?: any;
}

export interface TestResultData {
  testName: string;
  testFile: string;
  testClass?: string;
  testMethod?: string;
  status: "passed" | "failed" | "skipped" | "error";
  duration: number;
  startedAt: string;
  completedAt: string;
  errorMessage?: string;
  errorTraceback?: string;
  stdout?: string;
  stderr?: string;
  metadata?: Record<string, any>;
}

export class VitestDBReporter implements Reporter {
  private options: Required<VitestDBReporterOptions>;
  private testRunData: TestRunData | null = null;
  private testResults: TestResultData[] = [];
  private startTime: number = 0;
  private endTime: number = 0;

  constructor(options: VitestDBReporterOptions = {}) {
    console.log("🔧 VitestDBReporter constructor called");
    this.options = {
      apiBaseUrl: options.apiBaseUrl || "http://localhost:8000",
      environment: options.environment || process.env.NODE_ENV || "development",
      branch: options.branch || process.env.GIT_BRANCH || "unknown",
      commit: options.commit || process.env.GIT_COMMIT || "unknown",
      testSuite: options.testSuite || "vitest",
      storeIndividualTests: options.storeIndividualTests ?? true,
      storeCoverage: options.storeCoverage ?? true,
      storePerformance: options.storePerformance ?? true,
    };
    console.log("🔧 VitestDBReporter constructor completed with options:", this.options);

    // Add a small delay to see if the reporter is being registered
    setTimeout(() => {
      console.log("🔧 VitestDBReporter timeout - checking if reporter is registered");
    }, 1000);
  }

  onInit(vitest: any) {
    console.log("🦦 Vitest DB Reporter initialized");
  }

  onTestRunStart(specifications: readonly any[]) {
    console.log("🚀 onTestRunStart called with", specifications.length, "specifications");
    this.startTime = Date.now();
    const runId = this.generateRunId();

    this.testRunData = {
      runId,
      testType: "vitest",
      testSuite: this.options.testSuite,
      environment: this.options.environment,
      branch: this.options.branch,
      commit: this.options.commit,
      totalTests: 0, // Will be updated as tests run
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      duration: 0,
      startTime: new Date(this.startTime).toISOString(),
      endTime: "",
      coverage: undefined,
      performance: undefined,
    };

    console.log(`🦦 Starting Vitest run: ${runId}`);
  }

  onTestModuleQueued(testModule: any) {
    console.log("📋 onTestModuleQueued called for", testModule.moduleId || "unknown module");
  }

  onTestModuleCollected(testModule: any) {
    console.log("📦 onTestModuleCollected called for", testModule.moduleId || "unknown module");
  }

  onTestModuleStart(testModule: any) {
    console.log("▶️ onTestModuleStart called for", testModule.moduleId || "unknown module");
  }

  onTestModuleEnd(testModule: any) {
    console.log("⏹️ onTestModuleEnd called for", testModule.moduleId || "unknown module");
  }

  onTestCaseReady(testCase: any) {
    console.log("🧪 onTestCaseReady called for", testCase.name || "unnamed test");
  }

  onTestCaseResult(testCase: any) {
    console.log(
      "✅ onTestCaseResult called for",
      testCase.name || "unnamed test",
      "result:",
      testCase.result()?.state || "unknown"
    );
    if (this.testRunData) {
      this.testRunData.totalTests++;
      const result = testCase.result();
      if (result?.state === "passed") {
        this.testRunData.passedTests++;
      } else if (result?.state === "failed") {
        this.testRunData.failedTests++;
      } else if (result?.state === "skipped") {
        this.testRunData.skippedTests++;
      }
    }
  }

  onTestRunEnd(testModules: readonly any[], unhandledErrors: readonly any[], reason: any) {
    console.log(
      "🏁 onTestRunEnd called with",
      testModules.length,
      "modules,",
      unhandledErrors.length,
      "errors, reason:",
      reason
    );
    this.endTime = Date.now();
    this.storeResultsInDatabase([]);
  }

  onFinished(files: File[]) {
    console.log("🏁 onFinished called with", files.length, "files");
    this.endTime = Date.now();

    if (!this.testRunData) {
      console.warn("⚠️ No test run data available");
      return;
    }

    // Calculate final statistics
    this.testRunData.duration = this.endTime - this.startTime;
    this.testRunData.endTime = new Date(this.endTime).toISOString();

    const stats = this.calculateStats(files);
    this.testRunData.passedTests = stats.passed;
    this.testRunData.failedTests = stats.failed;
    this.testRunData.skippedTests = stats.skipped;

    console.log(`🦦 Vitest run completed: ${this.testRunData.runId}`);
    console.log(`✅ Passed: ${this.testRunData.passedTests}`);
    console.log(`❌ Failed: ${this.testRunData.failedTests}`);
    console.log(`⏭️ Skipped: ${this.testRunData.skippedTests}`);
    console.log(`⏱️ Duration: ${this.testRunData.duration}ms`);

    // Store results in database
    this.storeResultsInDatabase(files);
  }

  private generateRunId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const random = Math.random().toString(36).substring(2, 8);
    return `vitest_${timestamp}_${random}`;
  }

  private countTests(files: File[]): number {
    let count = 0;
    for (const file of files) {
      for (const task of file.tasks) {
        count += this.countTestsInTask(task);
      }
    }
    return count;
  }

  private countTestsInTask(task: RunnerTask): number {
    if (task.type === "test") {
      return 1;
    }
    if (task.type === "suite") {
      let count = 0;
      for (const child of task.tasks) {
        count += this.countTestsInTask(child);
      }
      return count;
    }
    return 0;
  }

  private calculateStats(files: File[]): { passed: number; failed: number; skipped: number } {
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const file of files) {
      for (const task of file.tasks) {
        const stats = this.calculateStatsInTask(task);
        passed += stats.passed;
        failed += stats.failed;
        skipped += stats.skipped;
      }
    }

    return { passed, failed, skipped };
  }

  private calculateStatsInTask(task: RunnerTask): { passed: number; failed: number; skipped: number } {
    if (task.type === "test") {
      const test = task as RunnerTestCase;
      if (test.result?.state === "pass") return { passed: 1, failed: 0, skipped: 0 };
      if (test.result?.state === "fail") return { passed: 0, failed: 1, skipped: 0 };
      if (test.result?.state === "skip") return { passed: 0, failed: 0, skipped: 1 };
      return { passed: 0, failed: 0, skipped: 0 };
    }

    if (task.type === "suite") {
      let passed = 0;
      let failed = 0;
      let skipped = 0;
      for (const child of task.tasks) {
        const stats = this.calculateStatsInTask(child);
        passed += stats.passed;
        failed += stats.failed;
        skipped += stats.skipped;
      }
      return { passed, failed, skipped };
    }

    return { passed: 0, failed: 0, skipped: 0 };
  }

  private async storeResultsInDatabase(files: File[]): Promise<void> {
    if (!this.testRunData) return;

    try {
      // Create test run
      const testRunResponse = await fetch(`${this.options.apiBaseUrl}/api/testing/test-runs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          run_id: this.testRunData.runId,
          test_type: this.testRunData.testType,
          test_suite: this.testRunData.testSuite,
          environment: this.testRunData.environment,
          branch: this.testRunData.branch,
          commit_hash: this.testRunData.commit,
          total_tests: this.testRunData.totalTests,
          passed_tests: this.testRunData.passedTests,
          failed_tests: this.testRunData.failedTests,
          skipped_tests: this.testRunData.skippedTests,
          metadata: {
            duration_ms: this.testRunData.duration,
            start_time: this.testRunData.startTime,
            end_time: this.testRunData.endTime,
            vitest_version: process.env.VITEST_VERSION || "unknown",
            node_version: process.version,
          },
        }),
      });

      if (!testRunResponse.ok) {
        throw new Error(`Failed to create test run: ${testRunResponse.statusText}`);
      }

      const testRun = await testRunResponse.json();
      console.log(`✅ Created test run: ${testRun.id}`);

      // Store individual test results if enabled
      if (this.options.storeIndividualTests) {
        await this.storeIndividualTestResults(testRun.id, files);
      }

      // Store coverage data if available
      if (this.options.storeCoverage && this.testRunData.coverage) {
        await this.storeCoverageData(testRun.id, this.testRunData.coverage);
      }

      // Store performance metrics if available
      if (this.options.storePerformance && this.testRunData.performance) {
        await this.storePerformanceMetrics(testRun.id, this.testRunData.performance);
      }

      // Update test run status to completed
      await fetch(`${this.options.apiBaseUrl}/api/testing/test-runs/${testRun.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      });

      console.log(`✅ Vitest results stored in database: ${this.testRunData.runId}`);
    } catch (error) {
      console.error(`❌ Failed to store Vitest results in database: ${error}`);

      // Fallback: store results in local file
      this.storeResultsInFile(files);
    }
  }

  private async storeIndividualTestResults(testRunId: string, files: File[]): Promise<void> {
    for (const file of files) {
      for (const task of file.tasks) {
        await this.storeTestResultsInTask(testRunId, task, file.filepath);
      }
    }
  }

  private async storeTestResultsInTask(testRunId: string, task: RunnerTask, filePath: string): Promise<void> {
    if (task.type === "test") {
      const test = task as RunnerTestCase;
      const result = test.result;

      if (!result) return;

      const testResult: TestResultData = {
        testName: test.name,
        testFile: filePath,
        testClass: this.extractTestClass(test.name),
        testMethod: this.extractTestMethod(test.name),
        status: this.mapTestStatus(result.state),
        duration: result.duration || 0,
        startedAt: new Date(this.startTime).toISOString(),
        completedAt: new Date(this.endTime).toISOString(),
        errorMessage: result.errors?.[0]?.message,
        errorTraceback: result.errors?.[0]?.stack,
        stdout: undefined, // stdout property removed in newer Vitest versions
        stderr: undefined, // stderr property removed in newer Vitest versions
        metadata: {
          file: filePath,
          line: undefined, // startLine property removed in newer Vitest versions
          column: undefined, // startColumn property removed in newer Vitest versions
        },
      };

      try {
        await fetch(`${this.options.apiBaseUrl}/api/testing/test-results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            test_run_id: testRunId,
            test_name: testResult.testName,
            test_file: testResult.testFile,
            test_class: testResult.testClass,
            test_method: testResult.testMethod,
            status: testResult.status,
            duration_ms: testResult.duration,
            started_at: testResult.startedAt,
            completed_at: testResult.completedAt,
            error_message: testResult.errorMessage,
            error_traceback: testResult.errorTraceback,
            stdout: testResult.stdout,
            stderr: testResult.stderr,
            metadata: testResult.metadata,
          }),
        });
      } catch (error) {
        console.warn(`⚠️ Failed to store test result for ${test.name}: ${error}`);
      }
    }

    if (task.type === "suite") {
      for (const child of task.tasks) {
        await this.storeTestResultsInTask(testRunId, child, filePath);
      }
    }
  }

  private async storeCoverageData(testRunId: string, coverage: any): Promise<void> {
    try {
      await fetch(`${this.options.apiBaseUrl}/api/testing/coverage-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_run_id: testRunId,
          coverage_type: "vitest",
          coverage_data: coverage,
          coverage_percentage: this.calculateCoveragePercentage(coverage),
          metadata: {
            tool: "vitest",
            version: process.env.VITEST_VERSION || "unknown",
          },
        }),
      });
    } catch (error) {
      console.warn(`⚠️ Failed to store coverage data: ${error}`);
    }
  }

  private async storePerformanceMetrics(testRunId: string, performance: any): Promise<void> {
    try {
      await fetch(`${this.options.apiBaseUrl}/api/testing/performance-metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_run_id: testRunId,
          metric_name: "vitest_performance",
          metric_type: "performance",
          value: performance.duration || 0,
          unit: "ms",
          metadata: {
            tool: "vitest",
            memory_usage: performance.memory || 0,
            cpu_usage: performance.cpu || 0,
          },
        }),
      });
    } catch (error) {
      console.warn(`⚠️ Failed to store performance metrics: ${error}`);
    }
  }

  private storeResultsInFile(files: File[]): void {
    const outputPath = join(process.cwd(), ".vitest-reports", `${this.testRunData?.runId}.json`);

    const report = {
      testRun: this.testRunData,
      testResults: this.testResults,
      files: files.map(file => ({
        filepath: file.filepath,
        tasks: this.serializeTasks(file.tasks),
      })),
    };

    writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📁 Fallback: Results stored in file: ${outputPath}`);
  }

  private serializeTasks(tasks: RunnerTask[]): any[] {
    return tasks.map(task => {
      switch (task.type) {
        case "test": {
          const test = task as RunnerTestCase;
          return {
            type: "test",
            name: test.name,
            result: test.result
              ? {
                  state: test.result.state,
                  duration: test.result.duration,
                  errors: test.result.errors,
                }
              : null,
          };
        }

        case "suite": {
          const suite = task as RunnerTestSuite;
          return {
            type: "suite",
            name: suite.name,
            tasks: this.serializeTasks(suite.tasks),
          };
        }

        default: {
          return {
            type: (task as any).type || "unknown",
            name: (task as any).name || "unknown",
          };
        }
      }
    });
  }

  private extractTestClass(testName: string): string | undefined {
    // Extract class name from test name like "MyClass.method()"
    const match = testName.match(/^([^.]+)\./);
    return match ? match[1] : undefined;
  }

  private extractTestMethod(testName: string): string | undefined {
    // Extract method name from test name like "MyClass.method()"
    const match = testName.match(/\.([^(]+)\(/);
    return match ? match[1] : undefined;
  }

  private mapTestStatus(state: string): "passed" | "failed" | "skipped" | "error" {
    switch (state) {
      case "pass":
        return "passed";
      case "fail":
        return "failed";
      case "skip":
        return "skipped";
      default:
        return "error";
    }
  }

  private calculateCoveragePercentage(coverage: any): number {
    // Simple coverage percentage calculation
    if (!coverage || typeof coverage !== "object") return 0;

    const keys = Object.keys(coverage);
    if (keys.length === 0) return 0;

    let totalLines = 0;
    let coveredLines = 0;

    for (const key of keys) {
      const fileCoverage = coverage[key];
      if (fileCoverage && typeof fileCoverage === "object") {
        totalLines += fileCoverage.totalLines || 0;
        coveredLines += fileCoverage.coveredLines || 0;
      }
    }

    return totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;
  }
}

export default VitestDBReporter;
