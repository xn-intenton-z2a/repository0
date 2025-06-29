# CLI_PARSER

# Description
Consolidate and refine the command-line interface to handle structured parsing of core flags and dispatch to dedicated actions. Users invoke a single entry point with flags to perform help, version reporting, diagnostics, HTTP serving, build-intermediate, build-enhanced, configuration validation, data persistence, and watch mode. The parser should validate flags, log unknown options, and exit appropriately.

# Flags and Dispatch Order
1. --help              Show usage information and exit with code 0
2. --version           Print the current tool version from package.json and exit with code 0
3. --diagnostics       Collect and display system diagnostics (node version, platform, cwd, env) as JSON and exit with code 0
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit with code 0
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit with code 0
7. --refresh           Reload and validate configuration from JSON or YAML via a Zod schema, print JSON, and exit with code 0
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit with code 0
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- Export `parseArgs(args: string[])`: iterate supported flags, map to a boolean object, log and exit on unknown flags.
- Export `printUsage()`, `printVersion()`, and `printDiagnostics()` for help, version, and diagnostics behaviors.
- Export `startHttpServer(options, port)`: create an HTTP server with /health and /options endpoints.
- Export `performBuildIntermediate(options)` and `performBuildEnhanced(options)` for staged and enhanced build workflows.
- Export `refreshConfiguration()`: load and validate config files with Zod schema and return typed config.
- Export `mergeAndPersistData(options)`: merge two data sources and persist result.
- Export `startWatchMode(options)`: use chokidar to watch JSON/YAML files, debounce 100ms, and rerun the selected operation.
- In `main(args)`: call `parseArgs`, then dispatch flags in the order above, invoking each function and exiting or returning results. If no flags, log `Options:` and the parsed options object.

# Testing
- Add unit tests covering `parseArgs`, each operation function, and error handling for unknown flags.
- Integration tests for `main()` verifying dispatch flows and exit codes.

# Documentation
- Update README under **CLI Usage** to list all supported flags with descriptions and inline examples without fenced code blocks.