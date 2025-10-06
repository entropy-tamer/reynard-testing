#!/usr/bin/env node
/**
 * List Command - List all packages and their i18n configuration
 */

import { Command } from "commander";
import { getEnabledPackages } from "../../config/i18n-testing-config";

export interface ListCommandOptions {
  enabledOnly?: boolean;
}

export const createListCommand = (): Command => {
  const command = new Command("list");

  command
    .description("List all packages and their i18n configuration")
    .option("--enabled-only", "Show only enabled packages")
    .action(async (options: ListCommandOptions) => {
      console.log("🦊 Reynard Package i18n Configuration\n");

      const packages = options.enabledOnly ? await getEnabledPackages() : await getEnabledPackages();

      packages.forEach(pkg => {
        const status = pkg.enabled ? "✅" : "❌";
        console.log(`${status} ${pkg.name}`);
        console.log(`   Path: ${pkg.path}`);
        console.log(`   Enabled: ${pkg.enabled}`);
        if (pkg.enabled) {
          console.log(`   Namespaces: ${pkg.namespaces.join(", ")}`);
          console.log(`   Fail on hardcoded strings: ${pkg.failOnHardcodedStrings}`);
          console.log(`   Validate completeness: ${pkg.validateCompleteness}`);
          console.log(`   Test RTL: ${pkg.testRTL}`);
        }
        console.log("");
      });

      console.log(`Total packages: ${packages.length}`);
      console.log(`Enabled packages: ${packages.filter(p => p.enabled).length}`);
    });

  return command;
};
