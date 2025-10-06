/**
 * Documentation Example Validator
 *
 * Validates code examples and generates reports
 */

import { extractCodeExamples } from "./code-parser.js";

export interface ValidationResult {
  valid: number;
  invalid: number;
  errors: string[];
}

/**
 * Validate that all code examples in documentation are syntactically correct
 */
export function validateDocExamples(docPath: string): ValidationResult {
  const examples = extractCodeExamples(docPath);
  const errors: string[] = [];
  let valid = 0;
  let invalid = 0;

  examples.forEach((example, index) => {
    try {
      // Basic syntax validation
      if (example.isTypeScript) {
        // For TypeScript, we'll do basic validation
        // Check for import statements - handle multi-line imports
        const lines = example.code.split("\n");
        let hasImport = false;
        let hasFrom = false;

        for (const line of lines) {
          if (line.trim().startsWith("import")) {
            hasImport = true;
          }
          if (line.trim().includes("from")) {
            hasFrom = true;
          }
        }

        if (hasImport && !hasFrom) {
          throw new Error('Invalid import statement - missing "from" clause');
        }
        if (example.code.includes("function") && !example.code.includes("{")) {
          throw new Error("Invalid function syntax");
        }
      }

      // Check for common issues
      if (example.code.includes("undefined") && !example.code.includes("//")) {
        errors.push(`Example ${index + 1}: Contains undefined reference`);
        invalid++;
      } else {
        valid++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(`Example ${index + 1}: ${errorMessage}\nCode: ${example.code.substring(0, 200)}...`);
      invalid++;
    }
  });

  return { valid, invalid, errors };
}

/**
 * Generate a documentation test report
 */
export function generateDocTestReport(docPath: string): string {
  const examples = extractCodeExamples(docPath);
  const validation = validateDocExamples(docPath);

  const typeStats = examples.reduce(
    (acc, example) => {
      const type = example.isComponent ? "Component" : example.isTypeScript ? "TypeScript" : "JavaScript";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const typeStatsText = Object.entries(typeStats)
    .map(([type, count]) => `- ${type}: ${count}`)
    .join("\n");

  return `
# Documentation Test Report

## Summary
- **Total Examples**: ${examples.length}
- **Valid Examples**: ${validation.valid}
- **Invalid Examples**: ${validation.invalid}
- **Success Rate**: ${((validation.valid / examples.length) * 100).toFixed(1)}%

## Examples by Type
${typeStatsText}

## Issues Found
${validation.errors.length > 0 ? validation.errors.map(error => `- ${error}`).join("\n") : "No issues found"}

## Recommendations
${
  validation.invalid > 0
    ? "- Review and fix invalid examples\n- Add proper error handling\n- Ensure all imports are correct"
    : "- All examples are valid and ready for testing"
}
`;
}
