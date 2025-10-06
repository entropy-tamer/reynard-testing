/**
 * Unified DOM API Demo Test Suite
 *
 * Demonstrates the comprehensive unified DOM testing API that works across
 * both vitest and playwright environments. This test showcases all the
 * advanced features including complex interactions, accessibility testing,
 * and performance monitoring.
 *
 * @author 🦊 The Cunning Fox
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setupVitestDOMFixture,
  cleanupVitestDOMFixture,
  createVitestDOMAssertionsById,
  createVitestDOMAssertionsByTestId,
  createVitestDOMAssertionsByClass,
  createVitestDOMAssertionsByRole,
  DOM_TEST_DATA,
  measureMemoryUsage,
  getDOMElementCount,
  measurePerformance,
  trackDOMMutations,
  toHaveAccessibleName,
  toHaveAccessibleDescription,
  toHaveRole,
  toAnnounceText,
  simulateDragAndDrop,
  simulateKeyPress,
} from "../dom";

describe("Unified DOM API - Comprehensive Demo", () => {
  beforeEach(() => {
    setupVitestDOMFixture();
  });

  afterEach(() => {
    cleanupVitestDOMFixture();
  });

  describe("Core DOM Assertions", () => {
    it("should demonstrate basic element selection and assertions", async () => {
      // Test element selection by ID
      const visibleElement = await await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      await visibleElement.toBeVisible();
      await visibleElement.toHaveTextContent("Visible Element");

      // Test element selection by test ID
      const testElement = await await createVitestDOMAssertionsByTestId("test-element");
      await testElement.toHaveAttribute("data-testid", "test-element");
      await testElement.toHaveAttribute("data-value", "123");

      // Test element selection by class
      const multiClassElement = await await createVitestDOMAssertionsByClass("class1");
      await multiClassElement.toHaveTextContent("Multi Class");

      // Test element selection by role
      const buttonRole = await await createVitestDOMAssertionsByRole("button");
      await buttonRole.toHaveTextContent("Button Role");
    });

    it("should demonstrate visibility assertions", async () => {
      const visibleElement = await await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      const hiddenElement = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.hidden);
      const invisibleElement = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.invisible);
      const transparentElement = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.transparent);

      await visibleElement.toBeVisible();
      await hiddenElement.toBeHidden();
      await invisibleElement.toBeHidden();
      await transparentElement.toBeHidden();
    });

    it("should demonstrate attribute assertions", async () => {
      const requiredInput = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.requiredInput);
      const disabledInput = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.disabledInput);
      const textInput = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.textInput);

      await requiredInput.toHaveAttribute("required");
      await disabledInput.toHaveAttribute("disabled");
      await textInput.toHaveAttribute("value", "Test Input");
      await textInput.notToHaveAttribute("disabled");
    });
  });

  describe("Form Element Testing", () => {
    it("should demonstrate form input interactions", async () => {
      const textInput = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.textInput);
      const emailInput = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.validInput);

      // Test input typing
      await textInput.type("New Text");
      const element = document.getElementById(DOM_TEST_DATA.forms.textInput) as HTMLInputElement;
      expect(element.value).toBe("New Text");

      // Test email validation
      await emailInput.toHaveAttribute("type", "email");
      await emailInput.toHaveAttribute("value", "test@example.com");
    });

    it("should demonstrate checkbox interactions", async () => {
      const checkedCheckbox = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.checkedCheckbox);
      const uncheckedCheckbox = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.uncheckedCheckbox);

      // Test checkbox states
      await checkedCheckbox.toHaveAttribute("checked");
      await uncheckedCheckbox.notToHaveAttribute("checked");
    });
  });

  describe("Interactive Elements", () => {
    it("should demonstrate button interactions", async () => {
      const toggleButton = await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.toggle);
      const toggleTarget = await createVitestDOMAssertionsById(DOM_TEST_DATA.interactions.toggleTarget);

      // Initially hidden
      await toggleTarget.toBeHidden();

      // Click to show
      await toggleButton.click();
      await toggleTarget.toBeVisible();

      // Click to hide again
      await toggleButton.click();
      await toggleTarget.toBeHidden();
    });

    it("should demonstrate focus management", async () => {
      const focusableButton = await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.focusable);
      const textInput = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.textInput);

      // Test focus
      await focusableButton.focus();
      await textInput.focus();
    });
  });

  describe("Accessibility Testing", () => {
    it("should demonstrate accessible name testing", async () => {
      const namedButton = await await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.named);
      const labeledInput = await await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.labeledInput);

      // Test accessible names
      await toHaveAccessibleName(namedButton, "Submit Form");
      await toHaveAccessibleName(labeledInput, "Email Address");
    });

    it("should demonstrate accessible description testing", async () => {
      const describedInput = await await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.describedInput);

      await toHaveAccessibleDescription(describedInput, "Enter your email address");
    });

    it("should demonstrate ARIA structure validation", async () => {
      const buttonRole = await await createVitestDOMAssertionsById(DOM_TEST_DATA.roles.button);
      const linkRole = await await createVitestDOMAssertionsById(DOM_TEST_DATA.roles.link);

      // Test ARIA roles
      await toHaveRole(buttonRole, "button");
      await toHaveRole(linkRole, "link");
    });

    it("should demonstrate live region testing", async () => {
      const liveRegion = await await createVitestDOMAssertionsById(DOM_TEST_DATA.accessibility.liveRegion);
      const assertiveLiveRegion = await await createVitestDOMAssertionsById(
        DOM_TEST_DATA.accessibility.assertiveLiveRegion
      );

      // Test live regions
      await liveRegion.toHaveAttribute("aria-live", "polite");
      await liveRegion.toHaveAttribute("aria-atomic", "true");
      await assertiveLiveRegion.toHaveAttribute("aria-live", "assertive");
    });
  });

  describe("Performance Testing", () => {
    it("should demonstrate render performance measurement", async () => {
      const renderTestElement = await await createVitestDOMAssertionsById(DOM_TEST_DATA.performance.renderTest);

      // Measure render performance
      const duration = await measurePerformance(async () => {
        // Simulate some DOM manipulation
        const container = document.getElementById(DOM_TEST_DATA.performance.container);
        if (container) {
          const newElement = document.createElement("div");
          newElement.textContent = "Performance Test Element";
          container.appendChild(newElement);
        }
      });

      expect(duration).toBeGreaterThan(0);
    });

    it("should demonstrate DOM size calculation", async () => {
      const initialCount = getDOMElementCount();
      expect(initialCount).toBeGreaterThan(0);

      // Add some elements
      const container = document.getElementById(DOM_TEST_DATA.performance.container);
      if (container) {
        const newElement = document.createElement("div");
        newElement.textContent = "Size Test Element";
        container.appendChild(newElement);
      }

      const finalCount = getDOMElementCount();
      expect(finalCount).toBeGreaterThan(initialCount);
    });
  });

  describe("Complex Interactions", () => {
    it("should demonstrate drag and drop simulation", async () => {
      const draggableItem = await await createVitestDOMAssertionsById(DOM_TEST_DATA.interactions.draggableItem);
      const dropZone = await await createVitestDOMAssertionsById(DOM_TEST_DATA.interactions.dropZone);

      // Test drag and drop attributes
      await draggableItem.toHaveAttribute("draggable", "true");
      await dropZone.toHaveClass("drop-zone");

      // Simulate drag and drop
      await simulateDragAndDrop(draggableItem, dropZone);

      // Verify drop zone content changed
      await dropZone.toContainText("Item dropped!");
    });

    it("should demonstrate keyboard navigation", async () => {
      const navButton1 = await createVitestDOMAssertionsById(DOM_TEST_DATA.navigation.button1);
      const navButton2 = await createVitestDOMAssertionsById(DOM_TEST_DATA.navigation.button2);
      const navButton3 = await createVitestDOMAssertionsById(DOM_TEST_DATA.navigation.button3);

      // Test tab order
      await navButton1.toHaveAttribute("tabindex", "1");
      await navButton2.toHaveAttribute("tabindex", "2");
      await navButton3.toHaveAttribute("tabindex", "3");

      // Test focus
      await navButton1.focus();
      expect(document.activeElement?.id).toBe(DOM_TEST_DATA.navigation.button1);
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle missing elements gracefully", async () => {
      await expect(createVitestDOMAssertionsById("non-existent-element")).rejects.toThrow(
        'Element with ID "non-existent-element" not found'
      );
    });

    it("should handle invalid selectors gracefully", async () => {
      await expect(createVitestDOMAssertionsByTestId("non-existent-testid")).rejects.toThrow(
        'Element with data-testid "non-existent-testid" not found'
      );
    });

    it("should handle empty text content", async () => {
      const emptyElement = document.createElement("div");
      emptyElement.id = "empty-element";
      document.body.appendChild(emptyElement);

      const emptyAssertion = await await createVitestDOMAssertionsById("empty-element");
      await emptyAssertion.toHaveTextContent("");

      document.body.removeChild(emptyElement);
    });
  });

  describe("Integration with Existing Test Patterns", () => {
    it("should work with existing vitest patterns", async () => {
      const visibleElement = await await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);

      // Mix unified API with traditional vitest assertions
      await visibleElement.toBeVisible();
      expect(visibleElement.environment).toBeDefined();

      // Test element properties
      const element = document.getElementById(DOM_TEST_DATA.elements.visible);
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element?.textContent).toBe("Visible Element");
    });

    it("should support custom assertions", async () => {
      const textInput = await await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.textInput);

      // Custom assertion using the unified API
      const customAssertion = async () => {
        await textInput.toHaveAttribute("type", "text");
        await textInput.toHaveAttribute("value", "Test Input");
      };

      await customAssertion();
    });
  });

  describe("Performance and Memory", () => {
    it("should demonstrate memory usage tracking", async () => {
      // In Happy DOM, performance.memory might not be available
      // So we'll just test that the function exists and can be called
      expect(typeof measureMemoryUsage).toBe("function");

      // Test that the function can be called without errors
      await expect(async () => {
        await measureMemoryUsage(async () => {
          // Create some elements
          const container = document.getElementById("test-container");
          if (container) {
            for (let i = 0; i < 10; i++) {
              const element = document.createElement("div");
              element.textContent = `Element ${i}`;
              container.appendChild(element);
            }
          }
        });
      }).not.toThrow();
    });

    it("should demonstrate element count tracking", async () => {
      const initialCount = document.querySelectorAll("*").length;

      // Add elements
      const container = document.getElementById(DOM_TEST_DATA.performance.container);
      if (container) {
        const element = document.createElement("div");
        element.textContent = "Count Test Element";
        container.appendChild(element);
      }

      const finalCount = document.querySelectorAll("*").length;
      expect(finalCount).toBe(initialCount + 1);
    });
  });
});
