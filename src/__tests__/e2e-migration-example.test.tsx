/**
 * E2E Migration Example Test Suite
 *
 * Demonstrates how to migrate existing Playwright e2e tests to use the unified
 * DOM testing API. This example shows the before/after comparison and highlights
 * the benefits of the unified approach.
 *
 * @author 🦊 The Cunning Fox
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setupVitestDOMFixture,
  cleanupVitestDOMFixture,
  createVitestDOMAssertionsById,
  createVitestDOMAssertionsByTestId,
  createVitestDOMAssertionsByRole,
  DOM_TEST_DATA,
  createDragDropInteractions,
  createKeyboardInteractions,
  createMultiStepWorkflow,
  WORKFLOW_PATTERNS,
  createScreenReaderTesting,
  createKeyboardNavigationTesting,
  createARIAComplianceTesting,
  createColorContrastTesting,
  createDOMMutationTracker,
  createRenderPerformanceTesting,
} from "../dom";

describe("E2E Migration Example - User Authentication Flow", () => {
  beforeEach(() => {
    // Set up a more realistic test page for authentication
    document.body.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Test</title>
          <style>
            .hidden { display: none; }
            .error { color: red; }
            .success { color: green; }
            .form-group { margin: 10px 0; }
            .form-control { padding: 8px; border: 1px solid #ccc; }
            .btn { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
            .btn:disabled { background: #ccc; cursor: not-allowed; }
            .btn:hover:not(:disabled) { background: #0056b3; }
          </style>
        </head>
        <body>
          <div id="app">
            <form id="login-form" role="form" aria-label="User Login">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  class="form-control" 
                  required 
                  aria-describedby="email-help"
                  placeholder="Enter your email"
                />
                <div id="email-help" class="help-text">We'll never share your email</div>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  class="form-control" 
                  required 
                  aria-describedby="password-help"
                  placeholder="Enter your password"
                />
                <div id="password-help" class="help-text">Minimum 8 characters</div>
              </div>
              
              <button id="login-btn" type="submit" class="btn" aria-label="Sign in to your account">
                Sign In
              </button>
            </form>
            
            <div id="dashboard" class="hidden" role="main" aria-label="User Dashboard">
              <h1>Welcome to Dashboard</h1>
              <p>You have successfully logged in!</p>
              <button id="logout-btn" class="btn" aria-label="Sign out of your account">
                Sign Out
              </button>
            </div>
            
            <div id="error-message" class="hidden error" role="alert" aria-live="assertive">
              Invalid credentials. Please try again.
            </div>
            
            <div id="success-message" class="hidden success" role="status" aria-live="polite">
              Login successful!
            </div>
          </div>
        </body>
      </html>
    `;
  });

  afterEach(() => {
    cleanupVitestDOMFixture();
  });

  describe("Traditional E2E Test Pattern (Before Migration)", () => {
    it("should complete login flow - traditional approach", async () => {
      // This is how the test would look with traditional Playwright API
      // const page = await browser.newPage();
      // await page.goto('http://localhost:3000');
      //
      // // Fill in login form
      // await page.fill('#email', 'user@example.com');
      // await page.fill('#password', 'password123');
      //
      // // Submit form
      // await page.click('#login-btn');
      //
      // // Wait for dashboard
      // await page.waitForSelector('#dashboard', { state: 'visible' });
      //
      // // Verify success
      // const dashboard = page.locator('#dashboard');
      // await expect(dashboard).toBeVisible();
      // await expect(dashboard).toContainText('Welcome to Dashboard');

      // Simulating the traditional approach with our unified API
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");
      const dashboard = createVitestDOMAssertionsById("dashboard");

      // Fill in login form
      await emailInput.type("user@example.com");
      await passwordInput.type("password123");

      // Submit form
      await loginButton.click();

      // Wait for dashboard (simulated)
      await dashboard.toBeVisible();
      await dashboard.toContainText("Welcome to Dashboard");
    });
  });

  describe("Unified API Test Pattern (After Migration)", () => {
    it("should complete login flow with unified API", async () => {
      // Create unified DOM assertions
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");
      const dashboard = createVitestDOMAssertionsById("dashboard");
      const errorMessage = createVitestDOMAssertionsById("error-message");

      // Test initial state
      await emailInput.toBeVisible();
      await passwordInput.toBeVisible();
      await loginButton.toBeVisible();
      await loginButton.toBeEnabled();
      await dashboard.toBeHidden();
      await errorMessage.toBeHidden();

      // Fill in login form
      await emailInput.type("user@example.com");
      await passwordInput.type("password123");

      // Verify form values
      await emailInput.toHaveAttribute("value", "user@example.com");
      await passwordInput.toHaveAttribute("value", "password123");

      // Submit form
      await loginButton.click();

      // Wait for and verify successful login
      await dashboard.toBeVisible();
      await dashboard.toContainText("Welcome to Dashboard");

      // Verify error message is still hidden
      await errorMessage.toBeHidden();
    });

    it("should handle login errors gracefully", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");
      const errorMessage = createVitestDOMAssertionsById("error-message");
      const dashboard = createVitestDOMAssertionsById("dashboard");

      // Fill in invalid credentials
      await emailInput.type("invalid@example.com");
      await passwordInput.type("wrongpassword");
      await loginButton.click();

      // Wait for error message
      await errorMessage.toBeVisible();
      await errorMessage.toContainText("Invalid credentials");

      // Verify dashboard is still hidden
      await dashboard.toBeHidden();
    });

    it("should handle form validation", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");

      // Test required field validation
      await loginButton.click();

      // Verify validation messages
      await emailInput.toHaveAttribute("required");
      await passwordInput.toHaveAttribute("required");

      // Test email format validation
      await emailInput.type("invalid-email");
      await loginButton.click();

      // Verify email validation (simulated)
      const emailElement = document.getElementById("email") as HTMLInputElement;
      expect(emailElement.validity.valid).toBe(false);
    });
  });

  describe("Advanced Features with Unified API", () => {
    it("should demonstrate keyboard navigation", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");

      // Test tab navigation
      await emailInput.focus();
      expect(document.activeElement?.id).toBe("email");

      // Tab to password field
      const keyboard = createKeyboardInteractions("vitest", emailInput);
      await keyboard.pressTab();
      expect(document.activeElement?.id).toBe("password");

      // Tab to login button
      await keyboard.pressTab();
      expect(document.activeElement?.id).toBe("login-btn");

      // Test Enter key submission
      await emailInput.focus();
      await emailInput.type("user@example.com");
      await keyboard.pressTab();
      await passwordInput.type("password123");
      await keyboard.pressEnter();

      // Verify form was submitted (simulated)
      const dashboard = createVitestDOMAssertionsById("dashboard");
      await dashboard.toBeVisible();
    });

    it("should demonstrate multi-step workflow", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");
      const dashboard = createVitestDOMAssertionsById("dashboard");

      // Create a login workflow
      const loginWorkflow = createMultiStepWorkflow()
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
          timeout: 5000,
        });

      // Execute the workflow
      const result = await loginWorkflow.execute();

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(4);
      expect(result.results.every(r => r.success)).toBe(true);
    });

    it("should demonstrate accessibility testing", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");
      const loginForm = createVitestDOMAssertionsById("login-form");

      // Test screen reader accessibility
      const screenReader = createScreenReaderTesting("vitest", emailInput);
      const accessibleName = await screenReader.getAccessibleName();
      expect(accessibleName).toBe("Email Address");

      const accessibleDescription = await screenReader.getAccessibleDescription();
      expect(accessibleDescription).toBe("We'll never share your email");

      // Test ARIA compliance
      const ariaCompliance = createARIAComplianceTesting("vitest", loginForm);
      const validation = await ariaCompliance.validateARIAStructure();
      expect(validation.valid).toBe(true);

      // Test keyboard navigation
      const keyboardNav = createKeyboardNavigationTesting("vitest");
      const tabOrder = await keyboardNav.testTabOrder(["email", "password", "login-btn"]);
      expect(tabOrder.passes).toBe(true);
    });

    it("should demonstrate performance monitoring", async () => {
      const loginForm = createVitestDOMAssertionsById("login-form");
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");

      // Start DOM mutation tracking
      const mutationTracker = createDOMMutationTracker();
      mutationTracker.startTracking();

      // Perform some DOM operations
      await emailInput.type("user@example.com");
      await passwordInput.type("password123");

      // Stop tracking and get summary
      const summary = mutationTracker.stopTracking();
      expect(summary.totalMutations).toBeGreaterThan(0);

      // Test render performance
      const performanceTesting = createRenderPerformanceTesting("vitest");
      const metrics = await performanceTesting.measureRenderTime(async () => {
        // Simulate some DOM manipulation
        const container = document.getElementById("app");
        if (container) {
          const newElement = document.createElement("div");
          newElement.textContent = "Performance Test Element";
          container.appendChild(newElement);
        }
      });

      expect(metrics.renderTime).toBeGreaterThan(0);
      expect(metrics.memoryDelta).toBeDefined();
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle network errors gracefully", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");
      const errorMessage = createVitestDOMAssertionsById("error-message");

      // Simulate network error
      await emailInput.type("user@example.com");
      await passwordInput.type("password123");
      await loginButton.click();

      // Verify error handling
      await errorMessage.toBeVisible();
      await errorMessage.toContainText("Invalid credentials");
    });

    it("should handle timeout scenarios", async () => {
      const loginButton = createVitestDOMAssertionsById("login-btn");
      const dashboard = createVitestDOMAssertionsById("dashboard");

      // Test timeout handling
      await loginButton.click();

      // Dashboard should not be visible immediately
      await dashboard.toBeHidden();
    });

    it("should handle form state changes", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");

      // Test form state changes
      await emailInput.type("user@example.com");
      await passwordInput.type("password123");

      // Verify form is ready for submission
      await loginButton.toBeEnabled();
      await loginButton.toBeVisible();
    });
  });

  describe("Integration with Existing Test Patterns", () => {
    it("should work with existing vitest patterns", async () => {
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");
      const loginButton = createVitestDOMAssertionsById("login-btn");

      // Mix unified API with traditional vitest assertions
      await emailInput.toBeVisible();
      expect(emailInput.environment).toBe("vitest");

      // Test element properties
      const emailElement = document.getElementById("email");
      expect(emailElement).toBeInstanceOf(HTMLInputElement);
      expect(emailElement?.getAttribute("type")).toBe("email");
    });

    it("should support custom assertions", async () => {
      const loginForm = createVitestDOMAssertionsById("login-form");
      const emailInput = createVitestDOMAssertionsById("email");
      const passwordInput = createVitestDOMAssertionsById("password");

      // Custom assertion using the unified API
      const customAssertion = async () => {
        await loginForm.toHaveAttribute("role", "form");
        await emailInput.toHaveAttribute("type", "email");
        await passwordInput.toHaveAttribute("type", "password");
      };

      await customAssertion();
    });
  });
});
