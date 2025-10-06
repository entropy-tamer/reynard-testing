/**
 * Shared DOM Test Fixtures for Unified Testing
 *
 * Provides a consistent HTML structure and setup/cleanup utilities
 * for DOM tests across both vitest and playwright environments.
 *
 * @author 🦊 The Cunning Fox
 */

/**
 * HTML content for DOM test page
 */
export const DOM_TEST_PAGE_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <title>DOM Assertions Test Page</title>
    <style>
      .hidden { display: none; }
      .sr-only { position: absolute; left: -10000px; }
      .visible { display: block; }
      .invisible { visibility: hidden; }
      .transparent { opacity: 0; }
      .focusable { outline: 2px solid blue; }
      .hover-effect:hover { background-color: #f0f0f0; }
      .draggable { cursor: move; }
      .drop-zone { border: 2px dashed #ccc; padding: 20px; }
      .drop-zone.drag-over { border-color: #007bff; background-color: #f8f9fa; }
    </style>
  </head>
  <body>
    <div id="test-container">
      <!-- Basic elements -->
      <div id="visible-element" class="visible">Visible Element</div>
      <div id="hidden-element" class="hidden">Hidden Element</div>
      <div id="invisible-element" class="invisible">Invisible Element</div>
      <div id="transparent-element" class="transparent">Transparent Element</div>

      <!-- Form elements -->
      <input id="text-input" type="text" value="Test Input" />
      <input id="disabled-input" type="text" disabled />
      <input id="required-input" type="text" required />
      <input id="invalid-input" type="email" value="invalid-email" />
      <input id="valid-input" type="email" value="test@example.com" />

      <!-- Checkboxes -->
      <input id="checked-checkbox" type="checkbox" checked />
      <input id="unchecked-checkbox" type="checkbox" />
      <input id="partial-checkbox" type="checkbox" />

      <!-- Buttons -->
      <button id="focusable-button" class="focusable">Focusable Button</button>
      <button id="disabled-button" disabled>Disabled Button</button>
      <button id="toggle-button">Toggle Target</button>
      <button id="hover-button" class="hover-effect">Hover Button</button>

      <!-- Elements with roles -->
      <div id="button-role" role="button">Button Role</div>
      <div id="link-role" role="link">Link Role</div>

      <!-- Elements with accessible names -->
      <button id="named-button" aria-label="Submit Form">Submit</button>
      <input id="labeled-input" aria-label="Email Address" type="email" />

      <!-- Elements with accessible descriptions -->
      <input id="described-input" aria-describedby="description" type="email" />
      <div id="description">Enter your email address</div>

      <!-- Elements with titles -->
      <button id="titled-button" title="Click to submit">Submit</button>

      <!-- Elements with classes -->
      <div id="multi-class" class="class1 class2 class3">Multi Class</div>

      <!-- Elements with attributes -->
      <div id="attributed-element" data-testid="test-element" data-value="123">Attributed</div>

      <!-- Elements for interaction tests -->
      <div id="toggle-target" style="display: none;">Toggle Target Content</div>

      <!-- Drag and drop elements -->
      <div id="draggable-item" class="draggable" draggable="true">Drag Me</div>
      <div id="drop-zone" class="drop-zone">Drop Zone</div>

      <!-- Keyboard navigation elements -->
      <div id="keyboard-nav-container">
        <button id="nav-button-1" tabindex="1">First Button</button>
        <button id="nav-button-2" tabindex="2">Second Button</button>
        <button id="nav-button-3" tabindex="3">Third Button</button>
      </div>

      <!-- ARIA live regions -->
      <div id="live-region" role="status" aria-live="polite" aria-atomic="true"></div>
      <div id="assertive-live-region" role="status" aria-live="assertive" aria-atomic="true"></div>

      <!-- Elements not in document -->
      <div id="removable-element">Will be removed</div>

      <!-- Performance test elements -->
      <div id="performance-container">
        <div id="render-test-element">Render Test</div>
      </div>
    </div>
  </body>
</html>
`;

/**
 * Constants for easily accessing elements in the DOM fixture
 */
export const DOM_TEST_DATA = {
  elements: {
    visible: "visible-element",
    hidden: "hidden-element",
    invisible: "invisible-element",
    transparent: "transparent-element",
    multiClass: "multi-class",
    attributed: "attributed-element",
    removable: "removable-element",
  },
  forms: {
    textInput: "text-input",
    disabledInput: "disabled-input",
    requiredInput: "required-input",
    invalidInput: "invalid-input",
    validInput: "valid-input",
    checkedCheckbox: "checked-checkbox",
    uncheckedCheckbox: "unchecked-checkbox",
    partialCheckbox: "partial-checkbox",
    labeledInput: "labeled-input",
    describedInput: "described-input",
  },
  buttons: {
    focusable: "focusable-button",
    disabled: "disabled-button",
    named: "named-button",
    titled: "titled-button",
    toggle: "toggle-button",
    hover: "hover-button",
  },
  roles: {
    button: "button-role",
    link: "link-role",
  },
  interactions: {
    toggleTarget: "toggle-target",
    draggableItem: "draggable-item",
    dropZone: "drop-zone",
  },
  navigation: {
    container: "keyboard-nav-container",
    button1: "nav-button-1",
    button2: "nav-button-2",
    button3: "nav-button-3",
  },
  accessibility: {
    liveRegion: "live-region",
    assertiveLiveRegion: "assertive-live-region",
    description: "description",
  },
  performance: {
    container: "performance-container",
    renderTest: "render-test-element",
  },
};

/**
 * Sets up the DOM fixture for Vitest environment
 */
export function setupVitestDOMFixture(): void {
  document.body.innerHTML = DOM_TEST_PAGE_HTML;

  // Set indeterminate state for the partial checkbox via JavaScript
  const partialCheckbox = document.getElementById(DOM_TEST_DATA.forms.partialCheckbox) as HTMLInputElement;
  if (partialCheckbox) {
    partialCheckbox.indeterminate = true;
  }

  // Add event listener for toggle button
  const toggleButton = document.getElementById(DOM_TEST_DATA.buttons.toggle);
  const toggleTarget = document.getElementById(DOM_TEST_DATA.interactions.toggleTarget);
  if (toggleButton && toggleTarget) {
    toggleButton.addEventListener("click", () => {
      if (toggleTarget.style.display === "none") {
        toggleTarget.style.display = "block";
      } else {
        toggleTarget.style.display = "none";
      }
    });
  }

  // Add drag and drop event listeners
  const draggableItem = document.getElementById(DOM_TEST_DATA.interactions.draggableItem);
  const dropZone = document.getElementById(DOM_TEST_DATA.interactions.dropZone);

  if (draggableItem && dropZone) {
    draggableItem.addEventListener("dragstart", e => {
      e.dataTransfer?.setData("text/plain", "dragged-item");
    });

    dropZone.addEventListener("dragover", e => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", e => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
      dropZone.textContent = "Item dropped!";
    });
  }

  // Add keyboard navigation event listeners
  const navButtons = [
    document.getElementById(DOM_TEST_DATA.navigation.button1),
    document.getElementById(DOM_TEST_DATA.navigation.button2),
    document.getElementById(DOM_TEST_DATA.navigation.button3),
  ].filter(Boolean);

  navButtons.forEach((button, index) => {
    if (button) {
      button.addEventListener("focus", () => {
        button.style.backgroundColor = "#e3f2fd";
      });
      button.addEventListener("blur", () => {
        button.style.backgroundColor = "";
      });
    }
  });

  // Add live region updates for accessibility testing
  const liveRegion = document.getElementById(DOM_TEST_DATA.accessibility.liveRegion);
  const assertiveLiveRegion = document.getElementById(DOM_TEST_DATA.accessibility.assertiveLiveRegion);

  if (liveRegion) {
    // Simulate live region updates
    setTimeout(() => {
      liveRegion.textContent = "Live region updated";
    }, 100);
  }

  if (assertiveLiveRegion) {
    // Simulate assertive live region updates
    setTimeout(() => {
      assertiveLiveRegion.textContent = "Urgent update";
    }, 200);
  }
}

/**
 * Cleans up the DOM fixture for Vitest environment
 */
export function cleanupVitestDOMFixture(): void {
  document.body.innerHTML = "";
}

/**
 * Create a test page for Playwright environment
 */
export function createPlaywrightTestPage(): string {
  return DOM_TEST_PAGE_HTML;
}

/**
 * Get test data for specific test scenarios
 */
export const TEST_SCENARIOS = {
  login: {
    emailInput: "email",
    passwordInput: "password",
    loginButton: "login-btn",
    errorMessage: "error-message",
    dashboard: "dashboard",
  },
  navigation: {
    homeLink: "home-link",
    aboutLink: "about-link",
    contactLink: "contact-link",
    currentPage: "current-page",
  },
  forms: {
    contactForm: "contact-form",
    nameInput: "name-input",
    emailInput: "email-input",
    messageInput: "message-input",
    submitButton: "submit-button",
    successMessage: "success-message",
  },
  modals: {
    modalTrigger: "modal-trigger",
    modal: "modal",
    modalClose: "modal-close",
    modalContent: "modal-content",
  },
  tables: {
    dataTable: "data-table",
    sortButton: "sort-button",
    filterInput: "filter-input",
    pagination: "pagination",
  },
} as const;

/**
 * Performance testing utilities
 */
export class PerformanceTestUtils {
  private static startTime: number = 0;
  private static startMemory: number = 0;

  static startMeasurement(): void {
    this.startTime = performance.now();
    this.startMemory = (performance as any).memory?.usedJSHeapSize || 0;
  }

  static endMeasurement(): { renderTime: number; memoryDelta: number } {
    const endTime = performance.now();
    const endMemory = (performance as any).memory?.usedJSHeapSize || 0;

    return {
      renderTime: endTime - this.startTime,
      memoryDelta: endMemory - this.startMemory,
    };
  }

  static measureRenderTime(renderFunction: () => Promise<void>): Promise<{ renderTime: number; memoryDelta: number }> {
    return new Promise(async resolve => {
      this.startMeasurement();
      await renderFunction();
      const metrics = this.endMeasurement();
      resolve(metrics);
    });
  }
}

/**
 * Accessibility testing utilities
 */
export class AccessibilityTestUtils {
  static async getAccessibleName(element: HTMLElement): Promise<string> {
    // Check aria-label first
    const ariaLabel = element.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel;

    // Check aria-labelledby
    const ariaLabelledBy = element.getAttribute("aria-labelledby");
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      if (labelElement) return labelElement.textContent || "";
    }

    // Check associated label
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.textContent || "";
    }

    // Fall back to text content
    return element.textContent || "";
  }

  static async getAccessibleDescription(element: HTMLElement): Promise<string> {
    const ariaDescribedBy = element.getAttribute("aria-describedby");
    if (ariaDescribedBy) {
      const descElement = document.getElementById(ariaDescribedBy);
      if (descElement) return descElement.textContent || "";
    }
    return "";
  }

  static async validateARIAStructure(element: HTMLElement): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Check for required ARIA attributes based on role
    const role = element.getAttribute("role");
    if (role) {
      const requiredAttributes = this.getRequiredAttributesForRole(role);
      for (const attr of requiredAttributes) {
        if (!element.getAttribute(attr)) {
          issues.push(`Missing required attribute: ${attr} for role: ${role}`);
        }
      }
    }

    // Check for invalid ARIA values
    const ariaAttributes = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith("aria-"))
      .map(attr => ({ name: attr.name, value: attr.value }));

    for (const attr of ariaAttributes) {
      if (!this.isValidARIAValue(attr.name, attr.value)) {
        issues.push(`Invalid ARIA value: ${attr.name}="${attr.value}"`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  private static getRequiredAttributesForRole(role: string): string[] {
    const roleRequirements: Record<string, string[]> = {
      button: [],
      link: [],
      textbox: [],
      checkbox: [],
      radio: [],
      slider: ["aria-valuemin", "aria-valuemax", "aria-valuenow"],
      progressbar: ["aria-valuemin", "aria-valuemax", "aria-valuenow"],
      tab: ["aria-selected"],
      tabpanel: ["aria-labelledby"],
      dialog: ["aria-labelledby"],
      alert: [],
      status: [],
      log: [],
      marquee: [],
      timer: [],
    };

    return roleRequirements[role] || [];
  }

  private static isValidARIAValue(attribute: string, value: string): boolean {
    const validValues: Record<string, string[]> = {
      "aria-live": ["polite", "assertive", "off"],
      "aria-expanded": ["true", "false"],
      "aria-selected": ["true", "false"],
      "aria-checked": ["true", "false", "mixed"],
      "aria-pressed": ["true", "false", "mixed"],
      "aria-sort": ["ascending", "descending", "none", "other"],
      "aria-orientation": ["horizontal", "vertical"],
    };

    const validValuesForAttr = validValues[attribute];
    return !validValuesForAttr || validValuesForAttr.includes(value);
  }
}
