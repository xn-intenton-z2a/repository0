# CLI_PARSER

# Description
Extend the command-line interface with structured parsing of all supported flags, including a full diagnostics mode. This feature ensures consistent validation of inputs, clear usage output, and integration with diagnostics, HTTP server, build, refresh, and persistence workflows.

# Flags and Subcommands
1. --help               Show usage information and exit
2. --diagnostics        Enable diagnostics mode: collect and display system and environment details
3. --serve               Start a simple HTTP server on a configurable port
4. --build-intermediate Perform staged build operations (placeholder)
5. --build-enhanced     Perform enhanced build operations (placeholder)
6. --refresh            Reload configuration and data (placeholder)
7. --merge-persist      Merge data and persist changes to disk (placeholder)

# Diagnostics Mode
When --diagnostics is provided:
- Collect system information:
  - nodeVersion: process.versions.node
  - platform: process.platform
  - cwd: process.cwd()
  - env: filtered process.env entries for CLI flags or a configurable prefix
- Format the data as a JSON object with keys nodeVersion, platform, cwd, env
- Print the JSON diagnostics report to stdout
- Exit with status code 0

# Implementation
- In src/lib/main.js:
  1. Export parseArgs(args: string[]) to:
     - Validate known flags against a Zod schema
     - Set boolean options for each supported flag
     - On --help: print usage and exit(0)
     - On invalid flag: print usage and exit(1)
     - Return a structured options object
  2. Export printDiagnostics() to:
     - Gather diagnostics fields
     - Return the diagnostics object
  3. In main():
     - Call parseArgs(process.argv.slice(2))
     - If options.diagnostics: call printDiagnostics(), console.log the report, process.exit(0)
     - Else if options.serve: delegate to startHttpServer(options)
     - Else: console.log('Options:', options)

# Testing
- In tests/unit/main.test.js:
  * Unit tests for parseArgs:
    - Each flag alone, multiple flags, no flags, and invalid flags with exit behavior
    - Assert the returned options object matches expectations
  * Unit tests for printDiagnostics():
    - Spy on console.log to capture output
    - Validate returned object contains nodeVersion, platform, cwd, and env
    - Ensure env includes at least one known variable from process.env
  * Integration test for main(['--diagnostics']):
    - Spy on printDiagnostics and process.exit
    - Confirm printDiagnostics is called, console.log prints the report, and exit(0) occurs

# Documentation
- Update README.md:
  - Under **CLI Usage**, list all supported flags
  - Add a **Diagnostics Mode** section describing collected fields
  - Provide inline examples (no fenced code blocks) for:
    npm run diagnostics
    Expected JSON output for diagnostics