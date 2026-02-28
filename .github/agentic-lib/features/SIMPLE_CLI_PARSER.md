# SIMPLE_CLI_PARSER

# Description
Provide a minimal command-line interface parser in `src/lib/main.js` to recognize two core flags and dispatch corresponding behavior. This replaces the placeholder logging of raw arguments with structured flag handling.

# Flags
1. --help
   - Show usage information and exit with code 0
2. --serve
   - Start the HTTP server via `startHttpServer(options)` and keep process alive

# Implementation
1. Install and import minimist for argument parsing.
2. In `src/lib/main.js`, export `parseArgs(args: string[]): { help: boolean, serve: boolean }`:
   - Define boolean flags for `--help` and `--serve`.
   - On unknown flags, print error to stderr and exit with code 1.
3. Implement `printUsage()` to display usage text for the two flags.
4. In `main(args)`, call `parseArgs(args)` and:
   - If `help` is true: call `printUsage()` and `process.exit(0)`.
   - Else if `serve` is true: call `startHttpServer(parsedOptions)`.
   - Else: call `printUsage()` and `process.exit(0)`.

# Testing
- Unit tests for `parseArgs` and `main()` behaviors in `tests/unit/main.test.js`:
  * No flags yields `{ help: false, serve: false }`.
  * `--help` yields exit code 0 after printing usage.
  * `--serve` invokes `startHttpServer` and no exit.
  * Unknown flag prints error and exits with code 1.

# Documentation
- Update `README.md` under **CLI Usage**:
  * List `--help` and `--serve` with inline examples:
    npm run start -- --help  # shows usage
    npm run serve             # starts HTTP server