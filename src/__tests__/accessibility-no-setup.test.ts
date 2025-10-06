/**
 * Accessibility Testing Without Setup
 *
 * Test to verify accessibility functions work without the problematic setup file
 *
 * @author 🦊 The Cunning Fox
 */

import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { setupVitestDOMFixture, cleanupVitestDOMFixture, DOM_TEST_DATA } from "../dom/dom-test-fixtures";
import { createVitestDOMAssertionsById } from "../dom/unified-dom-assertions";
import {
  toHaveAccessibleName,
  toHaveAccessibleDescription,
  toHaveRole,
} from "../dom/accessibility/accessibility-testing";

describe("Accessibility Testing Without Setup", () => {
  beforeEach(() => {
    setupVitestDOMFixture();
  });

  afterEach(() => {
    cleanupVitestDOMFixture();
  });

  describe("Basic Accessibility Functions", () => {
    it("should verify aria-label provides accessible name", async () => {
      const namedButton = await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.named);
      await toHaveAccessibleName(namedButton, "Submit Form");
    });

    it("should verify title attribute provides accessible name", async () => {
      const titledButton = await createVitestDOMAssertionsById(DOM_TEST_DATA.buttons.titled);
      await toHaveAccessibleName(titledButton, "Click to submit");
    });

    it("should verify text content provides accessible name", async () => {
      const visibleElement = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);
      await toHaveAccessibleName(visibleElement, "Visible Element");
    });

    it("should verify aria-describedby provides accessible description", async () => {
      const describedInput = await createVitestDOMAssertionsById(DOM_TEST_DATA.forms.describedInput);
      await toHaveAccessibleDescription(describedInput, "Enter your email address");
    });

    it("should verify explicit role attributes", async () => {
      const buttonRole = await createVitestDOMAssertionsById(DOM_TEST_DATA.roles.button);
      await toHaveRole(buttonRole, "button");
    });
  });
});
