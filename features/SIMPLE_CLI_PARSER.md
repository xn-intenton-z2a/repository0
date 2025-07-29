# SIMPLE_CLI_PARSER

# Description
Provide a minimal command-line interface parser in `src/lib/main.js` to recognize two core flags and dispatch corresponding behavior. This replaces the placeholder logging of raw arguments with structured flag handling.

# Supported Flags
1. --help
   - Show usage information and exit with code 0
2. --serve
   - Start the HTTP server via `startHttpServer(options)` and keep process alive

# Implementation
- In `src/lib/main.js`:
  1. Install and import `minimist` for argument parsing.
  2. Export `parseArgs(args: string[]): { help: boolean, serve: boolean }`:
     - Define boolean flags `help` and `serve`.
     - Treat unknown flags as errors: print error to stderr, exit with code 1.
  3. In `main(args: string[])`:
     - Call `parseArgs(args)`.
     - If `help` is true: call `printUsage()` and exit(0).
     - If `serve` is true: call `startHttpServer(parsedOptions)`.
     - Otherwise: call `printUsage()` and exit(0).
  4. Export `printUsage()`:
     - Print usage text for `--help` and `--serve` without fenced code blocks.

# Testing
- In `tests/unit/main.test.js`:
  * Unit tests for `parseArgs`: no flags, `--help`, `--serve`, and unknown flag exit behavior (mock `process.exit`).
  * Test `main()` dispatch: spy on `startHttpServer` and `console.log` to verify correct calls on each flag.

# Documentation
- Update `README.md` under **CLI Usage**:
  * List `--help` and `--serve` with descriptions.
  * Provide inline examples:
    npm run start -- --help  # shows usage
    npm run serve             # starts HTTP server