#!/usr/bin/env node
/**
 * Validate Command - Validate i18n setup for all packages
 */

import { Command } from "commander";
import { validatePackageI18nSetup } from "../../utils/i18n-package-orchestrator";

export const createValidateCommand = (): Command => {
  const command = new Command("validate");

  command.description("Validate i18n setup for all packages").action(async () => {
    try {
      console.log("🦊 Validating i18n setup...\n");

      const validation = await validatePackageI18nSetup();

      if (validation.valid) {
        console.log("✅ All packages have proper i18n setup!");
      } else {
        console.log("❌ i18n setup issues found:");
        validation.issues.forEach(issue => {
          console.log(`   - ${issue}`);
        });
        process.exit(1);
      }
    } catch (error) {
      console.error("💥 Error validating i18n setup:", error);
      process.exit(1);
    }
  });

  return command;
};
