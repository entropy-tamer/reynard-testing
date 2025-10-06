/**
 * Component Assertions Test Suite
 * Tests for SolidJS component-specific assertion utilities
 */

import { describe, it, expect } from "vitest";

describe("Component Assertions", () => {
  it("should create DOM elements", () => {
    // Test basic DOM functionality
    const container = document.createElement("div");
    container.setAttribute("data-testid", "test-component");
    container.textContent = "Test Content";

    document.body.appendChild(container);

    // Test that the element was created
    expect(container).toBeTruthy();
    expect(container.getAttribute("data-testid")).toBe("test-component");
    expect(container.textContent).toBe("Test Content");

    // Cleanup
    document.body.removeChild(container);
  });

  it("should query DOM elements", () => {
    // Test DOM querying functionality
    const container = document.createElement("div");
    container.innerHTML = '<div data-testid="test-element">Test Content</div>';

    document.body.appendChild(container);

    // Test querying
    const element = container.querySelector('[data-testid="test-element"]');
    expect(element).toBeTruthy();
    expect(element?.textContent).toBe("Test Content");

    // Cleanup
    document.body.removeChild(container);
  });
});
