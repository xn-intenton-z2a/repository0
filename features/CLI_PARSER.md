# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support structured parsing of core flags and operations. Users can invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode.

# Flags and Subcommands
1. --help               Show usage information and exit with code 0
2. --version            Print current tool version from package.json and exit with code 0
3. --diagnostics        Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit with code 0
4. --serve              Start an HTTP server on a configurable port (/health and /options endpoints)
5. --build-intermediate Perform staged build operations to generate an intermediate manifest and exit
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest and exit
7. --refresh            Reload and validate configuration from JSON or YAML using a Zod schema, print JSON, and exit
8. --merge-persist      Merge data sources and persist the combined result to disk, print summary, and exit
9. --watch              Watch JSON/YAML files in the project root and automatically rerun the selected operation on file changes

# Implementation
- Export `parseArgs(args: string[])` to map supported flags to a boolean options object, exit(1) on unknown flags
- Export `printUsage()`, `printVersion()`, `printDiagnostics()`, `startHttpServer()`, `performBuildIntermediate()`, `performBuildEnhanced()`, `refreshConfiguration()`, `mergeAndPersistData()`, and `startWatchMode()` with clear responsibilities and return values for testing
- In `main(args: string[])`, dispatch in this order:
  1. help → `printUsage()` + exit(0)
  2. version → `printVersion()` + exit(0)
  3. diagnostics → `printDiagnostics()` + exit(0)
  4. serve → `startHttpServer(options)`
  5. build-intermediate → `performBuildIntermediate(options)` + exit(0)
  6. build-enhanced → `performBuildEnhanced(options)` + exit(0)
  7. refresh → `refreshConfiguration()` + exit(0)
  8. merge-persist → `mergeAndPersistData()` + exit(0)
  9. watch → `startWatchMode(options)`
  10. fallback → `console.log('Options:', options)`