#!/usr/bin/env node
/**
 * Setup Command - Set up i18n test files for all packages
 */

import { Command } from "commander";
import { createPackageI18nTestFiles } from "../../utils/i18n-package-orchestrator";

export interface SetupCommandOptions {
  force?: boolean;
}

export const createSetupCommand = (): Command => {
  const command = new Command("setup");

  command
    .description("Set up i18n test files for all packages")
    .option("--force", "Overwrite existing test files")
    .action(async (options: SetupCommandOptions) => {
      try {
        console.log("🦊 Setting up i18n test files...\n");

        if (options.force) {
          console.log("🔄 Force mode enabled - overwriting existing files");
        }

        await createPackageI18nTestFiles();

        console.log("✅ i18n test files setup complete!");
      } catch (error) {
        console.error("💥 Error setting up i18n test files:", error);
        process.exit(1);
      }
    });

  return command;
};
