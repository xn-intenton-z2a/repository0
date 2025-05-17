# Overview
Add a new CLI flag `--env` to load and display environment variables from a local `.env` file.

# Behavior

When the CLI is invoked with the `--env` flag:
  1. Load environment variables from `.env` in the repository root using the `dotenv` package.
  2. Print each variable on its own line in the format `KEY=VALUE`, sorted alphabetically by key.
  3. Exit with status code 0.

If the `.env` file is missing or cannot be parsed, print an error message to stderr and exit with a non-zero status.

# Implementation Details

1. Update `sandbox/source/main.js`:
   - Import `dotenv` from the existing dependency.
   - After parsing flags with `minimist`, add a branch for `args.env`:
     1. Call `dotenv.config()` and inspect the result for errors.
     2. If errors occur, log `Failed to load .env: <error message>` to stderr and exit with code 1.
     3. Otherwise, extract `process.env`, filter keys loaded from `.env`, sort them, and `console.log` each `KEY=VALUE`.
   - After handling `--env`, call `process.exit(0)`.

2. Add a new sandbox test `sandbox/tests/env.test.js`:
   - Create a temporary `.env` fixture containing sample variables.
   - Spawn the CLI with `--env`, capture stdout, and verify lines match the fixture keys in sorted order.
   - Test error handling when `.env` contains invalid syntax or is missing.

3. Update `sandbox/docs/USAGE.md` and `README.md`:
   - Document the new `--env` option in the Options list.
   - Provide usage examples and a sample output snippet.

4. Dependencies:
   - Confirm `dotenv` is already declared in `package.json` dependencies; no change needed.

5. Ensure all new code uses ESM syntax, adheres to Node 20 compatibility, and that existing linting and formatting passes.
