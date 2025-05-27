# CLI_PARSER

# Description
Extend and refine the existing command-line interface to support a full diagnostics mode alongside structured parsing and handling of all supported flags. Ensure each flag is validated, documented, and tested, and provide a reusable diagnostics function for troubleshooting.

# Flags and Subcommands
1. --help              Show usage information and exit
2. --diagnostics       Enable diagnostics mode: collect and display system and environment details
3. --serve             Start a simple HTTP server on a configurable port
4. --build-intermediate Perform staged build operations (placeholder)
5. --build-enhanced    Perform enhanced build operations (placeholder)
6. --refresh           Reload configuration and data (placeholder)
7. --merge-persist     Merge data and persist changes to disk (placeholder)

# Diagnostics Mode
When --diagnostics is provided:
- Collect system information:
  • nodeVersion: process.versions.node
  • platform: process.platform
  • cwd: process.cwd()
  • env: selected entries from process.env matching CLI flags or a configurable prefix
- Format the collected data as a JSON object with keys nodeVersion, platform, cwd, env
- Print the JSON diagnostics report to stdout and exit with status code 0

# Implementation
- In src/lib/main.js:
  1. Export parseArgs(args: string[]) that:
     - Validates known flags against a Zod schema or whitelist
     - Sets boolean options for each supported flag
     - On --help: print usage and exit(0)
     - On invalid flag: print usage and exit(1)
     - Returns a structured options object
  2. Export printDiagnostics() that:
     - Gathers diagnostics fields as described above
     - Returns the diagnostics object for testing
  3. In main(args):
     - Call parseArgs(process.argv.slice(2))
     - If options.diagnostics is true: call printDiagnostics(), console.log(JSON.stringify(report, null, 2)), process.exit(0)
     - Else if options.serve: invoke startHttpServer(options)
     - Else: console.log('Options:', options)

# Testing
- In tests/unit/main.test.js:
  • Unit tests for parseArgs:
    - Each flag alone, combinations, no flags, invalid flags exit behavior
    - Assert the returned options object matches expectations
  • Unit tests for printDiagnostics():
    - Spy on console.log to capture output
    - Validate returned object contains nodeVersion, platform, cwd, env
    - Ensure env includes at least one known variable from process.env
  • Integration test for main(['--diagnostics']):
    - Spy on printDiagnostics and process.exit
    - Confirm printDiagnostics is called, console.log prints report, and exit(0) occurs

# Documentation
- Update README.md:
  • Under **CLI Usage**, list all supported flags and their behaviors
  • Add **Diagnostics Mode** section describing collected fields and usage
  • Provide inline examples (no fenced code blocks):
    npm run diagnostics
    Expected JSON output
