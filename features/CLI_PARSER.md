# CLI_PARSER

# Description
Extend the existing command line interface to include a full diagnostics mode alongside structured parsing and handling of all supported flags. Ensure each flag is validated and documented, and provide a reusable diagnostics function for troubleshooting.

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
  • env: selected entries from process.env matching supported flags or a configurable prefix
- Format the collected data as a JSON object with keys nodeVersion, platform, cwd, env
- Print the JSON diagnostics report to standard output and exit with status code 0

# Implementation
- In src/lib/main.js:
  1. Export parseArgs(args: string[]) that validates known flags and returns a structured options object, exiting on help or invalid flags.
  2. Export printDiagnostics() that gathers the diagnostics fields above and returns a diagnostics object.
  3. In main(args):
     • Call parseArgs with CLI arguments
     • If options.help is true, print usage and exit(0)
     • Else if options.diagnostics is true, call printDiagnostics, console.log JSON.stringify(report, null, 2), and process.exit(0)
     • Else if options.serve is true, invoke startHttpServer(options, port)
     • Otherwise, console.log 'Options:', options

# Testing
- In tests/unit/main.test.js:
  • Unit tests for parseArgs:
    - Each flag alone, multiple flags, no flags, invalid flags exit behavior
  • Unit tests for printDiagnostics:
    - Spy on console.log to capture output and validate returned object has keys nodeVersion, platform, cwd, env
    - Ensure env includes at least one known entry from process.env
  • Integration tests for main(['--diagnostics']):
    - Mock parseArgs, printDiagnostics, process.exit, and console.log to confirm the correct flow on diagnostics and help flags

# Documentation
- Update README.md:
  • Under CLI Usage section list all supported flags and describe their behavior
  • Add Diagnostics Mode section with inline examples showing how to run npm run diagnostics and the expected JSON output