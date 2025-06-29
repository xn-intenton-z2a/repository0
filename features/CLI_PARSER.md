# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support structured parsing of core flags and dispatch to dedicated actions. Users invoke a single entrypoint with validated flags to perform help, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print the current tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (node version, platform, cwd, env) as JSON and exit(0)
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Load and validate configuration from JSON or YAML via Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and persist the combined result to disk, print summary, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map supported flags to a boolean options object; on unknown flags log error and exit(1).
- printUsage(): Display usage text listing supported flags.
- printVersion(): Read version from package.json, print and return version.
- printDiagnostics(): Gather process.version, process.platform, process.cwd(), and process.env; print JSON and return object.
- startHttpServer(options, port?): Use Node http to serve GET /health and GET /options; log listening port and return http.Server.
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }.
- performBuildEnhanced(options): Read intermediate manifest via INTERMEDIATE_PATH or default, add transformedAt timestamp, write enhanced output to os.tmpdir(), log and return { transformed, path }.
- refreshConfiguration(): Load and parse config.json or config.yml, validate against Zod schema (inputPath, outputPath, timeout, enableFeatureX), print and return typed config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge, write merged-data.json or override, log and return { path, size }.
- startWatchMode(options): Use chokidar to watch patterns ['*.json','*.y?(a)ml'], debounce events by 100ms, on file change rerun serve, build, or refresh based on options.
- main(args: string[]): Call parseArgs, then dispatch in the order above, invoking each function and exiting or returning results. If no flags, log 'Options:' and the parsed options object.

# Testing
- Write unit tests for each function in tests/unit/main.test.js covering flag parsing, error handling, HTTP server behavior, build and config flows, data persistence, and watch mode.
- Integration tests for main() dispatch and exit codes.