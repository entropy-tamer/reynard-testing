/**
 * @fileoverview Tracing Database Integration
 *
 * 🦦 *splashes with tracing enthusiasm* Centralized system for storing
 * performance and execution tracing data in the reynard_e2e database.
 *
 * This module provides utilities for collecting and storing various types
 * of tracing data including performance metrics, execution traces, and
 * debugging information.
 *
 * @author Quality-Otter-15 (Reynard Otter Specialist)
 * @since 1.0.0
 */

export interface TracingConfig {
  /** Base URL for the testing ecosystem API */
  apiBaseUrl?: string;
  /** Test run ID to associate traces with */
  testRunId?: string;
  /** Whether to enable automatic tracing collection */
  autoCollect?: boolean;
  /** Sampling rate for performance metrics (0.0 to 1.0) */
  samplingRate?: number;
  /** Maximum number of traces to store per test run */
  maxTraces?: number;
}

export interface PerformanceTrace {
  traceId: string;
  traceName: string;
  traceType: "performance" | "network" | "browser" | "custom";
  startTime: number;
  endTime: number;
  duration: number;
  metadata: Record<string, any>;
  data: Record<string, any>;
}

export interface NetworkTrace {
  traceId: string;
  url: string;
  method: string;
  statusCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  headers: Record<string, string>;
  metadata: Record<string, any>;
}

export interface BrowserTrace {
  traceId: string;
  action: string;
  selector?: string;
  duration: number;
  success: boolean;
  error?: string;
  screenshot?: string;
  metadata: Record<string, any>;
}

export class TracingDBIntegration {
  private config: Required<TracingConfig>;
  private traces: PerformanceTrace[] = [];
  private activeTraces: Map<string, number> = new Map();

  constructor(config: TracingConfig = {}) {
    this.config = {
      apiBaseUrl: config.apiBaseUrl || "http://localhost:8000",
      testRunId: config.testRunId || "",
      autoCollect: config.autoCollect ?? true,
      samplingRate: config.samplingRate ?? 1.0,
      maxTraces: config.maxTraces ?? 1000,
    };

    if (this.config.autoCollect) {
      this.setupAutomaticCollection();
    }
  }

  /**
   * 🦦 Start a performance trace
   */
  startTrace(traceName: string, traceType: PerformanceTrace["traceType"] = "performance"): string {
    const traceId = this.generateTraceId();
    const startTime = performance.now();

    this.activeTraces.set(traceId, startTime);

    // Store trace data
    const trace: PerformanceTrace = {
      traceId,
      traceName,
      traceType,
      startTime,
      endTime: 0,
      duration: 0,
      metadata: {
        startTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      data: {},
    };

    this.traces.push(trace);

    return traceId;
  }

  /**
   * 🦦 End a performance trace
   */
  endTrace(traceId: string, data: Record<string, any> = {}): void {
    const startTime = this.activeTraces.get(traceId);
    if (!startTime) {
      console.warn(`⚠️ Trace ${traceId} not found or already ended`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Update trace data
    const trace = this.traces.find(t => t.traceId === traceId);
    if (trace) {
      trace.endTime = endTime;
      trace.duration = duration;
      trace.data = { ...trace.data, ...data };
      trace.metadata.endTime = new Date().toISOString();
    }

    this.activeTraces.delete(traceId);

    // Auto-store if enabled
    if (this.config.autoCollect && this.shouldSample()) {
      this.storeTrace(traceId);
    }
  }

  /**
   * 🦦 Add network trace
   */
  addNetworkTrace(networkTrace: NetworkTrace): void {
    if (!this.shouldSample()) return;

    const trace: PerformanceTrace = {
      traceId: networkTrace.traceId,
      traceName: `${networkTrace.method} ${networkTrace.url}`,
      traceType: "network",
      startTime: performance.now() - networkTrace.responseTime,
      endTime: performance.now(),
      duration: networkTrace.responseTime,
      metadata: {
        ...networkTrace.metadata,
        url: networkTrace.url,
        method: networkTrace.method,
        statusCode: networkTrace.statusCode,
        requestSize: networkTrace.requestSize,
        responseSize: networkTrace.responseSize,
        headers: networkTrace.headers,
      },
      data: {
        networkTrace,
      },
    };

    this.traces.push(trace);

    if (this.config.autoCollect) {
      this.storeTrace(trace.traceId);
    }
  }

  /**
   * 🦦 Add browser trace
   */
  addBrowserTrace(browserTrace: BrowserTrace): void {
    if (!this.shouldSample()) return;

    const trace: PerformanceTrace = {
      traceId: browserTrace.traceId,
      traceName: `Browser: ${browserTrace.action}`,
      traceType: "browser",
      startTime: performance.now() - browserTrace.duration,
      endTime: performance.now(),
      duration: browserTrace.duration,
      metadata: {
        ...browserTrace.metadata,
        action: browserTrace.action,
        selector: browserTrace.selector,
        success: browserTrace.success,
        error: browserTrace.error,
        screenshot: browserTrace.screenshot,
      },
      data: {
        browserTrace,
      },
    };

    this.traces.push(trace);

    if (this.config.autoCollect) {
      this.storeTrace(trace.traceId);
    }
  }

  /**
   * 🦦 Store all traces in the database
   */
  async storeAllTraces(): Promise<void> {
    if (!this.config.testRunId) {
      console.warn("⚠️ No test run ID configured for tracing");
      return;
    }

    const tracesToStore = this.traces.slice(-this.config.maxTraces);

    for (const trace of tracesToStore) {
      await this.storeTrace(trace.traceId);
    }

    console.log(`🦦 Stored ${tracesToStore.length} traces in database`);
  }

  /**
   * 🦦 Store a specific trace in the database
   */
  private async storeTrace(traceId: string): Promise<void> {
    const trace = this.traces.find(t => t.traceId === traceId);
    if (!trace) return;

    try {
      const response = await fetch(`${this.config.apiBaseUrl}/api/testing/trace-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_run_id: this.config.testRunId,
          trace_id: trace.traceId,
          trace_type: trace.traceType,
          trace_name: trace.traceName,
          trace_data: trace.data,
          duration_ms: trace.duration,
          metadata: trace.metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to store trace: ${response.statusText}`);
      }

      console.log(`✅ Stored trace: ${trace.traceName}`);
    } catch (error) {
      console.warn(`⚠️ Failed to store trace ${traceId}: ${error}`);
    }
  }

  /**
   * 🦦 Setup automatic collection of performance metrics
   */
  private setupAutomaticCollection(): void {
    // Monitor performance entries
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.collectPerformanceEntry(entry);
        }
      });

      try {
        observer.observe({ entryTypes: ["measure", "navigation", "resource"] });
      } catch (error) {
        console.warn("⚠️ PerformanceObserver not supported:", error);
      }
    }

    // Monitor network requests
    this.setupNetworkMonitoring();

    // Monitor browser interactions
    this.setupBrowserMonitoring();
  }

  /**
   * 🦦 Collect performance entry automatically
   */
  private collectPerformanceEntry(entry: PerformanceEntry): void {
    if (!this.shouldSample()) return;

    const traceId = this.generateTraceId();
    const trace: PerformanceTrace = {
      traceId,
      traceName: entry.name,
      traceType: "performance",
      startTime: entry.startTime,
      endTime: entry.startTime + entry.duration,
      duration: entry.duration,
      metadata: {
        entryType: entry.entryType,
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration,
      },
      data: {
        performanceEntry: entry.toJSON(),
      },
    };

    this.traces.push(trace);

    if (this.config.autoCollect) {
      this.storeTrace(traceId);
    }
  }

  /**
   * 🦦 Setup network request monitoring
   */
  private setupNetworkMonitoring(): void {
    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === "string" ? args[0] : (args[0] as Request).url;
      const method = args[1]?.method || "GET";

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        const networkTrace: NetworkTrace = {
          traceId: this.generateTraceId(),
          url,
          method,
          statusCode: response.status,
          responseTime,
          requestSize: JSON.stringify(args[1]?.body || "").length,
          responseSize: 0, // Would need to read response to get actual size
          headers: Object.fromEntries(response.headers.entries()),
          metadata: {
            timestamp: new Date().toISOString(),
          },
        };

        this.addNetworkTrace(networkTrace);
        return response;
      } catch (error) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        const networkTrace: NetworkTrace = {
          traceId: this.generateTraceId(),
          url,
          method,
          statusCode: 0,
          responseTime,
          requestSize: JSON.stringify(args[1]?.body || "").length,
          responseSize: 0,
          headers: {},
          metadata: {
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : String(error),
          },
        };

        this.addNetworkTrace(networkTrace);
        throw error;
      }
    };
  }

  /**
   * 🦦 Setup browser interaction monitoring
   */
  private setupBrowserMonitoring(): void {
    // Monitor clicks
    document.addEventListener("click", event => {
      const target = event.target as Element;
      const selector = this.getElementSelector(target);

      const browserTrace: BrowserTrace = {
        traceId: this.generateTraceId(),
        action: "click",
        selector,
        duration: 0,
        success: true,
        metadata: {
          timestamp: new Date().toISOString(),
          x: event.clientX,
          y: event.clientY,
        },
      };

      this.addBrowserTrace(browserTrace);
    });

    // Monitor form submissions
    document.addEventListener("submit", event => {
      const form = event.target as HTMLFormElement;
      const selector = this.getElementSelector(form);

      const browserTrace: BrowserTrace = {
        traceId: this.generateTraceId(),
        action: "submit",
        selector,
        duration: 0,
        success: true,
        metadata: {
          timestamp: new Date().toISOString(),
          formAction: form.action,
          formMethod: form.method,
        },
      };

      this.addBrowserTrace(browserTrace);
    });
  }

  /**
   * 🦦 Generate a unique trace ID
   */
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * 🦦 Determine if we should sample this trace
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.samplingRate;
  }

  /**
   * 🦦 Get CSS selector for an element
   */
  private getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.split(" ").filter(c => c.trim());
      if (classes.length > 0) {
        return `.${classes.join(".")}`;
      }
    }

    return element.tagName.toLowerCase();
  }

  /**
   * 🦦 Get all collected traces
   */
  getTraces(): PerformanceTrace[] {
    return [...this.traces];
  }

  /**
   * 🦦 Clear all traces
   */
  clearTraces(): void {
    this.traces = [];
    this.activeTraces.clear();
  }

  /**
   * 🦦 Get trace statistics
   */
  getTraceStats(): {
    totalTraces: number;
    activeTraces: number;
    tracesByType: Record<string, number>;
    averageDuration: number;
  } {
    const tracesByType = this.traces.reduce(
      (acc, trace) => {
        acc[trace.traceType] = (acc[trace.traceType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalDuration = this.traces.reduce((sum, trace) => sum + trace.duration, 0);
    const averageDuration = this.traces.length > 0 ? totalDuration / this.traces.length : 0;

    return {
      totalTraces: this.traces.length,
      activeTraces: this.activeTraces.size,
      tracesByType,
      averageDuration,
    };
  }
}

// Global instance for easy access
let globalTracingIntegration: TracingDBIntegration | null = null;

/**
 * 🦦 Get or create the global tracing integration instance
 */
export function getTracingIntegration(config?: TracingConfig): TracingDBIntegration {
  if (!globalTracingIntegration) {
    globalTracingIntegration = new TracingDBIntegration(config);
  }
  return globalTracingIntegration;
}

/**
 * 🦦 Initialize tracing integration with test run ID
 */
export function initializeTracing(testRunId: string, config?: TracingConfig): TracingDBIntegration {
  const tracing = new TracingDBIntegration({
    ...config,
    testRunId,
  });
  globalTracingIntegration = tracing;
  return tracing;
}

export default TracingDBIntegration;
