/**
 * DOM Assertions Test Suite
 * Tests for harmonized DOM-specific assertion utilities
 *
 * This test suite demonstrates the unified DOM testing approach that works
 * across both vitest and playwright environments.
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
} from "../dom";

describe("Harmonized DOM Assertions", () => {
  beforeEach(() => {
    setupVitestDOMFixture();
  });

  afterEach(() => {
    cleanupVitestDOMFixture();
  });

  describe("Element Selection", () => {
    it("should find elements by ID", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      expect(element).toBeDefined();
    });

    it("should find elements by test ID", async () => {
      const element = await createVitestDOMAssertionsByTestId("test-element");
      expect(element).toBeDefined();
    });

    it("should find elements by class", async () => {
      const element = await createVitestDOMAssertionsByClass("visible");
      expect(element).toBeDefined();
    });

    it("should find elements by role", async () => {
      const element = await createVitestDOMAssertionsByRole("button");
      expect(element).toBeDefined();
    });
  });

  describe("Visibility Assertions", () => {
    it("should assert visible elements", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      await element.toBeVisible();
    });

    it("should assert hidden elements", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.hidden);
      await element.toBeHidden();
    });

    it("should assert invisible elements", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.invisible);
      await element.toBeHidden();
    });

    it("should assert transparent elements", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.transparent);
      await element.toBeHidden();
    });
  });

  describe("Text Content Assertions", () => {
    it("should assert exact text content", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      await element.toHaveTextContent("Visible Element");
    });

    it("should assert text contains substring", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      await element.toContainText("Visible");
    });
  });

  describe("Attribute Assertions", () => {
    it("should assert element has attribute", async () => {
      const element = await createVitestDOMAssertionsByTestId("test-element");
      await element.toHaveAttribute("data-testid", "test-element");
    });

    it("should assert element has attribute without value", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.requiredInput);
      await element.toHaveAttribute("required");
    });

    it("should assert element does not have attribute", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      await element.notToHaveAttribute("data-testid");
    });
  });

  describe("Form Element Assertions", () => {
    it("should assert input has value", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.textInput);
      await element.toHaveAttribute("value", "Test Input");
    });

    it("should assert disabled input", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.disabledInput);
      await element.toHaveAttribute("disabled");
    });

    it("should assert required input", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.requiredInput);
      await element.toHaveAttribute("required");
    });
  });

  describe("Interactive Elements", () => {
    it("should handle button clicks", async () => {
      const button = await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.toggle);
      const target = await createVitestDOMAssertionsById(DOM_TEST_DATA.interactions.toggleTarget);

      // Initially hidden
      await target.toBeHidden();

      // Click to show
      await button.click();
      await target.toBeVisible();

      // Click to hide again
      await button.click();
      await target.toBeHidden();
    });

    it("should handle input typing", async () => {
      const input = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.textInput);

      // Clear and type new text
      await input.type("New Text");

      // Check the actual input value property, not the attribute
      const element = document.getElementById(DOM_TEST_DATA.forms.textInput) as HTMLInputElement;
      expect(element.value).toBe("New Text");
    });
  });

  describe("Accessibility Assertions", () => {
    it("should assert aria-label", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.named);
      await element.toHaveAttribute("aria-label", "Submit Form");
    });

    it("should assert role attribute", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.roles.button);
      await element.toHaveAttribute("role", "button");
    });

    it("should assert title attribute", async () => {
      const element = await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.titled);
      await element.toHaveAttribute("title", "Click to submit");
    });
  });
});
