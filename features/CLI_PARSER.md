# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser supporting core flags and operations. Users invoke a single entry point with flags to perform help, version reporting, diagnostics mode, HTTP serving, build-intermediate, build-enhanced, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. **--help**            Show usage information and exit(0)
2. **--version**         Print tool version from package.json and exit(0)
3. **--diagnostics**     Print system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. **--serve**           Start an HTTP server on PORT or default 3000 with /health and /options endpoints
5. **--build-intermediate**  Generate intermediate manifest from source.json or source.yml and exit(0)
6. **--build-enhanced** Execute enhancement on the intermediate manifest and exit(0)
7. **--refresh**         Load and validate configuration from JSON or YAML via Zod schema, print JSON, and exit(0)
8. **--merge-persist**   Merge data1.json and data2.json into merged-data.json, print summary, and exit(0)
9. **--watch**           Watch JSON/YAML files and debounce change events to rerun selected operation until terminated

# Implementation
- **parseArgs(args)**: Map supported flags to a boolean options object; on unknown flags, log error and exit(1).
- **printUsage()**: Output usage text listing each flag and description.
- **printVersion()**: Read version field from package.json, print and return it.
- **printDiagnostics()**: Collect process.version, process.platform, process.cwd(), and process.env; print JSON and return object.
- **startHttpServer(options, port?)**: Use Node http to serve GET `/health` (200 JSON { status: "ok" }) and GET `/options` (200 JSON of options) and 404 for other paths; log listening port.
- **performBuildIntermediate(options)**: Locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return `{ items, path }`.
- **performBuildEnhanced(options)**: Read intermediate manifest via INTERMEDIATE_PATH or default, add `transformedAt`, write enhanced file to os.tmpdir(), log and return `{ transformed, path }`.
- **refreshConfiguration()**: Read config.json or config.yml, validate against a Zod schema with fields `inputPath`, `outputPath`, `timeout`, `enableFeatureX`, print and return typed config.
- **mergeAndPersistData(options)**: Read data1.json and data2.json, merge into one object, write to merged-data.json or environment override, log and return `{ path, size }`.
- **startWatchMode(options)**: Use chokidar to watch patterns `['*.json','*.y?(a)ml']`, debounce 100ms, on file add/change/unlink rerun serve, build-intermediate, build-enhanced, or refresh based on options; log file events.
- **main(args)**: Call `parseArgs`, then dispatch flags in the above order: help, version, diagnostics, serve, build-intermediate, build-enhanced, refresh, merge-persist, watch, fallback to log `Options:` and options object.

# Testing
Add unit tests for each function in `tests/unit/main.test.js` covering valid flag parsing, error for unknown flags, each operation function’s behavior with mocks, and integration tests for `main(args)` dispatch and exit codes.

# Documentation
Update `README.md` under **CLI Usage** to list all flags with descriptions and inline examples, and refer to detailed docs in `docs/CLI_PARSER.md`.