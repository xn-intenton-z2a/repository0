# CLI_PARSER

# Description
Enhance the command-line interface to include a full diagnostics mode alongside structured parsing of all supported flags. Diagnostics mode gathers and displays environment and system information for troubleshooting, then exits cleanly.

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
  - Node version (process.versions.node)
  - Platform (process.platform)
  - Current working directory (process.cwd())
  - Selected environment variables (entries in process.env matching CLI flags or a configurable prefix)
- Format the collected data as a JSON object with keys:
  - nodeVersion
  - platform
  - cwd
  - env (object of selected variables)
- Print the JSON diagnostics report to stdout
- Exit with status code 0

# Implementation
- In src/lib/main.js:
  - Export a function printDiagnostics() that performs the collection steps above and returns the diagnostics object.
  - In parseArgs, detect the diagnostics flag and return options.diagnostics = true.
  - In main(), after parsing args:
    * If options.diagnostics is true, call printDiagnostics(), console.log the returned object, and process.exit(0).
    * Otherwise proceed to existing serve or logging flows.
- Ensure parseArgs continues to validate known flags and Zod schema if used.

# Testing
- In tests/unit/main.test.js:
  - Add unit tests for parseArgs(["--diagnostics"]) to verify options.diagnostics is true and other flags false.
  - Write tests for printDiagnostics():
     * Spy on console.log to capture output
     * Assert returned object has keys nodeVersion, platform, cwd, env
     * Validate that env includes at least one known variable from process.env
  - Simulate invocation of main(["--diagnostics"]):
     * Spy on printDiagnostics and process.exit
     * Confirm printDiagnostics is called, console.log prints the report, and main exits with code 0

# Documentation
- Update README.md:
  - Add a **Diagnostics Mode** section under CLI Usage.
  - Describe the purpose and fields collected.
  - Provide inline example: npm run diagnostics and sample JSON output without fenced code blocks.