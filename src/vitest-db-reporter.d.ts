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
import type { RunnerTask } from "vitest";
interface File {
    filepath: string;
    tasks: RunnerTask[];
}
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
export declare class VitestDBReporter implements Reporter {
    private options;
    private testRunData;
    private testResults;
    private startTime;
    private endTime;
    constructor(options?: VitestDBReporterOptions);
    onInit(vitest: any): void;
    onTestRunStart(specifications: readonly any[]): void;
    onTestModuleQueued(testModule: any): void;
    onTestModuleCollected(testModule: any): void;
    onTestModuleStart(testModule: any): void;
    onTestModuleEnd(testModule: any): void;
    onTestCaseReady(testCase: any): void;
    onTestCaseResult(testCase: any): void;
    onTestRunEnd(testModules: readonly any[], unhandledErrors: readonly any[], reason: any): void;
    onFinished(files: File[]): void;
    private generateRunId;
    private countTests;
    private countTestsInTask;
    private calculateStats;
    private calculateStatsInTask;
    private storeResultsInDatabase;
    private storeIndividualTestResults;
    private storeTestResultsInTask;
    private storeCoverageData;
    private storePerformanceMetrics;
    private storeResultsInFile;
    private serializeTasks;
    private extractTestClass;
    private extractTestMethod;
    private mapTestStatus;
    private calculateCoveragePercentage;
}
export default VitestDBReporter;
