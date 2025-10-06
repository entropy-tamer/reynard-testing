/**
 * @fileoverview Vitest Post-Test Hook
 *
 * 🦦 *splashes with database integration enthusiasm* Post-test hook
 * that captures test results and stores them in the reynard_e2e PostgreSQL database.
 *
 * This hook runs after each test and sends results to the TestingEcosystemService.
 *
 * @author Quality-Otter-15 (Reynard Otter Specialist)
 * @since 1.0.0
 */

interface TestResult {
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

interface TestResultData {
  testRunId: string;
  testName: string;
  testFile: string;
  testSuite: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  errorMessage?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

class VitestPostTestHook {
  private options: {
    apiBaseUrl: string;
    environment: string;
    branch: string;
    commit: string;
    testSuite: string;
  };
  private testRunData: TestResult | null = null;
  private testResults: TestResultData[] = [];
  private startTime: number = 0;
  private endTime: number = 0;

  constructor(
    options: {
      apiBaseUrl?: string;
      environment?: string;
      branch?: string;
      commit?: string;
      testSuite?: string;
    } = {}
  ) {
    this.options = {
      apiBaseUrl: options.apiBaseUrl || "http://localhost:8000",
      environment: options.environment || process.env.NODE_ENV || "development",
      branch: options.branch || process.env.GIT_BRANCH || "unknown",
      commit: options.commit || process.env.GIT_COMMIT || "unknown",
      testSuite: options.testSuite || "vitest",
    };
  }

  private generateRunId(): string {
    return `vitest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async storeResultsInDatabase(): Promise<void> {
    if (!this.testRunData) {
      console.warn("⚠️ No test run data available");
      return;
    }

    try {
      console.log(`🦦 Storing test results in database: ${this.testRunData.runId}`);

      // Store test run
      const testRunResponse = await fetch(`${this.options.apiBaseUrl}/api/testing/test-runs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.testRunData),
      });

      if (!testRunResponse.ok) {
        throw new Error(`Failed to store test run: ${testRunResponse.status} ${testRunResponse.statusText}`);
      }

      const testRun = await testRunResponse.json();
      console.log(`✅ Test run stored: ${testRun.id}`);

      // Store individual test results
      if (this.testResults.length > 0) {
        for (const testResult of this.testResults) {
          const testResultResponse = await fetch(`${this.options.apiBaseUrl}/api/testing/test-results`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(testResult),
          });

          if (!testResultResponse.ok) {
            console.warn(`⚠️ Failed to store test result for ${testResult.testName}: ${testResultResponse.status}`);
          }
        }
        console.log(`✅ Stored ${this.testResults.length} individual test results`);
      }
    } catch (error) {
      console.error("❌ Failed to store test results in database:", error);
    }
  }

  // Hook to run before all tests
  async beforeAll() {
    console.log("🦦 Vitest Post-Test Hook: Starting test run");
    this.startTime = Date.now();
    const runId = this.generateRunId();

    this.testRunData = {
      runId,
      testType: "vitest",
      testSuite: this.options.testSuite,
      environment: this.options.environment,
      branch: this.options.branch,
      commit: this.options.commit,
      totalTests: 0,
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

  // Hook to run after each test
  async afterEach(test: any, result: any) {
    if (!this.testRunData) return;

    this.testRunData.totalTests++;

    const testResult: TestResultData = {
      testRunId: this.testRunData.runId,
      testName: test.name || "unnamed test",
      testFile: test.file || "unknown file",
      testSuite: this.options.testSuite,
      status: result.state === "pass" ? "passed" : result.state === "fail" ? "failed" : "skipped",
      duration: result.duration || 0,
      errorMessage: result.errors?.[0]?.message,
      stackTrace: result.errors?.[0]?.stack,
      metadata: {
        testType: "vitest",
        environment: this.options.environment,
      },
    };

    this.testResults.push(testResult);

    if (result.state === "pass") {
      this.testRunData.passedTests++;
    } else if (result.state === "fail") {
      this.testRunData.failedTests++;
    } else {
      this.testRunData.skippedTests++;
    }

    console.log(`✅ Test result captured: ${testResult.testName} - ${testResult.status}`);
  }

  // Hook to run after all tests
  async afterAll() {
    console.log("🦦 Vitest Post-Test Hook: Finishing test run");
    this.endTime = Date.now();

    if (this.testRunData) {
      this.testRunData.duration = this.endTime - this.startTime;
      this.testRunData.endTime = new Date(this.endTime).toISOString();

      console.log(
        `📊 Test run summary: ${this.testRunData.totalTests} tests, ${this.testRunData.passedTests} passed, ${this.testRunData.failedTests} failed, ${this.testRunData.skippedTests} skipped`
      );

      await this.storeResultsInDatabase();
    }
  }
}

// Create and export the hook instance
const vitestPostTestHook = new VitestPostTestHook({
  apiBaseUrl: process.env.TESTING_API_BASE_URL || "http://localhost:8000",
  environment: process.env.NODE_ENV || "development",
  branch: process.env.GIT_BRANCH || "unknown",
  commit: process.env.GIT_COMMIT || "unknown",
  testSuite: "global-vitest",
});

export default vitestPostTestHook;
