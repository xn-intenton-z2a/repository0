# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support structured parsing of core flags and operations. Ensure each flag dispatches to its dedicated action with clear logging, exit codes, and documentation.

# Flags and Commands
1. --help            Show usage information and exit
2. --version         Print current tool version from package.json and exit
3. --diagnostics     Collect and display system diagnostics and exit
4. --serve           Start an HTTP server on a configurable port
5. --build-intermediate Perform staged build operations and exit
6. --build-enhanced  Execute enhanced build transformations and exit
7. --refresh         Reload and validate configuration using Zod schema and exit
8. --merge-persist   Merge data sources and persist to disk, then exit
9. --watch           Watch JSON and YAML files and rerun the selected operation on changes

# Implementation
- Export `parseArgs(args: string[])` that:
  * Recognizes all supported flags and maps them to a boolean options object
  * Logs an error and exits with code 1 on unknown flags
- Export `printUsage()`, `printVersion()`, `printDiagnostics()`, `startHttpServer()`, `performBuildIntermediate()`, `performBuildEnhanced()`, `refreshConfiguration()`, `mergeAndPersistData()`, and `startWatchMode()` with clear responsibilities and return values for testing
- In `main(args: string[])`, dispatch in this priority:
  1. help → `printUsage()` and exit(0)
  2. version → `printVersion()` and exit(0)
  3. diagnostics → `printDiagnostics()` and exit(0)
  4. serve → `startHttpServer()`
  5. build-intermediate → `performBuildIntermediate()` and exit(0)
  6. build-enhanced → `performBuildEnhanced()` and exit(0)
  7. refresh → `refreshConfiguration()` and exit(0)
  8. merge-persist → `mergeAndPersistData()` and exit(0)
  9. watch → `startWatchMode()`
  10. fallback → log `Options:` and the options object

# Testing
- Unit tests in `tests/unit/main.test.js` covering:
  * `parseArgs` behavior, error handling, and mapping of flags
  * Each exported function’s core behavior with mocks for file I/O, HTTP server, Zod schema, and chokidar
  * Integration tests for `main()` dispatch flows and correct process exit codes

# Documentation
- Update `README.md` under **CLI Usage** to list all supported flags and their descriptions
- Provide inline examples without fenced code blocks for each command:
  npm run start -- --help
  npm run start -- --version
  npm run diagnostics
  npm run serve
  npm run build-intermediate
  npm run build-enhanced
  npm run refresh
  npm run merge-persist
  npm run start -- --serve --watch
