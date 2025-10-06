/**
 * CLI Utilities
 * Shared utilities for CLI error handling and process management
 */

/**
 * Set up global error handlers for the CLI
 */
export const setupErrorHandlers = (): void => {
  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", error => {
    console.error("💥 Uncaught Exception:", error);
    process.exit(1);
  });
};

/**
 * Create a standardized error handler for command actions
 */
export const createCommandErrorHandler = (commandName: string) => {
  return (error: unknown) => {
    console.error(`💥 Error in ${commandName} command:`, error);
    process.exit(1);
  };
};
