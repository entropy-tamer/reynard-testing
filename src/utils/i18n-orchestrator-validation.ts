/**
 * Validation for i18n Package Testing Setup
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Validate that all packages have proper i18n setup
 */
export async function validatePackageI18nSetup(): Promise<{
  valid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  const { getEnabledPackages } = await import("../config/i18n-testing-config");
  const enabledPackages = await getEnabledPackages();

  for (const pkg of enabledPackages) {
    // Check if package directory exists
    if (!existsSync(pkg.path)) {
      issues.push(`Package directory not found: ${pkg.path}`);
      continue;
    }

    // Check if package has src directory
    const srcPath = join(pkg.path, "src");
    if (!existsSync(srcPath)) {
      issues.push(`Package ${pkg.name} missing src directory: ${srcPath}`);
      continue;
    }

    // Check if package has test directory
    const testPath = join(pkg.path, "src/__tests__");
    if (!existsSync(testPath)) {
      issues.push(`Package ${pkg.name} missing test directory: ${testPath}`);
      continue;
    }

    // Check if package has i18n test file
    const i18nTestPath = join(pkg.path, "src/__tests__/i18n.test.ts");
    if (!existsSync(i18nTestPath)) {
      issues.push(`Package ${pkg.name} missing i18n test file: ${i18nTestPath}`);
    }

    // Check if package has translation files
    const hasTranslationFiles = pkg.namespaces.some(namespace => {
      const translationPath = join(pkg.path, `src/lang/en/${namespace}.ts`);
      return existsSync(translationPath);
    });

    if (!hasTranslationFiles && pkg.validateCompleteness) {
      issues.push(`Package ${pkg.name} missing translation files for namespaces: ${pkg.namespaces.join(", ")}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
