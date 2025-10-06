/**
 * Debug Visibility Test
 *
 * Simple test to debug visibility detection issues
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupVitestDOMFixture, cleanupVitestDOMFixture, createVitestDOMAssertionsById, DOM_TEST_DATA } from "../dom";

describe("Debug Visibility", () => {
  beforeEach(() => {
    setupVitestDOMFixture();
  });

  afterEach(() => {
    cleanupVitestDOMFixture();
  });

  it("should debug visibility detection", async () => {
    const visibleElement = await createVitestDOMAssertionsById(DOM_TEST_DATA.elements.visible);

    // Debug the element
    const element = document.getElementById(DOM_TEST_DATA.elements.visible);
    console.log("Element:", element);
    console.log("Element exists:", !!element);

    if (element) {
      const style = window.getComputedStyle(element);
      console.log("Computed style:", {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight,
      });

      const isHidden =
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity) === 0 ||
        (element.offsetWidth === 0 && element.offsetHeight === 0);

      console.log("Is hidden:", isHidden);
      console.log("Should be visible:", !isHidden);
    }

    // Test the assertion
    await visibleElement.toBeVisible();
  });
});
