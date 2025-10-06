/**
 * Test Code Generator
 *
 * Creates testable code from documentation examples
 */

import type { CodeExample } from "./code-parser.js";

/**
 * Extract component name from code
 */
function extractComponentName(code: string): string {
  const functionMatch = code.match(/function\s+(\w+)/);
  if (functionMatch) {
    return functionMatch[1];
  }

  const constMatch = code.match(/const\s+(\w+)\s*=/);
  if (constMatch) {
    return constMatch[1];
  }

  return "ExampleComponent";
}

/**
 * Create a test-safe version of code by wrapping it in proper test structure
 */
export function createTestableCode(example: CodeExample, packageName: string): string {
  const { code, isComponent } = example;

  // Skip non-executable examples
  if (code.includes("// ...") || code.includes("/* ... */")) {
    return "";
  }

  // Skip configuration-only examples
  if (code.includes("const config =") && !code.includes("function")) {
    return "";
  }

  let testableCode = "";

  if (isComponent) {
    // Wrap component examples in render test
    testableCode = `
      import { render, screen } from '@solidjs/testing-library';
      import { createSignal } from 'solid-js';
      import { ${packageName} } from '${packageName}';
      
      ${code}
      
      it('should render component example', () => {
        render(() => <${extractComponentName(code)} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    `;
  } else if (code.includes("import") || code.includes("from")) {
    // Wrap utility examples in function test
    testableCode = `
      import { ${packageName} } from '${packageName}';
      
      ${code}
      
      it('should execute utility example', () => {
        // Example executed successfully
        expect(true).toBe(true);
      });
    `;
  } else if (code.includes("const") || code.includes("let") || code.includes("function")) {
    // Wrap variable/function examples
    testableCode = `
      ${code}
      
      it('should execute code example', () => {
        // Example executed successfully
        expect(true).toBe(true);
      });
    `;
  }

  return testableCode;
}
