# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support structured parsing of core flags and operations. Ensure each flag dispatches to its dedicated action with clear logging, exit codes, and documentation.

# Flags and Subcommands
1. --help
   Show usage information and exit with code 0.
2. --version
   Print the current tool version from package.json and exit with code 0.
3. --diagnostics
   Collect and display system diagnostics (nodeVersion, platform, cwd, env) as formatted JSON and exit with code 0.
4. --serve
   Start an HTTP server on the configured port (default 3000) with endpoints:
   - GET /health → 200, JSON { status: "ok" }
   - GET /options → 200, JSON of parsed CLI options
5. --build-intermediate
   Read a source definition file (source.json or source.yml) in the project root, generate an intermediate JSON manifest in the system temporary directory, log a summary { items, path }, and exit with code 0.
6. --build-enhanced
   Locate the intermediate manifest (via INTERMEDIATE_PATH or default path), add a transformedAt timestamp, write enhanced output to the system temporary directory, log { transformed: true, path }, and exit with code 0.
7. --refresh
   Load and validate config.json or config.yml against a Zod schema, apply defaults, log the validated configuration as formatted JSON, and exit with code 0 or non-zero on validation errors.
8. --merge-persist
   Merge two data sources (data1.json and data2.json) into merged-data.json (configurable via MERGED_PATH), log { path, size }, and exit with code 0.
9. --watch
   Watch JSON and YAML files in the project root using chokidar, debounce change events, and automatically rerun the selected primary operation (serve, build, or refresh) on file changes.

# Implementation

- Export `parseArgs(args: string[])` to map supported flags to a boolean options object, printing an error and exiting with code 1 on unknown flags.
- Export `printUsage()`, `printVersion()`, `printDiagnostics()`, `startHttpServer()`, `performBuildIntermediate()`, `performBuildEnhanced()`, `refreshConfiguration()`, `mergeAndPersistData()`, and `startWatchMode()` with clear responsibilities and return values for testing.
- In `main(args: string[])`, dispatch in this priority:
  1. help
  2. version
  3. diagnostics
  4. serve
  5. build-intermediate
  6. build-enhanced
  7. refresh
  8. merge-persist
  9. watch
  10. fallback to logging parsed options with exit code 0.

# Testing

- Unit tests for each function in `tests/unit/main.test.js` covering:
  * parseArgs: valid and invalid flags and exit behavior.
  * printVersion: reading and returning package.json version.
  * printDiagnostics: returning object keys.
  * startHttpServer: server instance and endpoint behaviors.
  * performBuildIntermediate and performBuildEnhanced: file I/O mocked, manifest creation.
  * refreshConfiguration: valid and invalid config parsing and Zod validation.
  * mergeAndPersistData: data merging and file write behaviors.
  * startWatchMode: chokidar invocation and debounced event handling.
- Integration tests for `main(args)` dispatch flows and correct process exit codes.

# Documentation

- Update `README.md` under **CLI Usage** to list all supported flags with descriptions and inline examples without fenced code blocks.
- Provide separate docs in `docs/CLI_USAGE.md`, `docs/HTTP_SERVER.md`, `docs/BUILD_OPERATIONS.md`, `docs/CONFIG_VALIDATION.md`, `docs/DATA_PERSISTENCE.md`, and `docs/FILE_WATCH_MODE.md`.
