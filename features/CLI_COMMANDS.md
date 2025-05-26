# Overview
Enhance the command line interface to support multiple subcommands and configurable behaviors. This feature adds structured parsing and dispatch logic to the main script to handle different operational modes.

# CLI Commands
- start (default): Invoke the existing behavior, logging the provided arguments.
- diagnostics: Print runtime environment details including Node.js version, operating system platform, and current memory usage.
- serve: Launch a simple HTTP server on port 3000 that responds to GET requests at “/health” with a JSON payload { status: 'ok' }.

# Implementation
- Use process.argv to identify the subcommand. Default to “start” when no subcommand is provided.
- Create separate handler functions for each mode inside src/lib/main.js.
- Integrate Zod for argument validation to ensure unrecognized commands produce a clear error message.
- Ensure proper shutdown of the HTTP server on SIGINT and SIGTERM signals for the serve mode.

# Tests
- Add unit tests in tests/unit/main.test.js for:
  • Validating that the diagnostics command outputs a string containing both Node version and platform.
  • Verifying the serve command returns an HTTP server instance listening on port 3000.
  • Confirming that an unsupported subcommand results in a thrown error with a descriptive message.
- Retain existing tests for module import and default start behavior without omission.

# Documentation
- Update README.md to document the new subcommands and provide CLI usage examples:
  npm run start -- diagnostics
  npm run start -- serve
  npm run start -- unsupported
