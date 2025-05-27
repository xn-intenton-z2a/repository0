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
- Write manifest to the system temp directory
- Log a summary object with item count and manifest path

## Enhanced Build (--build-enhanced)
- Read the intermediate manifest via environment or default path
- Apply a transformation (e.g. add timestamp)
- Write enhanced output to the system temp directory
- Log a report object with transformed flag and output path

# Refresh Configuration
When --refresh is provided:
- Load config.json or config.yml from project root
- Validate and normalize using a schema
- Print the loaded configuration object
- Exit with status code 0

# Merge and Persist Data
When --merge-persist is provided:
- Read two data sources from project root or environment paths
- Merge into a single object
- Write merged JSON to a configurable output path
- Log an object with file path and byte size
- Exit with status code 0

# Implementation
- Export parseArgs(args) for validating and mapping flags to an options object
- Export printUsage() to print usage text
- Export printDiagnostics() to collect diagnostics data
- Export startHttpServer(options, port) for serve behavior
- Export performBuildIntermediate(options) and performBuildEnhanced(options) for build flows
- Export refreshConfiguration() and mergeAndPersistData(options) for config and data
- In main(args): dispatch based on parsed options and handle each operation with clear exit flows

# Testing
- Unit tests for each function covering valid and invalid flags, diagnostics output, server endpoints, build intermediate and enhanced logic, config reload, and data merge
- Mock file I/O and environment variables as needed
- Integration tests for main dispatch on each flag combination

# Documentation
- Update README under **CLI Usage**, **Diagnostics Mode**, **HTTP Server**, **Build Operations**, **Configuration Refresh**, and **Data Persistence** sections
- Provide inline examples for each command without fenced code blocks