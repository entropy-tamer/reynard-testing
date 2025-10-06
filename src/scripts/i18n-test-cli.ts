#!/usr/bin/env node
/**
 * i18n Testing CLI
 * Command-line interface for running i18n tests across all Reynard packages
 */

import { program } from "commander";
import {
  createRunCommand,
  createSetupCommand,
  createValidateCommand,
  createListCommand,
  createESLintCommand,
  createCICommand,
} from "./commands";
import { setupErrorHandlers } from "./cli-utils.js";

// Set up global error handlers
setupErrorHandlers();

// Configure main program
program.name("i18n-test").description("Run i18n tests across all Reynard packages").version("1.0.0");

// Add all command modules
program.addCommand(createRunCommand());
program.addCommand(createSetupCommand());
program.addCommand(createValidateCommand());
program.addCommand(createListCommand());
program.addCommand(createESLintCommand());
program.addCommand(createCICommand());

// Parse command line arguments
program.parse();
