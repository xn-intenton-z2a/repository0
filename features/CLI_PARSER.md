# CLI_PARSER

# Description
Merge and extend the command-line interface to support structured parsing, diagnostics reporting, HTTP serving, build workflows, configuration refresh, and data persistence. Users can invoke all core operations through a single CLI entry point with validated flags.

# Flags and Subcommands
1. --help               Show usage information and exit
2. --diagnostics        Collect and display system and environment diagnostics and exit
3. --serve              Start an HTTP server on a configurable port
4. --build-intermediate Perform staged build operations to generate an intermediate manifest
5. --build-enhanced     Execute enhanced build transformations on the intermediate manifest
6. --refresh            Reload and normalize configuration from JSON or YAML files
7. --merge-persist      Merge data sources and persist the combined result to disk

# Diagnostics Mode
When --diagnostics is provided:
- Gather nodeVersion, platform, cwd, and selected env entries
- Format as a diagnostics object and print as JSON
- Exit with status code 0

# HTTP Server
When --serve is provided:
- Start a server on PORT env or default 3000
- GET /health    → 200, JSON { status: "ok" }
- GET /options   → 200, JSON of parsed CLI options
- Other paths    → 404, JSON { error: "Not Found" }

# Build Operations
## Staged Build (--build-intermediate)
- Locate a source definition (JSON or YAML) in project root
- Parse and count entries to form an intermediate manifest
- Write manifest to the system temporary directory
- Log a summary object with keys items and path

## Enhanced Build (--build-enhanced)
- Read the intermediate manifest via environment or default path
- Apply a transformation such as adding a timestamp
- Write enhanced output to the system temporary directory
- Log a report object with keys transformed and path

# Refresh Configuration
When --refresh is provided:
- Load config.json or config.yml from project root
- Validate and normalize settings using a schema
- Print the loaded configuration object
- Exit with status code 0

# Merge and Persist Data
When --merge-persist is provided:
- Read two data sources from project root or environment paths
- Merge them into a single object
- Write merged JSON to a configurable output path
- Log an object with file path and byte size
- Exit with status code 0

# Implementation
- In src/lib/main.js export:
  • parseArgs(args) to validate and map flags to an options object and handle help and invalid flags
  • printUsage() to display usage text
  • printDiagnostics() to collect diagnostics data
  • startHttpServer(options, port) for serve behavior
  • performBuildIntermediate(options) and performBuildEnhanced(options) for build flows
  • refreshConfiguration() to load and return config
  • mergeAndPersistData(options) to merge data and write the result
- In main(args) dispatch based on parsed options and handle each operation with clear exit flows

# Testing
- In tests/unit/main.test.js add:
  • Unit tests for parseArgs covering valid flags, invalid flags exit behavior, and help flag
  • Unit tests for printDiagnostics asserting returned object keys and env entries
  • Unit tests for startHttpServer verifying server instance and endpoints behavior
  • Unit tests for performBuildIntermediate and performBuildEnhanced mocking file I O and temp directory
  • Unit tests for refreshConfiguration and mergeAndPersistData mocking file reads and writes
  • Integration tests for main dispatch on each flag combining spies for process.exit and console.log

# Documentation
- Update README.md under **CLI Usage**, **Diagnostics Mode**, **HTTP Server**, **Build Operations**, **Configuration Refresh**, and **Data Persistence** sections
- Provide inline examples without fenced code blocks such as npm run start --serve and npm run merge-persist