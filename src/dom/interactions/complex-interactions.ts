/**
 * Complex Interactions for Unified DOM Testing
 *
 * Provides advanced interaction patterns like drag & drop, keyboard navigation,
 * and multi-step workflows that work across both vitest and playwright environments.
 *
 * @author 🦊 The Cunning Fox
 */

import { Page } from "@playwright/test";
import { UnifiedDOMAssertions, DOMTestEnvironment } from "../unified-dom-assertions";
import { PlaywrightDOMAssertions } from "../adapters/playwright-adapter";

/**
 * Options for drag and drop operations
 */
export interface DragDropOptions {
  timeout?: number;
  force?: boolean;
  noWaitAfter?: boolean;
  sourcePosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
}

/**
 * Options for keyboard interactions
 */
export interface KeyboardOptions {
  timeout?: number;
  delay?: number;
  modifiers?: string[];
}

/**
 * Key modifiers for keyboard interactions
 */
export type KeyModifiers = "Control" | "Shift" | "Alt" | "Meta";

/**
 * Drag and Drop Interaction Handler
 */
export class DragDropInteractions {
  constructor(
    private readonly environment: DOMTestEnvironment,
    private readonly sourceElement: UnifiedDOMAssertions,
    private readonly page?: Page
  ) {}

  /**
   * Drag source element to target element
   */
  async dragTo(target: UnifiedDOMAssertions, options?: DragDropOptions): Promise<void> {
    if (this.environment === "playwright" && this.page) {
      await this.playwrightDragTo(target, options);
    } else {
      await this.vitestDragTo(target, options);
    }
  }

  /**
   * Drag source element to specific coordinates
   */
  async dragToCoordinates(x: number, y: number, options?: DragDropOptions): Promise<void> {
    if (this.environment === "playwright" && this.page) {
      await this.playwrightDragToCoordinates(x, y, options);
    } else {
      await this.vitestDragToCoordinates(x, y, options);
    }
  }

  private async playwrightDragTo(target: UnifiedDOMAssertions, options?: DragDropOptions): Promise<void> {
    if (!(this.sourceElement instanceof PlaywrightDOMAssertions) || !(target instanceof PlaywrightDOMAssertions)) {
      throw new Error("Playwright drag and drop requires PlaywrightDOMAssertions");
    }

    const sourceLocator = (this.sourceElement.element as any).locator;
    const targetLocator = (target.element as any).locator;

    await sourceLocator.dragTo(targetLocator, {
      force: options?.force,
      noWaitAfter: options?.noWaitAfter,
      timeout: options?.timeout,
      sourcePosition: options?.sourcePosition,
      targetPosition: options?.targetPosition,
    });
  }

  private async playwrightDragToCoordinates(x: number, y: number, options?: DragDropOptions): Promise<void> {
    if (!(this.sourceElement instanceof PlaywrightDOMAssertions)) {
      throw new Error("Playwright drag and drop requires PlaywrightDOMAssertions");
    }

    const sourceLocator = (this.sourceElement.element as any).locator;
    await sourceLocator.dragTo(x, y, {
      force: options?.force,
      noWaitAfter: options?.noWaitAfter,
      timeout: options?.timeout,
      sourcePosition: options?.sourcePosition,
    });
  }

  private async vitestDragTo(target: UnifiedDOMAssertions, options?: DragDropOptions): Promise<void> {
    // Simulate drag and drop using DOM events
    const sourceElement = (this.sourceElement.element as any).element;
    const targetElement = (target.element as any).element;

    // Dispatch drag events
    sourceElement.dispatchEvent(
      new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      })
    );

    targetElement.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      })
    );

    targetElement.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      })
    );

    sourceElement.dispatchEvent(
      new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      })
    );
  }

  private async vitestDragToCoordinates(x: number, y: number, options?: DragDropOptions): Promise<void> {
    const sourceElement = (this.sourceElement.element as any).element;

    // Simulate drag to coordinates using mouse events
    sourceElement.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: 0,
        clientY: 0,
      })
    );

    sourceElement.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
    );

    sourceElement.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
    );
  }
}

/**
 * Keyboard Interaction Handler
 */
export class KeyboardInteractions {
  constructor(
    private readonly environment: DOMTestEnvironment,
    private readonly element: UnifiedDOMAssertions,
    private readonly page?: Page
  ) {}

  /**
   * Press a single key
   */
  async pressKey(key: string, modifiers?: KeyModifiers[]): Promise<void> {
    if (this.environment === "playwright" && this.page) {
      await this.playwrightPressKey(key, modifiers);
    } else {
      await this.vitestPressKey(key, modifiers);
    }
  }

  /**
   * Type a sequence of characters
   */
  async typeSequence(sequence: string, options?: KeyboardOptions): Promise<void> {
    for (const char of sequence) {
      await this.pressKey(char);
      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }
    }
  }

  /**
   * Navigate with arrow keys
   */
  async navigateWithKeyboard(direction: "up" | "down" | "left" | "right"): Promise<void> {
    const keyMap = {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
    };

    await this.pressKey(keyMap[direction]);
  }

  /**
   * Press Enter key
   */
  async pressEnter(): Promise<void> {
    await this.pressKey("Enter");
  }

  /**
   * Press Escape key
   */
  async pressEscape(): Promise<void> {
    await this.pressKey("Escape");
  }

  /**
   * Press Tab key
   */
  async pressTab(): Promise<void> {
    await this.pressKey("Tab");
  }

  /**
   * Press Shift+Tab key
   */
  async pressShiftTab(): Promise<void> {
    await this.pressKey("Tab", ["Shift"]);
  }

  /**
   * Press Ctrl+A (select all)
   */
  async selectAll(): Promise<void> {
    await this.pressKey("a", ["Control"]);
  }

  /**
   * Press Ctrl+C (copy)
   */
  async copy(): Promise<void> {
    await this.pressKey("c", ["Control"]);
  }

  /**
   * Press Ctrl+V (paste)
   */
  async paste(): Promise<void> {
    await this.pressKey("v", ["Control"]);
  }

  /**
   * Press Ctrl+X (cut)
   */
  async cut(): Promise<void> {
    await this.pressKey("x", ["Control"]);
  }

  /**
   * Press Ctrl+Z (undo)
   */
  async undo(): Promise<void> {
    await this.pressKey("z", ["Control"]);
  }

  /**
   * Press Ctrl+Y (redo)
   */
  async redo(): Promise<void> {
    await this.pressKey("y", ["Control"]);
  }

  private async playwrightPressKey(key: string, modifiers?: KeyModifiers[]): Promise<void> {
    if (!(this.element instanceof PlaywrightDOMAssertions)) {
      throw new Error("Playwright keyboard interactions require PlaywrightDOMAssertions");
    }

    const locator = (this.element.element as any).locator;
    await locator.press(key, { modifiers });
  }

  private async vitestPressKey(key: string, modifiers?: KeyModifiers[]): Promise<void> {
    const element = (this.element.element as any).element;

    // Create keyboard event
    const event = new KeyboardEvent("keydown", {
      key,
      code: this.getKeyCode(key),
      bubbles: true,
      cancelable: true,
      ctrlKey: modifiers?.includes("Control") || false,
      shiftKey: modifiers?.includes("Shift") || false,
      altKey: modifiers?.includes("Alt") || false,
      metaKey: modifiers?.includes("Meta") || false,
    });

    element.dispatchEvent(event);

    // Also dispatch keyup event
    const keyupEvent = new KeyboardEvent("keyup", {
      key,
      code: this.getKeyCode(key),
      bubbles: true,
      cancelable: true,
      ctrlKey: modifiers?.includes("Control") || false,
      shiftKey: modifiers?.includes("Shift") || false,
      altKey: modifiers?.includes("Alt") || false,
      metaKey: modifiers?.includes("Meta") || false,
    });

    element.dispatchEvent(keyupEvent);
  }

  private getKeyCode(key: string): string {
    const keyCodeMap: Record<string, string> = {
      Enter: "Enter",
      Escape: "Escape",
      Tab: "Tab",
      ArrowUp: "ArrowUp",
      ArrowDown: "ArrowDown",
      ArrowLeft: "ArrowLeft",
      ArrowRight: "ArrowRight",
      a: "KeyA",
      c: "KeyC",
      v: "KeyV",
      x: "KeyX",
      z: "KeyZ",
      y: "KeyY",
    };

    return keyCodeMap[key] || key;
  }
}

/**
 * Multi-step Workflow Handler
 */
export interface WorkflowStep {
  name: string;
  execute: () => Promise<any>;
  required: boolean;
  timeout?: number;
}

export interface StepResult {
  step: string;
  success: boolean;
  result?: any;
  error?: Error;
}

export interface WorkflowResult {
  success: boolean;
  results: StepResult[];
  totalTime: number;
}

export class MultiStepWorkflow {
  private steps: WorkflowStep[] = [];
  private startTime: number = 0;

  /**
   * Add a step to the workflow
   */
  addStep(step: WorkflowStep): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Execute all steps in the workflow
   */
  async execute(): Promise<WorkflowResult> {
    this.startTime = Date.now();
    const results: StepResult[] = [];

    for (const step of this.steps) {
      try {
        const stepStartTime = Date.now();
        const result = await this.executeStepWithTimeout(step);
        const stepEndTime = Date.now();

        results.push({
          step: step.name,
          success: true,
          result: { ...result, executionTime: stepEndTime - stepStartTime },
        });
      } catch (error) {
        results.push({
          step: step.name,
          success: false,
          error: error as Error,
        });

        if (step.required) {
          const totalTime = Date.now() - this.startTime;
          throw new WorkflowError(`Required step failed: ${step.name}`, results, totalTime);
        }
      }
    }

    const totalTime = Date.now() - this.startTime;
    return { success: true, results, totalTime };
  }

  /**
   * Execute a single step with timeout
   */
  private async executeStepWithTimeout(step: WorkflowStep): Promise<any> {
    const timeout = step.timeout || 30000; // Default 30 seconds

    return Promise.race([
      step.execute(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Step "${step.name}" timed out after ${timeout}ms`)), timeout)
      ),
    ]);
  }

  /**
   * Get the number of steps in the workflow
   */
  get stepCount(): number {
    return this.steps.length;
  }

  /**
   * Get the required steps count
   */
  get requiredStepCount(): number {
    return this.steps.filter(step => step.required).length;
  }

  /**
   * Clear all steps from the workflow
   */
  clear(): void {
    this.steps = [];
  }
}

/**
 * Custom error for workflow failures
 */
export class WorkflowError extends Error {
  constructor(
    message: string,
    public results: StepResult[],
    public totalTime: number
  ) {
    super(message);
    this.name = "WorkflowError";
  }
}

/**
 * Create drag and drop interactions
 */
export function createDragDropInteractions(
  environment: DOMTestEnvironment,
  sourceElement: UnifiedDOMAssertions,
  page?: Page
): DragDropInteractions {
  return new DragDropInteractions(environment, sourceElement, page);
}

/**
 * Create keyboard interactions
 */
export function createKeyboardInteractions(
  environment: DOMTestEnvironment,
  element: UnifiedDOMAssertions,
  page?: Page
): KeyboardInteractions {
  return new KeyboardInteractions(environment, element, page);
}

/**
 * Create a new multi-step workflow
 */
export function createMultiStepWorkflow(): MultiStepWorkflow {
  return new MultiStepWorkflow();
}

/**
 * Common workflow patterns
 */
export const WORKFLOW_PATTERNS = {
  /**
   * Login workflow pattern
   */
  login: (
    emailInput: UnifiedDOMAssertions,
    passwordInput: UnifiedDOMAssertions,
    loginButton: UnifiedDOMAssertions,
    dashboard: UnifiedDOMAssertions
  ) => {
    return createMultiStepWorkflow()
      .addStep({
        name: "fill_email",
        execute: async () => {
          await emailInput.type("user@example.com");
          return { message: "Email filled" };
        },
        required: true,
      })
      .addStep({
        name: "fill_password",
        execute: async () => {
          await passwordInput.type("password123");
          return { message: "Password filled" };
        },
        required: true,
      })
      .addStep({
        name: "click_login",
        execute: async () => {
          await loginButton.click();
          return { message: "Login button clicked" };
        },
        required: true,
      })
      .addStep({
        name: "verify_dashboard",
        execute: async () => {
          await dashboard.toBeVisible();
          return { message: "Dashboard visible" };
        },
        required: true,
        timeout: 10000,
      });
  },

  /**
   * Form submission workflow pattern
   */
  formSubmission: (
    form: UnifiedDOMAssertions,
    submitButton: UnifiedDOMAssertions,
    successMessage: UnifiedDOMAssertions
  ) => {
    return createMultiStepWorkflow()
      .addStep({
        name: "fill_form",
        execute: async () => {
          // This would be customized based on the specific form
          return { message: "Form filled" };
        },
        required: true,
      })
      .addStep({
        name: "submit_form",
        execute: async () => {
          await submitButton.click();
          return { message: "Form submitted" };
        },
        required: true,
      })
      .addStep({
        name: "verify_success",
        execute: async () => {
          await successMessage.toBeVisible();
          return { message: "Success message visible" };
        },
        required: true,
        timeout: 5000,
      });
  },

  /**
   * Navigation workflow pattern
   */
  navigation: (
    currentPage: UnifiedDOMAssertions,
    targetLink: UnifiedDOMAssertions,
    targetPage: UnifiedDOMAssertions
  ) => {
    return createMultiStepWorkflow()
      .addStep({
        name: "verify_current_page",
        execute: async () => {
          await currentPage.toBeVisible();
          return { message: "Current page verified" };
        },
        required: true,
      })
      .addStep({
        name: "click_navigation_link",
        execute: async () => {
          await targetLink.click();
          return { message: "Navigation link clicked" };
        },
        required: true,
      })
      .addStep({
        name: "verify_target_page",
        execute: async () => {
          await targetPage.toBeVisible();
          return { message: "Target page loaded" };
        },
        required: true,
        timeout: 10000,
      });
  },
};

/**
 * Simulates a drag and drop operation.
 * @param draggable The element to drag.
 * @param dropZone The element to drop onto.
 */
export async function simulateDragAndDrop(
  draggable: UnifiedDOMAssertions,
  dropZone: UnifiedDOMAssertions
): Promise<void> {
  // For Vitest (Happy DOM), we need to dispatch events manually
  // For Playwright, this would involve page.dragAndDrop()
  const draggableElement = (draggable.element as any).element; // Access underlying HTMLElement
  const dropZoneElement = (dropZone.element as any).element; // Access underlying HTMLElement

  if (!draggableElement || !dropZoneElement) {
    throw new Error("Draggable or drop zone element not found for simulation.");
  }

  // Simulate dragstart
  draggableElement.dispatchEvent(new Event("dragstart", { bubbles: true, cancelable: true }));

  // Simulate dragover on drop zone
  dropZoneElement.dispatchEvent(new Event("dragover", { bubbles: true, cancelable: true }));

  // Simulate drop on drop zone
  dropZoneElement.dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));

  // Simulate dragend on draggable
  draggableElement.dispatchEvent(new Event("dragend", { bubbles: true }));
}

/**
 * Simulates keyboard input and navigation.
 * @param element The element to interact with.
 * @param key The key to press (e.g., 'Enter', 'Tab', 'ArrowDown').
 * @param options Optional key event properties.
 */
export async function simulateKeyPress(
  element: UnifiedDOMAssertions,
  key: string,
  options?: KeyboardEventInit
): Promise<void> {
  const domElement = (element.element as any).element; // Access underlying HTMLElement
  if (!domElement) {
    throw new Error("Element not found for key press simulation.");
  }

  domElement.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...options }));
  domElement.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, ...options }));
}

/**
 * Simulates tabbing through elements.
 * @param currentElement The element currently focused.
 * @param shiftKey True if Shift key is pressed for backward tabbing.
 * @returns The new focused element.
 */
export async function simulateTabNavigation(
  currentElement: UnifiedDOMAssertions,
  shiftKey: boolean = false
): Promise<UnifiedDOMAssertions> {
  const currentDomElement = (currentElement.element as any).element;
  if (!currentDomElement) {
    throw new Error("Current element not found for tab navigation simulation.");
  }

  // Happy DOM doesn't fully simulate tab order, so we'll manually find the next focusable element
  const focusableElements = Array.from(
    document.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.hasAttribute("disabled") && !el.classList.contains("hidden")) as HTMLElement[];

  const currentIndex = focusableElements.indexOf(currentDomElement);
  let nextIndex;

  if (shiftKey) {
    nextIndex = currentIndex - 1;
    if (nextIndex < 0) nextIndex = focusableElements.length - 1; // Wrap around
  } else {
    nextIndex = currentIndex + 1;
    if (nextIndex >= focusableElements.length) nextIndex = 0; // Wrap around
  }

  const nextElement = focusableElements[nextIndex];
  if (nextElement) {
    nextElement.focus();
    // Return a new UnifiedDOMAssertions for the newly focused element
    return new UnifiedDOMAssertions(
      currentElement.environment,
      new (currentElement.environment as any).VitestDOMElement(nextElement)
    );
  }

  throw new Error("No next focusable element found.");
}
