/**
 * Unified DOM Assertions - Core API
 *
 * Provides a consistent API for DOM element assertions across different test environments.
 * This is the foundation of the unified testing architecture that bridges vitest and playwright.
 *
 * @author 🦊 The Cunning Fox
 */

// Use global expect if available (vitest environment)
// Otherwise, the calling code should provide expect
declare const expect: any;

/**
 * Test environment types
 */
export type DOMTestEnvironment = "vitest" | "playwright";

/**
 * Base DOM element interface that all environment adapters must implement
 */
export interface DOMElement {
  isVisible(): Promise<boolean>;
  isAttached(): Promise<boolean>;
  getTextContent(): Promise<string>;
  getAttribute(name: string): Promise<string | null>;
  click(): Promise<void>;
  focus(): Promise<void>;
  type(text: string): Promise<void>;
}

/**
 * Options for advanced interactions
 */
export interface InteractionOptions {
  timeout?: number;
  force?: boolean;
  noWaitAfter?: boolean;
  modifiers?: string[];
}

/**
 * Unified DOM Assertion Class
 * Provides a consistent API for DOM element assertions across different test environments.
 */
export class UnifiedDOMAssertions {
  constructor(
    private readonly testEnvironment: DOMTestEnvironment,
    private readonly domElement: DOMElement
  ) {}

  /**
   * Assert element is visible
   */
  async toBeVisible(): Promise<void> {
    const isVisible = await this.domElement.isVisible();
    expect(isVisible).toBe(true);
  }

  /**
   * Assert element is hidden
   */
  async toBeHidden(): Promise<void> {
    const isVisible = await this.domElement.isVisible();
    expect(isVisible).toBe(false);
  }

  /**
   * Assert element is attached to the DOM
   */
  async toBeInDocument(): Promise<void> {
    const isAttached = await this.domElement.isAttached();
    expect(isAttached).toBe(true);
  }

  /**
   * Assert element is not attached to the DOM
   */
  async notToBeInDocument(): Promise<void> {
    const isAttached = await this.domElement.isAttached();
    expect(isAttached).toBe(false);
  }

  /**
   * Assert element has a specific attribute
   */
  async toHaveAttribute(name: string, value?: string): Promise<void> {
    const attrValue = await this.domElement.getAttribute(name);
    if (value !== undefined) {
      expect(attrValue).toBe(value);
    } else {
      expect(attrValue).not.toBeNull();
    }
  }

  /**
   * Assert element does not have a specific attribute
   */
  async notToHaveAttribute(name: string): Promise<void> {
    const attrValue = await this.domElement.getAttribute(name);
    expect(attrValue).toBeNull();
  }

  /**
   * Assert element has specific text content
   */
  async toHaveTextContent(text: string): Promise<void> {
    const content = await this.domElement.getTextContent();
    expect(content).toBe(text);
  }

  /**
   * Assert element contains specific text
   */
  async toContainText(text: string): Promise<void> {
    const content = await this.domElement.getTextContent();
    expect(content).toContain(text);
  }

  /**
   * Click the element
   */
  async click(): Promise<void> {
    await this.domElement.click();
  }

  /**
   * Focus the element
   */
  async focus(): Promise<void> {
    await this.domElement.focus();
  }

  /**
   * Type text into the element
   */
  async type(text: string): Promise<void> {
    await this.domElement.type(text);
  }

  /**
   * Assert element has specific CSS class
   */
  async toHaveClass(className: string): Promise<void> {
    const element = (this.domElement as any).element;
    const classList = element.classList;
    expect(classList.contains(className)).toBe(true);
  }

  /**
   * Assert element has specific CSS classes
   */
  async toHaveClasses(...classes: string[]): Promise<void> {
    const element = (this.domElement as any).element;
    const classList = element.classList;
    for (const className of classes) {
      expect(classList.contains(className)).toBe(true);
    }
  }

  /**
   * Assert element has specific ARIA role
   */
  async toHaveRole(role: string): Promise<void> {
    await this.toHaveAttribute("role", role);
  }

  /**
   * Get the underlying DOM element for advanced operations
   */
  get element(): DOMElement {
    return this.domElement;
  }

  /**
   * Get the test environment
   */
  get environment(): DOMTestEnvironment {
    return this.testEnvironment;
  }
}

/**
 * Create unified DOM assertions for vitest environment
 */
export function createVitestDOMAssertions(element: HTMLElement): UnifiedDOMAssertions {
  const vitestElement = new VitestDOMElement(element);
  return new UnifiedDOMAssertions("vitest", vitestElement);
}

/**
 * Create unified DOM assertions by ID for vitest
 */
export async function createVitestDOMAssertionsById(id: string): Promise<UnifiedDOMAssertions> {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element with ID "${id}" not found`);
  return createVitestDOMAssertions(element);
}

/**
 * Create unified DOM assertions by test ID for vitest
 */
export async function createVitestDOMAssertionsByTestId(testId: string): Promise<UnifiedDOMAssertions> {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  if (!element) throw new Error(`Element with data-testid "${testId}" not found`);
  return createVitestDOMAssertions(element as HTMLElement);
}

/**
 * Create unified DOM assertions by class for vitest
 */
export async function createVitestDOMAssertionsByClass(className: string): Promise<UnifiedDOMAssertions> {
  const element = document.querySelector(`.${className}`);
  if (!element) throw new Error(`Element with class "${className}" not found`);
  return createVitestDOMAssertions(element as HTMLElement);
}

/**
 * Create unified DOM assertions by role for vitest
 */
export async function createVitestDOMAssertionsByRole(role: string): Promise<UnifiedDOMAssertions> {
  const element = document.querySelector(`[role="${role}"]`);
  if (!element) throw new Error(`Element with role "${role}" not found`);
  return createVitestDOMAssertions(element as HTMLElement);
}

/**
 * Vitest-specific DOM element implementation
 */
class VitestDOMElement implements DOMElement {
  constructor(private element: HTMLElement) {}

  async isVisible(): Promise<boolean> {
    if (!this.element) return false;

    const style = window.getComputedStyle(this.element);
    const isHidden = style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0;

    // In Happy DOM, elements don't have proper dimensions by default
    // so we don't rely on offsetWidth/offsetHeight for visibility detection
    return !isHidden;
  }

  async isAttached(): Promise<boolean> {
    return document.body.contains(this.element);
  }

  async getTextContent(): Promise<string> {
    return this.element.textContent || "";
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.element.getAttribute(name);
  }

  async click(): Promise<void> {
    this.element.click();
  }

  async focus(): Promise<void> {
    this.element.focus();
  }

  async type(text: string): Promise<void> {
    if (this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement) {
      this.element.value = text;
      this.element.dispatchEvent(new Event("input", { bubbles: true }));
      this.element.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}
