# CLI_PARSER

# Description
Consolidate the single-entry CLI into a structured parser supporting core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print current tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve             Start HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Reload and validate configuration from JSON or YAML via Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to rerun the selected operation until terminated

# Implementation
- In `src/lib/main.js`, export `parseArgs(args: string[])` to map supported flags to a boolean options object and exit(1) on unknown flags.
- Export `printUsage()`, `printVersion()`, and `printDiagnostics()` for help, version, and diagnostics behaviors respectively.
- Export `startHttpServer(options, port)` for `--serve` behavior with `/health` and `/options` endpoints.
- Export `performBuildIntermediate(options)` and `performBuildEnhanced(options)` for build workflows writing JSON manifests to the system temp directory.
- Export `refreshConfiguration()` that reads and validates config files with Zod schema and returns typed config.
- Export `mergeAndPersistData(options)` to merge two data sources and persist the result, returning summary.
- Export `startWatchMode(options)` using `chokidar` to watch JSON/YAML files and debounce events, rerunning serve, build, or refresh based on options.
- In `main(args)`, dispatch flags in the order above, calling each function and exiting or returning results. If no flags, log `Options:` and the parsed options object.

# Testing
Add unit tests in `tests/unit/main.test.js` covering:
- `parseArgs` behavior for valid and unknown flags
- `printUsage`, `printVersion`, `printDiagnostics` outputs and exit codes
- `startHttpServer` instance and endpoint behaviors
- `performBuildIntermediate` and `performBuildEnhanced` with file I/O mocks
- `refreshConfiguration` valid and invalid config via Zod schema
- `mergeAndPersistData` merge logic and file writing
- `startWatchMode` watcher setup and debounced event handling
- Integration tests for `main(args)` dispatch flows and process exit codes

# Documentation
Update `README.md` under **CLI Usage** to list all supported flags with descriptions and examples, and maintain separate docs in `docs/CLI_PARSER.md`, `docs/HTTP_SERVER.md`, `docs/BUILD_OPERATIONS.md`, `docs/CONFIG_VALIDATION.md`, `docs/DATA_PERSISTENCE.md`, and `docs/FILE_WATCH_MODE.md`.