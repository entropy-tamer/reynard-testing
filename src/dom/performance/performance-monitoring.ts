/**
 * Performance Monitoring for Unified DOM Testing
 *
 * Provides comprehensive performance testing capabilities including DOM mutation
 * tracking, render performance monitoring, and memory leak detection.
 *
 * @author 🦊 The Cunning Fox
 */

import { Page } from "@playwright/test";
import { DOMTestEnvironment } from "../unified-dom-assertions";

/**
 * DOM mutation record
 */
export interface MutationRecord {
  type: "childList" | "attributes" | "characterData";
  target: Node;
  addedNodes: NodeList;
  removedNodes: NodeList;
  attributeName: string | null;
  oldValue: string | null;
}

/**
 * DOM mutation summary
 */
export interface MutationSummary {
  totalMutations: number;
  addedNodes: number;
  removedNodes: number;
  attributeChanges: number;
  textChanges: number;
  mutationsByType: Record<string, number>;
  mutationsByElement: Record<string, number>;
  averageMutationsPerSecond: number;
  peakMutationsPerSecond: number;
}

/**
 * Render performance metrics
 */
export interface RenderMetrics {
  renderTime: number;
  memoryDelta: number;
  timestamp: number;
  elementCount: number;
  domSize: number;
}

/**
 * Performance report
 */
export interface PerformanceReport {
  averageRenderTime: number;
  minRenderTime: number;
  maxRenderTime: number;
  averageMemoryDelta: number;
  totalMemoryDelta: number;
  performanceScore: number;
  recommendations: string[];
  metrics: RenderMetrics[];
}

/**
 * Memory leak detection result
 */
export interface MemoryLeakResult {
  hasLeak: boolean;
  leakScore: number;
  memoryGrowth: number;
  recommendations: string[];
  snapshots: Array<{
    timestamp: number;
    memory: number;
    elementCount: number;
  }>;
}

/**
 * DOM Mutation Tracker
 */
export class DOMMutationTracker {
  private observer: MutationObserver | null = null;
  private mutations: MutationRecord[] = [];
  private startTime: number = 0;
  private isTracking: boolean = false;

  /**
   * Start tracking DOM mutations
   */
  startTracking(): void {
    if (this.isTracking) {
      throw new Error("Mutation tracking is already active");
    }

    this.mutations = [];
    this.startTime = Date.now();
    this.isTracking = true;

    this.observer = new MutationObserver(mutations => {
      this.mutations.push(...mutations);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      attributeFilter: undefined, // Track all attributes
    });
  }

  /**
   * Stop tracking and get summary
   */
  stopTracking(): MutationSummary {
    if (!this.isTracking) {
      throw new Error("Mutation tracking is not active");
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    const summary = this.analyzeMutations();
    this.isTracking = false;

    return summary;
  }

  /**
   * Get current mutation count
   */
  getCurrentMutationCount(): number {
    return this.mutations.length;
  }

  /**
   * Check if tracking is active
   */
  isActive(): boolean {
    return this.isTracking;
  }

  private analyzeMutations(): MutationSummary {
    const totalTime = Date.now() - this.startTime;
    const mutationsByType: Record<string, number> = {};
    const mutationsByElement: Record<string, number> = {};

    let addedNodes = 0;
    let removedNodes = 0;
    let attributeChanges = 0;
    let textChanges = 0;

    for (const mutation of this.mutations) {
      // Count by type
      mutationsByType[mutation.type] = (mutationsByType[mutation.type] || 0) + 1;

      // Count by element
      const elementName = mutation.target.nodeName;
      mutationsByElement[elementName] = (mutationsByElement[elementName] || 0) + 1;

      // Count specific changes
      if (mutation.type === "childList") {
        addedNodes += mutation.addedNodes.length;
        removedNodes += mutation.removedNodes.length;
      } else if (mutation.type === "attributes") {
        attributeChanges++;
      } else if (mutation.type === "characterData") {
        textChanges++;
      }
    }

    const averageMutationsPerSecond = totalTime > 0 ? (this.mutations.length / totalTime) * 1000 : 0;
    const peakMutationsPerSecond = this.calculatePeakMutationsPerSecond();

    return {
      totalMutations: this.mutations.length,
      addedNodes,
      removedNodes,
      attributeChanges,
      textChanges,
      mutationsByType,
      mutationsByElement,
      averageMutationsPerSecond,
      peakMutationsPerSecond,
    };
  }

  private calculatePeakMutationsPerSecond(): number {
    if (this.mutations.length === 0) return 0;

    const timeWindow = 1000; // 1 second window
    let maxMutations = 0;
    let currentMutations = 0;
    let windowStart = 0;

    for (let i = 0; i < this.mutations.length; i++) {
      const mutationTime = Date.now() - this.startTime;

      // Remove mutations outside the time window
      while (windowStart < i && mutationTime - (Date.now() - this.startTime) > timeWindow) {
        currentMutations--;
        windowStart++;
      }

      currentMutations++;
      maxMutations = Math.max(maxMutations, currentMutations);
    }

    return maxMutations;
  }
}

/**
 * Render Performance Testing
 */
export class RenderPerformanceTesting {
  constructor() {}

  /**
   * Measure render time for a function
   */
  async measureRenderTime(renderFunction: () => Promise<void>): Promise<RenderMetrics> {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const startElementCount = document.querySelectorAll("*").length;
    const startDOMSize = this.calculateDOMSize();

    await renderFunction();

    const endTime = performance.now();
    const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const endElementCount = document.querySelectorAll("*").length;
    const endDOMSize = this.calculateDOMSize();

    return {
      renderTime: endTime - startTime,
      memoryDelta: endMemory - startMemory,
      timestamp: Date.now(),
      elementCount: endElementCount - startElementCount,
      domSize: endDOMSize - startDOMSize,
    };
  }

  /**
   * Test render performance with multiple iterations
   */
  async testRenderPerformance(
    iterations: number = 10,
    renderFunction: () => Promise<void>
  ): Promise<PerformanceReport> {
    const metrics: RenderMetrics[] = [];

    for (let i = 0; i < iterations; i++) {
      const metric = await this.measureRenderTime(renderFunction);
      metrics.push(metric);

      // Small delay between iterations
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return this.analyzePerformanceMetrics(metrics);
  }

  /**
   * Test memory usage over time
   */
  async testMemoryUsage(duration: number = 10000, interval: number = 1000): Promise<MemoryLeakResult> {
    const snapshots: Array<{ timestamp: number; memory: number; elementCount: number }> = [];
    const startTime = Date.now();

    return new Promise(resolve => {
      const intervalId = setInterval(() => {
        const memory = (performance as any).memory?.usedJSHeapSize || 0;
        const elementCount = document.querySelectorAll("*").length;

        snapshots.push({
          timestamp: Date.now() - startTime,
          memory,
          elementCount,
        });

        if (Date.now() - startTime >= duration) {
          clearInterval(intervalId);
          const result = this.analyzeMemoryLeaks(snapshots);
          resolve(result);
        }
      }, interval);
    });
  }

  /**
   * Test DOM manipulation performance
   */
  async testDOMManipulationPerformance(operations: number = 1000): Promise<RenderMetrics> {
    return await this.measureRenderTime(async () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      for (let i = 0; i < operations; i++) {
        const element = document.createElement("div");
        element.textContent = `Element ${i}`;
        container.appendChild(element);
      }

      // Clean up
      document.body.removeChild(container);
    });
  }

  /**
   * Test event handling performance
   */
  async testEventHandlingPerformance(events: number = 1000): Promise<RenderMetrics> {
    return await this.measureRenderTime(async () => {
      const element = document.createElement("div");
      document.body.appendChild(element);

      let eventCount = 0;
      const eventHandler = () => {
        eventCount++;
      };

      element.addEventListener("click", eventHandler);

      for (let i = 0; i < events; i++) {
        element.click();
      }

      element.removeEventListener("click", eventHandler);
      document.body.removeChild(element);
    });
  }

  private calculateDOMSize(): number {
    return new XMLSerializer().serializeToString(document).length;
  }

  private analyzePerformanceMetrics(metrics: RenderMetrics[]): PerformanceReport {
    const renderTimes = metrics.map(m => m.renderTime);
    const memoryDeltas = metrics.map(m => m.memoryDelta);

    const averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const minRenderTime = Math.min(...renderTimes);
    const maxRenderTime = Math.max(...renderTimes);
    const averageMemoryDelta = memoryDeltas.reduce((a, b) => a + b, 0) / memoryDeltas.length;
    const totalMemoryDelta = memoryDeltas.reduce((a, b) => a + b, 0);

    // Calculate performance score (0-100)
    const performanceScore = this.calculatePerformanceScore(averageRenderTime, averageMemoryDelta);

    // Generate recommendations
    const recommendations = this.generateRecommendations(averageRenderTime, averageMemoryDelta, performanceScore);

    return {
      averageRenderTime,
      minRenderTime,
      maxRenderTime,
      averageMemoryDelta,
      totalMemoryDelta,
      performanceScore,
      recommendations,
      metrics,
    };
  }

  private analyzeMemoryLeaks(
    snapshots: Array<{ timestamp: number; memory: number; elementCount: number }>
  ): MemoryLeakResult {
    if (snapshots.length < 2) {
      return {
        hasLeak: false,
        leakScore: 0,
        memoryGrowth: 0,
        recommendations: ["Insufficient data to detect memory leaks"],
        snapshots,
      };
    }

    const firstSnapshot = snapshots[0];
    const lastSnapshot = snapshots[snapshots.length - 1];

    const memoryGrowth = lastSnapshot.memory - firstSnapshot.memory;
    const elementGrowth = lastSnapshot.elementCount - firstSnapshot.elementCount;

    // Calculate leak score (0-100)
    const leakScore = this.calculateLeakScore(memoryGrowth, elementGrowth, snapshots.length);

    // Determine if there's a leak
    const hasLeak = leakScore > 50;

    // Generate recommendations
    const recommendations = this.generateMemoryLeakRecommendations(hasLeak, memoryGrowth, elementGrowth);

    return {
      hasLeak,
      leakScore,
      memoryGrowth,
      recommendations,
      snapshots,
    };
  }

  private calculatePerformanceScore(averageRenderTime: number, averageMemoryDelta: number): number {
    // Normalize render time (assume 100ms is perfect, 1000ms is poor)
    const renderScore = Math.max(0, 100 - averageRenderTime / 10);

    // Normalize memory delta (assume 0MB is perfect, 10MB is poor)
    const memoryScore = Math.max(0, 100 - averageMemoryDelta / 100000); // Convert bytes to MB

    return Math.round((renderScore + memoryScore) / 2);
  }

  private calculateLeakScore(memoryGrowth: number, elementGrowth: number, snapshotCount: number): number {
    // Memory growth per snapshot
    const memoryGrowthPerSnapshot = memoryGrowth / snapshotCount;

    // Element growth per snapshot
    const elementGrowthPerSnapshot = elementGrowth / snapshotCount;

    // Calculate leak score based on growth rates
    let leakScore = 0;

    if (memoryGrowthPerSnapshot > 100000) {
      // 100KB per snapshot
      leakScore += 40;
    }

    if (elementGrowthPerSnapshot > 10) {
      // 10 elements per snapshot
      leakScore += 30;
    }

    if (memoryGrowth > 1000000) {
      // 1MB total growth
      leakScore += 30;
    }

    return Math.min(100, leakScore);
  }

  private generateRecommendations(
    averageRenderTime: number,
    averageMemoryDelta: number,
    performanceScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (averageRenderTime > 100) {
      recommendations.push("Consider optimizing render performance - average render time is high");
    }

    if (averageMemoryDelta > 1000000) {
      // 1MB
      recommendations.push("Consider optimizing memory usage - high memory delta detected");
    }

    if (performanceScore < 70) {
      recommendations.push("Overall performance score is low - consider comprehensive optimization");
    }

    if (recommendations.length === 0) {
      recommendations.push("Performance is within acceptable limits");
    }

    return recommendations;
  }

  private generateMemoryLeakRecommendations(hasLeak: boolean, memoryGrowth: number, elementGrowth: number): string[] {
    const recommendations: string[] = [];

    if (hasLeak) {
      recommendations.push("Memory leak detected - investigate event listeners and DOM references");

      if (memoryGrowth > 0) {
        recommendations.push("High memory growth detected - check for unremoved event listeners");
      }

      if (elementGrowth > 0) {
        recommendations.push("DOM elements are not being properly cleaned up");
      }
    } else {
      recommendations.push("No memory leaks detected");
    }

    return recommendations;
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitoringUtils {
  /**
   * Get current memory usage
   */
  static getCurrentMemoryUsage(): number {
    return (performance as any).memory?.usedJSHeapSize || 0;
  }

  /**
   * Get current DOM element count
   */
  static getCurrentElementCount(): number {
    return document.querySelectorAll("*").length;
  }

  /**
   * Get current DOM size in bytes
   */
  static getCurrentDOMSize(): number {
    return new XMLSerializer().serializeToString(document).length;
  }

  /**
   * Get performance timing information
   */
  static getPerformanceTiming(): PerformanceNavigationTiming | null {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return navigation || null;
  }

  /**
   * Get resource timing information
   */
  static getResourceTiming(): PerformanceResourceTiming[] {
    return performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  }

  /**
   * Get paint timing information
   */
  static getPaintTiming(): PerformancePaintTiming[] {
    return performance.getEntriesByType("paint") as PerformancePaintTiming[];
  }

  /**
   * Get layout shift information
   */
  static getLayoutShift(): PerformanceEntry[] {
    return performance.getEntriesByType("layout-shift");
  }

  /**
   * Get largest contentful paint
   */
  static getLargestContentfulPaint(): PerformanceEntry[] {
    return performance.getEntriesByType("largest-contentful-paint");
  }

  /**
   * Get first input delay
   */
  static getFirstInputDelay(): PerformanceEventTiming[] {
    return performance.getEntriesByType("first-input") as PerformanceEventTiming[];
  }

  /**
   * Get cumulative layout shift
   */
  static getCumulativeLayoutShift(): number {
    const layoutShifts = this.getLayoutShift();
    return layoutShifts.reduce((sum, entry) => {
      const layoutShiftEntry = entry as any;
      return sum + (layoutShiftEntry.value || 0);
    }, 0);
  }
}

/**
 * Create DOM mutation tracker
 */
export function createDOMMutationTracker(): DOMMutationTracker {
  return new DOMMutationTracker();
}

/**
 * Create render performance testing instance
 */
export function createRenderPerformanceTesting(_environment: DOMTestEnvironment, _page?: Page): RenderPerformanceTesting {
  return new RenderPerformanceTesting();
}

/**
 * Create performance monitoring utilities
 */
export function createPerformanceMonitoringUtils(): PerformanceMonitoringUtils {
  return new PerformanceMonitoringUtils();
}

/**
 * Measures the time taken for a given asynchronous operation.
 * @param operation The asynchronous function to measure.
 * @returns The duration in milliseconds.
 */
export async function measurePerformance(operation: () => Promise<void>): Promise<number> {
  const start = performance.now();
  await operation();
  const end = performance.now();
  return end - start;
}

/**
 * Tracks DOM mutations during an operation.
 * @param operation The asynchronous function during which to track mutations.
 * @returns The number of DOM mutations observed.
 */
export async function trackDOMMutations(operation: () => Promise<void>): Promise<number> {
  let mutationCount = 0;

  // In Happy DOM, MutationObserver might not work as expected
  // So we'll use a simpler approach for testing
  const initialElementCount = document.querySelectorAll("*").length;

  const observer = new MutationObserver(mutations => {
    mutationCount += mutations.length;
  });

  try {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    await operation();

    // If no mutations were detected by the observer,
    // check if the element count changed as a fallback
    if (mutationCount === 0) {
      const finalElementCount = document.querySelectorAll("*").length;
      if (finalElementCount !== initialElementCount) {
        mutationCount = Math.abs(finalElementCount - initialElementCount);
      }
    }
  } finally {
    observer.disconnect();
  }

  return mutationCount;
}

/**
 * Measures the memory usage before and after an operation (approximation for browser environments).
 * Note: `performance.memory` is a non-standard API and might not be available in all environments (e.g., Happy DOM).
 * @param operation The asynchronous function to measure memory usage for.
 * @returns The change in memory usage in bytes.
 */
export async function measureMemoryUsage(operation: () => Promise<void>): Promise<number> {
  // This is a simplified placeholder. Actual memory measurement is complex and environment-dependent.
  // In Node.js, process.memoryUsage() could be used. In browsers, performance.memory (non-standard)
  // or more advanced profiling tools are needed.
  console.warn("Memory usage tracking is a placeholder and provides an approximation.");

  const initialMemory = (globalThis as any).performance?.memory?.usedJSHeapSize || 0;
  await operation();
  const finalMemory = (globalThis as any).performance?.memory?.usedJSHeapSize || 0;

  return finalMemory - initialMemory;
}

/**
 * Calculates the total number of DOM elements in the document.
 * @returns The total number of DOM elements.
 */
export function getDOMElementCount(): number {
  return document.querySelectorAll("*").length;
}
