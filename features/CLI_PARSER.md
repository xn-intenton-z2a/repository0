# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support structured parsing of core flags and dispatch to dedicated actions. Users invoke a single entrypoint with flags to perform help, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print the current tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (node version, platform, cwd, selected env) as JSON and exit(0)
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Load and validate configuration from JSON or YAML via Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and persist the combined result to disk, print summary, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map supported flags to a boolean options object; on unknown flags log error and exit(1).
- printUsage(): Display usage text listing each flag and description.
- printVersion(): Read and print the version field from package.json; return the version string.
- printDiagnostics(): Gather process.version, process.platform, process.cwd(), and filtered process.env; print JSON and return the diagnostics object.
- startHttpServer(options, port?): Use Node’s http module to serve GET /health and GET /options; log listening port and return the server instance.
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }.
- performBuildEnhanced(options): Read intermediate manifest via INTERMEDIATE_PATH or default, add transformedAt timestamp, write enhanced output to os.tmpdir(), log and return { transformed: true, path }.
- refreshConfiguration(): Load and parse config.json or config.yml, validate against a Zod schema with fields inputPath, outputPath, timeout, enableFeatureX; print and return the validated config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge them, write merged-data.json or override, log and return { path, size }.
- startWatchMode(options): Use chokidar to watch patterns ['*.json','*.y?(a)ml'], debounce events by 100ms, on file change rerun serve, build, or refresh based on options; continue until terminated.
- main(args: string[]): Call parseArgs, then dispatch in the order above, invoking each function and exiting or returning results. If no flags, log 'Options:' and the options object.

# Testing
- Unit tests for each exported function in `tests/unit/main.test.js`, covering valid and invalid flags, behavior of each action, HTTP endpoints, file I/O mocks, Zod validation, watch mode event handling, and integration tests for `main(args)` dispatch flows and exit codes.

# Documentation
- Update `README.md` under **CLI Usage** to list all supported flags with descriptions and inline examples without fenced code blocks. Provide separate documentation in `features/CLI_PARSER.md` for details and examples.