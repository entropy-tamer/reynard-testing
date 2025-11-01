/**
 * Playwright Adapter for Unified DOM Testing
 *
 * Provides Playwright-specific implementation of the unified DOM testing API.
 * This allows e2e tests to use the same API as unit tests while leveraging
 * Playwright's powerful browser automation capabilities.
 *
 * @author 🦊 The Cunning Fox
 */

import { Page, Locator, expect } from "@playwright/test";
import { DOMElement, UnifiedDOMAssertions } from "../unified-dom-assertions";

/**
 * Playwright-specific DOM element implementation
 */
export class PlaywrightDOMElement implements DOMElement {
  constructor(public locator: Locator) {}

  async isVisible(): Promise<boolean> {
    try {
      await this.locator.waitFor({ state: "visible", timeout: 100 });
      return true;
    } catch {
      return false;
    }
  }

  async isAttached(): Promise<boolean> {
    try {
      await this.locator.waitFor({ state: "attached", timeout: 100 });
      return true;
    } catch {
      return false;
    }
  }

  async getTextContent(): Promise<string> {
    return (await this.locator.textContent()) || "";
  }

  async getAttribute(name: string): Promise<string | null> {
    return await this.locator.getAttribute(name);
  }

  async click(): Promise<void> {
    await this.locator.click();
  }

  async focus(): Promise<void> {
    await this.locator.focus();
  }

  async type(text: string): Promise<void> {
    await this.locator.fill(text);
  }

  /**
   * Get the underlying Playwright locator for advanced operations
   */
  getLocator(): Locator {
    return this.locator;
  }
}

/**
 * Enhanced Playwright DOM assertions with advanced capabilities
 */
export class PlaywrightDOMAssertions extends UnifiedDOMAssertions {
  constructor(element: PlaywrightDOMElement) {
    super("playwright", element);
  }

  /**
   * Assert element is visible with custom timeout
   */
  async toBeVisible(timeout?: number): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toBeVisible({ timeout });
  }

  /**
   * Assert element is hidden with custom timeout
   */
  async toBeHidden(timeout?: number): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toBeHidden({ timeout });
  }

  /**
   * Assert element is enabled
   */
  async toBeEnabled(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toBeEnabled();
  }

  /**
   * Assert element is disabled
   */
  async toBeDisabled(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toBeDisabled();
  }

  /**
   * Assert element is focused
   */
  async toBeFocused(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toBeFocused();
  }

  /**
   * Assert element is checked (for checkboxes/radio buttons)
   */
  async toBeChecked(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toBeChecked();
  }

  /**
   * Assert element is not checked
   */
  async notToBeChecked(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).not.toBeChecked();
  }

  /**
   * Assert element has specific CSS class
   */
  async toHaveClass(className: string): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toHaveClass(new RegExp(className));
  }

  /**
   * Assert element has specific CSS classes
   */
  async toHaveClasses(...classes: string[]): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    for (const className of classes) {
      await expect(playwrightElement.locator).toHaveClass(new RegExp(className));
    }
  }

  /**
   * Assert element has specific style property
   */
  async toHaveStyle(style: Record<string, string>): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    for (const [property, value] of Object.entries(style)) {
      await expect(playwrightElement.locator).toHaveCSS(property, value, { timeout: 5000 });
    }
  }

  /**
   * Assert element has specific bounding box
   */
  async toHaveBoundingBox(boundingBox: { x: number; y: number; width: number; height: number }): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    const box = await playwrightElement.locator.boundingBox();
    if (!box) {
      throw new Error("Element has no bounding box");
    }
    expect(box).toEqual(expect.objectContaining(boundingBox));
  }

  /**
   * Assert element has specific screenshot
   */
  async toHaveScreenshot(name: string, options?: { threshold?: number; maxDiffPixels?: number }): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await expect(playwrightElement.locator).toHaveScreenshot(name, options);
  }

  /**
   * Hover over the element
   */
  async hover(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().hover();
  }

  /**
   * Double click the element
   */
  async doubleClick(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().dblclick();
  }

  /**
   * Right click the element
   */
  async rightClick(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().click({ button: "right" });
  }

  /**
   * Select text in the element
   */
  async selectText(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().selectText();
  }

  /**
   * Clear the element's content
   */
  async clear(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().clear();
  }

  /**
   * Get the element's bounding box
   */
  async getBoundingBox(): Promise<{ x: number; y: number; width: number; height: number } | null> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    return await playwrightElement.getLocator().boundingBox();
  }

  /**
   * Get the element's computed styles
   */
  async getComputedStyle(property: string): Promise<string> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    return await playwrightElement.getLocator().evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property);
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(timeout?: number): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().waitFor({ state: "visible", timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(timeout?: number): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().waitFor({ state: "hidden", timeout });
  }

  /**
   * Wait for element to be detached
   */
  async waitForDetached(timeout?: number): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().waitFor({ state: "detached", timeout });
  }

  /**
   * Drag element to another element
   */
  async dragTo(target: PlaywrightDOMAssertions): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    const targetElement = target.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().dragTo(targetElement.locator);
  }

  /**
   * Press a key on the element
   */
  async pressKey(key: string, modifiers?: string[]): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    if (modifiers && modifiers.length > 0) {
      // Handle modifiers by pressing them first, then the key
      for (const modifier of modifiers) {
        await playwrightElement.getLocator().press(modifier, { delay: 100 });
      }
    }
    await playwrightElement.getLocator().press(key);
  }

  /**
   * Type text with keyboard events
   */
  async typeWithKeyboard(text: string): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().type(text);
  }

  /**
   * Get the element's inner HTML
   */
  async getInnerHTML(): Promise<string> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    return await playwrightElement.getLocator().innerHTML();
  }

  /**
   * Get the element's outer HTML
   */
  async getOuterHTML(): Promise<string> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    return await playwrightElement.getLocator().innerHTML();
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(): Promise<void> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    await playwrightElement.getLocator().scrollIntoViewIfNeeded();
  }

  /**
   * Take a screenshot of the element
   */
  async screenshot(options?: { path?: string; fullPage?: boolean }): Promise<Buffer> {
    const playwrightElement = this.element as PlaywrightDOMElement;
    return await playwrightElement.getLocator().screenshot(options);
  }
}

/**
 * Create Playwright DOM assertions for a page
 */
export function createPlaywrightDOMAssertions(page: Page, selector: string): PlaywrightDOMAssertions {
  const locator = page.locator(selector);
  const element = new PlaywrightDOMElement(locator);
  return new PlaywrightDOMAssertions(element);
}

/**
 * Create Playwright DOM assertions by ID
 */
export function createPlaywrightDOMAssertionsById(page: Page, id: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `#${id}`);
}

/**
 * Create Playwright DOM assertions by test ID
 */
export function createPlaywrightDOMAssertionsByTestId(page: Page, testId: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[data-testid="${testId}"]`);
}

/**
 * Create Playwright DOM assertions by class
 */
export function createPlaywrightDOMAssertionsByClass(page: Page, className: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `.${className}`);
}

/**
 * Create Playwright DOM assertions by role
 */
export function createPlaywrightDOMAssertionsByRole(page: Page, role: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[role="${role}"]`);
}

/**
 * Create Playwright DOM assertions by text content
 */
export function createPlaywrightDOMAssertionsByText(page: Page, text: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `text=${text}`);
}

/**
 * Create Playwright DOM assertions by accessible name
 */
export function createPlaywrightDOMAssertionsByLabel(page: Page, label: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[aria-label="${label}"]`);
}

/**
 * Create Playwright DOM assertions by placeholder text
 */
export function createPlaywrightDOMAssertionsByPlaceholder(page: Page, placeholder: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[placeholder="${placeholder}"]`);
}

/**
 * Create Playwright DOM assertions by title attribute
 */
export function createPlaywrightDOMAssertionsByTitle(page: Page, title: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[title="${title}"]`);
}

/**
 * Create Playwright DOM assertions by value attribute
 */
export function createPlaywrightDOMAssertionsByValue(page: Page, value: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[value="${value}"]`);
}

/**
 * Create Playwright DOM assertions by name attribute
 */
export function createPlaywrightDOMAssertionsByName(page: Page, name: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[name="${name}"]`);
}

/**
 * Create Playwright DOM assertions by type attribute
 */
export function createPlaywrightDOMAssertionsByType(page: Page, type: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `[type="${type}"]`);
}

/**
 * Create Playwright DOM assertions by tag name
 */
export function createPlaywrightDOMAssertionsByTag(page: Page, tag: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, tag);
}

/**
 * Create Playwright DOM assertions by partial text match
 */
export function createPlaywrightDOMAssertionsByPartialText(page: Page, text: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `text=${text}`);
}

/**
 * Create Playwright DOM assertions by exact text match
 */
export function createPlaywrightDOMAssertionsByExactText(page: Page, text: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, `text=${text}`);
}

/**
 * Create Playwright DOM assertions by CSS selector
 */
export function createPlaywrightDOMAssertionsBySelector(page: Page, selector: string): PlaywrightDOMAssertions {
  return createPlaywrightDOMAssertions(page, selector);
}
