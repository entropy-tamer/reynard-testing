/// <reference types="vitest/globals" />
// Using reynard-testing instead of jest-dom
/** @jsxImportSource solid-js */

import { screen } from "@solidjs/testing-library";
import { Component, createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetBrowserMocks, setupBrowserMocks } from "../mocks/browser-mocks.js";
import { renderWithAppContext, renderWithProviders, renderWithRouter, renderWithTheme } from "../test-utils";

describe("Render Utilities", () => {
  const TestComponent: Component = () => <div data-testid="test-component">Hello World</div>;

  beforeEach(() => {
    vi.clearAllMocks();
    setupBrowserMocks();
  });

  afterEach(() => {
    resetBrowserMocks();
  });

  describe("renderWithTheme", () => {
    it("should render component with theme provider", () => {
      const theme = { name: "dark", colors: { primary: "#000" } };

      renderWithTheme(() => <TestComponent />, theme);

      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should use default theme when none provided", () => {
      renderWithTheme(() => <TestComponent />);

      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should accept render options", () => {
      const theme = { name: "light", colors: {} };

      const result = renderWithTheme(() => <TestComponent />, theme, {
        container: document.createElement("div"),
      });

      expect(result.container).toBeInTheDocument();
    });
  });

  describe("renderWithRouter", () => {
    it("should render component with router context", () => {
      renderWithRouter(() => <TestComponent />);

      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should use custom initial URL", () => {
      renderWithRouter(() => <TestComponent />, "/custom-path");

      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should accept render options", () => {
      const result = renderWithRouter(() => <TestComponent />, "/", {
        container: document.createElement("div"),
      });

      expect(result.container).toBeInTheDocument();
    });
  });

  describe("renderWithAppContext", () => {
    it("should render component with app context", () => {
      renderWithAppContext(() => <TestComponent />);

      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should accept render options", () => {
      const result = renderWithAppContext(() => <TestComponent />, {
        container: document.createElement("div"),
      });

      expect(result.container).toBeInTheDocument();
    });
  });

  describe("renderWithAppContext", () => {
    it("should render component with app context", () => {
      renderWithAppContext(() => <TestComponent />);

      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should accept render options", () => {
      const result = renderWithAppContext(() => <TestComponent />, {
        container: document.createElement("div"),
      });

      expect(result.container).toBeInTheDocument();
    });
  });

  describe("renderWithProviders", () => {
    it("should render component with custom wrapper", () => {
      const CustomWrapper: Component<{ children: any; customProp?: string }> = props => (
        <div data-testid="wrapper" data-custom={props.customProp}>
          {props.children}
        </div>
      );

      renderWithProviders(() => <TestComponent />, [CustomWrapper]);

      expect(screen.getByTestId("wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should work with empty wrapper props", () => {
      const CustomWrapper: Component<{ children: any }> = props => <div data-testid="wrapper">{props.children}</div>;

      renderWithProviders(() => <TestComponent />, [CustomWrapper]);

      expect(screen.getByTestId("wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should accept render options", () => {
      const CustomWrapper: Component<{ children: any }> = props => <div>{props.children}</div>;

      const result = renderWithProviders(() => <TestComponent />, [CustomWrapper], {
        container: document.createElement("div"),
      });

      expect(result.container).toBeInTheDocument();
    });
  });

  describe("renderWithProviders - Multiple Providers", () => {
    it("should render component with multiple providers", () => {
      const Provider1: Component<{ children: any }> = props => <div data-testid="provider1">{props.children}</div>;
      const Provider2: Component<{ children: any }> = props => <div data-testid="provider2">{props.children}</div>;

      renderWithProviders(() => <TestComponent />, [Provider1, Provider2]);

      expect(screen.getByTestId("provider1")).toBeInTheDocument();
      expect(screen.getByTestId("provider2")).toBeInTheDocument();
      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should work with single provider", () => {
      const Provider: Component<{ children: any }> = props => <div data-testid="provider">{props.children}</div>;

      renderWithProviders(() => <TestComponent />, [Provider]);

      expect(screen.getByTestId("provider")).toBeInTheDocument();
      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should work with empty providers array", () => {
      renderWithProviders(() => <TestComponent />, []);

      expect(screen.getByTestId("test-component")).toHaveTextContent("Hello World");
    });

    it("should accept render options", () => {
      const Provider: Component<{ children: any }> = props => <div>{props.children}</div>;

      const result = renderWithProviders(() => <TestComponent />, [Provider], {
        container: document.createElement("div"),
      });

      expect(result.container).toBeInTheDocument();
    });
  });

  describe("integration tests", () => {
    it("should work with reactive components", () => {
      const ReactiveComponent: Component = () => {
        const [count, setCount] = createSignal(0);
        return (
          <div>
            <div data-testid="count">{count()}</div>
            <button data-testid="increment" onClick={() => setCount(count() + 1)}>
              Increment
            </button>
          </div>
        );
      };

      renderWithAppContext(() => <ReactiveComponent />);

      expect(screen.getByTestId("count")).toHaveTextContent("0");

      const button = screen.getByTestId("increment");
      button.click();

      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    it("should work with nested providers", () => {
      const NestedComponent: Component = () => <div data-testid="nested">Nested</div>;

      const Provider1: Component<{ children: any }> = props => <div data-testid="outer">{props.children}</div>;
      const Provider2: Component<{ children: any }> = props => <div data-testid="inner">{props.children}</div>;

      renderWithProviders(() => <NestedComponent />, [Provider1, Provider2]);

      expect(screen.getByTestId("outer")).toBeInTheDocument();
      expect(screen.getByTestId("inner")).toBeInTheDocument();
      expect(screen.getByTestId("nested")).toHaveTextContent("Nested");
    });
  });
});
