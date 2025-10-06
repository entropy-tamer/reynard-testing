import { describe, it, expect } from "vitest";
import { defineConfig } from "vitest/config";

describe("Vitest Basic Configuration", () => {
  it("should be able to create a basic vitest config manually", () => {
    const config = defineConfig({
      test: {
        environment: "happy-dom",
        globals: true,
        setupFiles: ["./src/test-setup.ts"],
        coverage: {
          provider: "v8",
          reporter: ["text", "html", "lcov"],
          thresholds: {
            global: {
              branches: 80,
              functions: 80,
              lines: 80,
              statements: 80,
            },
          },
        },
      },
    });

    expect(config).toBeDefined();
    expect(config.test).toBeDefined();
    expect(config.test!.environment).toBe("happy-dom");
    expect(config.test!.globals).toBe(true);
    expect(config.test!.setupFiles).toEqual(["./src/test-setup.ts"]);
  });

  it("should validate basic vitest config structure", () => {
    const config = defineConfig({
      test: {
        environment: "happy-dom",
        globals: true,
        setupFiles: ["./src/test-setup.ts"],
      },
    });

    expect(config.test).toBeDefined();
    expect(config.test!.environment).toBe("happy-dom");
    expect(config.test!.globals).toBe(true);
    expect(config.test!.setupFiles).toEqual(["./src/test-setup.ts"]);
  });

  it("should handle minimal test configuration", () => {
    const config = defineConfig({
      test: {
        environment: "happy-dom",
      },
    });

    expect(config.test).toBeDefined();
    expect(config.test!.environment).toBe("happy-dom");
  });
});
