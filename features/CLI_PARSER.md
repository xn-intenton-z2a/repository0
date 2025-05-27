# CLI_PARSER

# Description
Enhance the command-line interface to cover argument parsing, diagnostics reporting, HTTP serving, build workflows, configuration refresh, and data persistence. Provide users with a single CLI entrypoint supporting all core operations of the tool.

# Flags and Subcommands
1. --help               Show usage information and exit
2. --diagnostics        Enable diagnostics mode to collect and display system and environment details
3. --serve              Start a simple HTTP server on a configurable port
4. --build-intermediate Perform staged build operations
5. --build-enhanced     Perform enhanced build operations
6. --refresh            Reload and cache configuration from config files
7. --merge-persist      Merge data and persist results to disk

# Diagnostics Mode
When --diagnostics is provided:
- Collect system information:
  - nodeVersion: process.versions.node
  - platform: process.platform
  - cwd: process.cwd()
  - env: selected environment variables
- Format and return a diagnostics object
- Print the diagnostics report to stdout and exit with status code 0

# HTTP Server
When --serve is provided:
- Start an HTTP server on port from `PORT` env or default 3000
- Serve endpoints:
  - GET /health  → HTTP 200, JSON { status: "ok" }
  - GET /options → HTTP 200, JSON of parsed options
  - All other paths → HTTP 404, JSON { error: "Not Found" }

# Build Operations
## Staged Build (--build-intermediate)
- Read source definitions or configuration
- Generate an intermediate JSON manifest
- Write manifest to stdout or temp directory
- Log a summary of generated items

## Enhanced Build (--build-enhanced)
- Read the intermediate manifest
- Apply transformations or optimizations
- Produce final build outputs (compiled or bundled results)
- Write output to configured directory or stdout
- Log detailed build report

# Refresh Configuration
When --refresh is provided:
- Load or reload configuration files (YAML or JSON)
- Validate and normalize configuration using defined schema
- Cache loaded settings in memory
- Log refreshed configuration values

# Merge and Persist Data
When --merge-persist is provided:
- Collect current data sources or previous artifacts
- Merge entries into a combined structure
- Serialize merged data to a configurable output path
- Log the path and size of the persisted file

# Implementation
In `src/lib/main.js`:
- Export `parseArgs(args: string[])`:
  - Validate known flags against a whitelist or Zod schema
  - Set boolean `options` properties for each flag
  - On invalid flag: print usage and exit(1)
  - On `--help`: print usage and exit(0)
- Export `printUsage()` to display usage text
- Export `printDiagnostics()` to collect and return diagnostics object
- Export `startHttpServer(options, port?)` for serve behavior
- Export `performBuildIntermediate(options)` and `performBuildEnhanced(options)` for build flows
- Export `refreshConfiguration()` to load and return config
- Export `mergeAndPersistData(options)` to merge and write data
- In `main(args)`:
  1. Call `parseArgs(args)`
  2. If `options.diagnostics`: call `printDiagnostics()`, log JSON report, exit(0)
  3. Else if `options.serve`: call `startHttpServer`
  4. Else if `options.buildIntermediate`: call `performBuildIntermediate`, exit(0)
  5. Else if `options.buildEnhanced`: call `performBuildEnhanced`, exit(0)
  6. Else if `options.refresh`: call `refreshConfiguration`, exit(0)
  7. Else if `options.mergePersist`: call `mergeAndPersistData`, exit(0)
  8. Else: log `Options:`, options object

# Testing
- Add unit tests in `tests/unit/main.test.js`:
  - `parseArgs`: valid and invalid flags, exit behavior
  - `printDiagnostics`: returns expected keys and env entries
  - `startHttpServer`: server instance, endpoints behavior via simulated requests
  - `performBuildIntermediate` and `performBuildEnhanced`: mock file I/O and validate outputs and logs
  - `refreshConfiguration`: load sample config files and validate returned object
  - `mergeAndPersistData`: simulate data sources, spy on file writes, and check log output
  - `main(...)` dispatch flows for each flag combination

# Documentation
- Update `README.md`:
  - Under **CLI Usage**, list all supported flags and behaviors
  - Add **Diagnostics Mode**, **HTTP Server**, **Build Operations**, **Configuration**, and **Data Persistence** sections with inline usage examples without fenced code blocks
  - Provide example commands:
    npm run start --help
    npm run diagnostics
    npm run serve
    npm run build-intermediate
    npm run build-enhanced
    npm run refresh
    npm run merge-persist