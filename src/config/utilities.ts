/**
 * i18n Testing Configuration Utilities
 * Helper functions for working with i18n testing configuration
 */

import type { PackageI18nConfig } from "./types.js";
import { defaultI18nTestingConfig } from "./main-config.js";
import { resolve } from "path";

/**
 * Get configuration for a specific package
 */
export async function getPackageI18nConfig(packageName: string): Promise<PackageI18nConfig | undefined> {
  const pkg = defaultI18nTestingConfig.packages.find(pkg => pkg.name === packageName);
  if (pkg) {
    return {
      ...pkg,
      path: await resolvePackagePath(pkg.path),
    };
  }
  return undefined;
}

/**
 * Get all enabled packages for i18n testing
 */
export async function getEnabledPackages(): Promise<PackageI18nConfig[]> {
  const enabledPackages = defaultI18nTestingConfig.packages.filter(pkg => pkg.enabled);
  const resolvedPackages = await Promise.all(
    enabledPackages.map(async pkg => ({
      ...pkg,
      path: await resolvePackagePath(pkg.path),
    }))
  );
  return resolvedPackages;
}

/**
 * Get all package paths for i18n testing
 */
export async function getEnabledPackagePaths(): Promise<string[]> {
  const packages = await getEnabledPackages();
  return packages.map(pkg => pkg.path);
}

/**
 * Resolve package path relative to the Reynard root directory
 */
async function resolvePackagePath(relativePath: string): Promise<string> {
  const currentDir = process.cwd();

  // Try to find the Reynard root directory by looking for package.json with "reynard" in name
  let searchDir = currentDir;
  let rootDir = currentDir;

  // Walk up the directory tree to find the root
  while (searchDir !== "/") {
    try {
      const packageJsonPath = resolve(searchDir, "package.json");
      const { readFileSync, existsSync } = await import("fs");
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        // Look for the main Reynard package.json (not the testing package)
        if (packageJson.name && packageJson.name === "reynard") {
          rootDir = searchDir;
          break;
        }
      }
    } catch (error) {
      // Silently continue if we can't read a package.json
    }
    searchDir = resolve(searchDir, "..");
  }

  return resolve(rootDir, relativePath);
}

/**
 * Get all namespaces used across packages
 */
export async function getAllNamespaces(): Promise<string[]> {
  const namespaces = new Set<string>();
  const packages = await getEnabledPackages();
  packages.forEach(pkg => {
    pkg.namespaces.forEach(ns => namespaces.add(ns));
  });
  return Array.from(namespaces);
}
