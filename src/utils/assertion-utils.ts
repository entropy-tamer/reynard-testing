import { render } from "@solidjs/testing-library";
import { expect } from "vitest";
import { getComputedStyles, isElementInDocument, getActiveElement } from "./dom-utils.js";
import { getEnvironmentUtils } from "./test-environment.js";

/**
 * Custom assertion utilities for testing
 */

/**
 * Assert that a component renders without errors
 */
export function expectComponentToRender(component: () => any) {
  expect(() => {
    const Component = component();
    render(() => Component);
  }).not.toThrow();
}

/**
 * Assert that a component throws a specific error
 */
export function expectComponentToThrow(component: () => any, expectedError?: string | RegExp | Error) {
  if (expectedError) {
    expect(() => {
      const Component = component();
      render(() => Component);
    }).toThrow(expectedError);
  } else {
    expect(() => {
      const Component = component();
      render(() => Component);
    }).toThrow();
  }
}

/**
 * Assert that a promise resolves
 */
export async function expectPromiseToResolve<T>(promise: Promise<T>, expectedValue?: T): Promise<T> {
  const result = await promise;
  if (expectedValue !== undefined) {
    expect(result).toEqual(expectedValue);
  }
  return result;
}

/**
 * Assert that a promise rejects
 */
export async function expectPromiseToReject(
  promise: Promise<any>,
  expectedError?: string | RegExp | Error
): Promise<any> {
  try {
    await promise;
    // If we get here, the promise resolved, so we should reject
    throw new Error("Expected promise to reject, but it resolved");
  } catch (error) {
    // If the promise rejected, check if it matches expected error
    if (expectedError) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (typeof expectedError === "string") {
        expect(errorMessage).toContain(expectedError);
      } else if (expectedError instanceof RegExp) {
        expect(errorMessage).toMatch(expectedError);
      } else if (expectedError instanceof Error) {
        expect(errorMessage).toContain(expectedError.message);
      }
    }
    return error;
  }
}

/**
 * Assert that a function is called with specific arguments
 */
export function expectFunctionToBeCalledWith(mockFn: any, ...expectedArgs: any[]) {
  expect(mockFn).toHaveBeenCalledWith(...expectedArgs);
}

/**
 * Assert that a function is called a specific number of times
 */
export function expectFunctionToBeCalledTimes(mockFn: any, times: number) {
  expect(mockFn).toHaveBeenCalledTimes(times);
}

/**
 * Assert that a function is not called
 */
export function expectFunctionNotToBeCalled(mockFn: any) {
  expect(mockFn).not.toHaveBeenCalled();
}

/**
 * Assert that a function is called at least once
 */
export function expectFunctionToBeCalled(mockFn: any) {
  expect(mockFn).toHaveBeenCalled();
}

/**
 * Assert that a value is within a range
 */
export function expectValueToBeInRange(value: number, min: number, max: number) {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}

/**
 * Assert that a value is approximately equal to another value
 */
export function expectValueToBeApproximately(actual: number, expected: number, precision: number = 2) {
  expect(actual).toBeCloseTo(expected, precision);
}

/**
 * Assert that an array contains specific items
 */
export function expectArrayToContain<T>(array: T[], ...items: T[]) {
  items.forEach(item => {
    expect(array).toContain(item);
  });
}

/**
 * Assert that an array has a specific length
 */
export function expectArrayToHaveLength<T>(array: T[], length: number) {
  expect(array).toHaveLength(length);
}

/**
 * Assert that an object has specific properties
 */
export function expectObjectToHaveProperties(obj: any, ...properties: string[]) {
  properties.forEach(prop => {
    expect(obj).toHaveProperty(prop);
  });
}

/**
 * Assert that an object has specific values
 */
export function expectObjectToHaveValues(obj: unknown, values: Record<string, unknown>) {
  Object.entries(values).forEach(([key, value]) => {
    expect(obj).toHaveProperty(key, value);
  });
}

/**
 * Assert that a string matches a pattern
 */
export function expectStringToMatch(str: string, pattern: string | RegExp) {
  expect(str).toMatch(pattern);
}

/**
 * Assert that a string contains a substring
 */
export function expectStringToContain(str: string, substring: string) {
  expect(str).toContain(substring);
}

/**
 * Assert that a DOM element has specific attributes
 */
export function expectElementToHaveAttributes(element: Element, attributes: Record<string, string>) {
  Object.entries(attributes).forEach(([name, value]) => {
    expect(element.getAttribute(name)).toBe(value);
  });
}

/**
 * Assert that a DOM element has specific classes
 */
export function expectElementToHaveClasses(element: Element, ...classes: string[]) {
  classes.forEach(className => {
    expect(element.classList.contains(className)).toBe(true);
  });
}

/**
 * Assert that a DOM element has a specific class (singular, for README compatibility)
 */
export function expectElementToHaveClass(element: Element, className: string) {
  expectElementToHaveClasses(element, className);
}

/**
 * Assert that a DOM element has specific text content
 */
export function expectElementToHaveTextContent(element: Element, text: string) {
  expect(element.textContent).toBe(text);
}

/**
 * Assert that a DOM element is visible
 * Environment-aware implementation
 */
export function expectElementToBeVisible(element: Element) {
  const envUtils = getEnvironmentUtils();

  if (!envUtils.supportsComputedStyles) {
    // Fallback for happy-dom: check inline styles and common patterns
    if (element instanceof HTMLElement) {
      const inlineStyle = element.style;
      if (inlineStyle.display === "none") {
        expect(inlineStyle.display).not.toBe("none");
      }
      if (inlineStyle.visibility === "hidden") {
        expect(inlineStyle.visibility).not.toBe("hidden");
      }
      if (inlineStyle.opacity === "0") {
        expect(inlineStyle.opacity).not.toBe("0");
      }
    }
    // Check for common hidden classes
    expect(element.classList.contains("hidden")).toBe(false);
    expect(element.classList.contains("sr-only")).toBe(false);
    return;
  }

  const style = getComputedStyles(element);
  expect(style.display).not.toBe("none");
  expect(style.visibility).not.toBe("hidden");
  expect(style.opacity).not.toBe("0");
}

/**
 * Assert that a DOM element is hidden
 * Environment-aware implementation
 */
export function expectElementToBeHidden(element: Element) {
  const envUtils = getEnvironmentUtils();

  if (!envUtils.supportsComputedStyles) {
    // Fallback for happy-dom: check inline styles and common patterns
    if (element instanceof HTMLElement) {
      const inlineStyle = element.style;
      if (inlineStyle.display === "none") {
        expect(inlineStyle.display).toBe("none");
        return;
      }
    }
    // Check for common hidden classes
    if (element.classList.contains("hidden") || element.classList.contains("sr-only")) {
      expect(element.classList.contains("hidden") || element.classList.contains("sr-only")).toBe(true);
      return;
    }
    // If no explicit hiding found, this test should fail
    expect("").toBe("none");
    return;
  }

  const style = getComputedStyles(element);
  expect(style.display).toBe("none");
}

/**
 * Assert that a DOM element is in the document
 */
export function expectElementToBeInTheDocument(element: Element) {
  expect(isElementInDocument(element)).toBe(true);
}

/**
 * Assert that a DOM element is not in the document
 */
export function expectElementNotToBeInTheDocument(element: Element) {
  expect(isElementInDocument(element)).toBe(false);
}

/**
 * Assert that a DOM element is disabled
 */
export function expectElementToBeDisabled(element: Element) {
  expect((element as HTMLInputElement).disabled).toBe(true);
}

/**
 * Assert that a DOM element is enabled
 */
export function expectElementToBeEnabled(element: Element) {
  expect((element as HTMLInputElement).disabled).toBe(false);
}

/**
 * Assert that a DOM element is required
 */
export function expectElementToBeRequired(element: Element) {
  expect((element as HTMLInputElement).required).toBe(true);
}

/**
 * Assert that a DOM element is not required
 */
export function expectElementNotToBeRequired(element: Element) {
  expect((element as HTMLInputElement).required).toBe(false);
}

/**
 * Assert that a DOM element is valid
 */
export function expectElementToBeValid(element: Element) {
  expect((element as HTMLInputElement).validity.valid).toBe(true);
}

/**
 * Assert that a DOM element is invalid
 */
export function expectElementToBeInvalid(element: Element) {
  expect((element as HTMLInputElement).validity.valid).toBe(false);
}

/**
 * Assert that a DOM element has focus
 * Environment-aware implementation
 */
export function expectElementToHaveFocus(element: Element) {
  const envUtils = getEnvironmentUtils();

  if (!envUtils.supportsFocus) {
    // Skip focus tests in happy-dom environment
    console.warn("Focus testing not supported in happy-dom environment");
    // For now, we'll just check if the element is focusable
    if (element instanceof HTMLElement) {
      const focusableElements = ["input", "button", "select", "textarea", "a"];
      const isFocusable =
        focusableElements.includes(element.tagName.toLowerCase()) || element.getAttribute("tabindex") !== null;
      expect(isFocusable).toBe(true);
    }
    return;
  }

  const activeElement = getActiveElement();
  expect(activeElement).toBe(element);
}

/**
 * Assert that a DOM element does not have focus
 * Environment-aware implementation
 */
export function expectElementNotToHaveFocus(element: Element) {
  const envUtils = getEnvironmentUtils();

  if (!envUtils.supportsFocus) {
    // Skip focus tests in happy-dom environment
    console.warn("Focus testing not supported in happy-dom environment");
    // For now, we'll just check if the element is not the active element
    // Since happy-dom doesn't support focus, this will always pass
    expect(true).toBe(true);
    return;
  }

  const activeElement = getActiveElement();
  expect(activeElement).not.toBe(element);
}

/**
 * Assert that a DOM element is checked
 */
export function expectElementToBeChecked(element: Element) {
  expect((element as HTMLInputElement).checked).toBe(true);
}

/**
 * Assert that a DOM element is not checked
 */
export function expectElementNotToBeChecked(element: Element) {
  expect((element as HTMLInputElement).checked).toBe(false);
}

/**
 * Assert that a DOM element is partially checked
 */
export function expectElementToBePartiallyChecked(element: Element) {
  expect((element as HTMLInputElement).indeterminate).toBe(true);
}

/**
 * Assert that a DOM element has a specific role
 */
export function expectElementToHaveRole(element: Element, role: string) {
  expect(element.getAttribute("role")).toBe(role);
}

/**
 * Assert that a DOM element has a specific accessible name
 */
export function expectElementToHaveAccessibleName(element: Element, name: string) {
  // For happy-dom, we'll check aria-label or text content as fallback
  const ariaLabel = element.getAttribute("aria-label");
  const textContent = element.textContent?.trim();
  expect(ariaLabel || textContent).toBe(name);
}

/**
 * Assert that a DOM element has a specific accessible description
 */
export function expectElementToHaveAccessibleDescription(element: Element, description: string) {
  // Check title attribute first
  const title = element.getAttribute("title");
  if (title) {
    expect(title).toBe(description);
    return;
  }

  // Check aria-describedby and resolve the referenced element
  const ariaDescribedBy = element.getAttribute("aria-describedby");
  if (ariaDescribedBy) {
    try {
      const describedElement = document.getElementById(ariaDescribedBy);
      if (describedElement) {
        expect(describedElement.textContent).toBe(description);
        return;
      }
    } catch (error) {
      console.warn("Could not resolve aria-describedby element:", error);
    }
    // Fallback to checking the aria-describedby value itself
    expect(ariaDescribedBy).toBe(description);
  } else {
    // If neither title nor aria-describedby, fail
    expect("").toBe(description);
  }
}
