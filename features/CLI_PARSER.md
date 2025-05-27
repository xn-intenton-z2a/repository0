# CLI_PARSER

# Description
Extend the existing command line interface to support a diagnostics mode together with structured argument parsing. In diagnostics mode the tool gathers and prints environment details for troubleshooting before exiting.

# Flags and Subcommands
1. --help              Show usage information and exit
2. --diagnostics       Enable diagnostics mode: collect and display system and environment information
3. --serve             Start a simple HTTP server on a configurable port
4. --build-intermediate  Perform staged build operations (placeholder for future build logic)
5. --build-enhanced     Perform enhanced build operations (placeholder for future build logic)
6. --refresh           Reload configuration and data (placeholder for future refresh logic)
7. --merge-persist     Merge data and persist changes to disk (placeholder for future persistence logic)

# Diagnostics Mode
When --diagnostics is provided:
- Collect system information: Node version, platform, working directory, process environment variables (filtered for CLI settings)
- Format diagnostics output as JSON or human-readable key/value pairs
- Print diagnostics report to stdout, then exit with status code 0

# Implementation
- In src/lib/main.js, extend parseArgs to detect diagnostics flag alongside existing flags
- Export a helper function printDiagnostics() that:
  - Reads process.versions, process.platform, process.cwd(), and selected process.env entries
  - Formats the collected data and writes to stdout
  - Returns the diagnostics object for testing
- Modify main() to call printDiagnostics() and exit immediately when diagnostics is true
- Ensure parseArgs and main remain fully typed and validated

# Testing
- In tests/unit/main.test.js:
  - Add unit tests for parseArgs(["--diagnostics"]) to assert options.diagnostics is true and other flags false
  - Write tests for printDiagnostics(): spy on console.log to capture output and validate it contains keys nodeVersion, platform, cwd, and a diagnostics object
  - Simulate invocation of main(["--diagnostics"]): assert printDiagnostics is called, console.log outputs diagnostics, and process exits with code 0

# Documentation
- Update README.md to add a **Diagnostics Mode** section:
  - Describe the purpose of diagnostics and list fields collected
  - Provide inline examples of running npm run diagnostics and expected output format
  - Reference printDiagnostics in the usage guide without fenced code blocks
