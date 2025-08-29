# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser supporting core flags and dispatching to dedicated actions. Each flag triggers a dedicated function, with clear logging and proper exit codes. Supported operations include help, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and file watch mode.

# Flags and Dispatch Order
1. --help              Show usage information and exit with code 0.
2. --version           Print current tool version from package.json and exit with code 0.
3. --diagnostics       Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit with code 0.
4. --serve             Start an HTTP server on a configurable port (default 3000) with endpoints /health and /options.
5. --build-intermediate  Generate an intermediate manifest from source.json or source.yml and exit with code 0.
6. --build-enhanced    Apply enhanced build transformations on the intermediate manifest and exit with code 0.
7. --refresh           Load and validate configuration from JSON or YAML via a Zod schema, print JSON, and exit with code 0.
8. --merge-persist     Merge data1.json and data2.json into merged-data.json, log the file path and size, and exit with code 0.
9. --watch             Watch JSON/YAML files and debounce change events (100ms) to rerun the selected operation until terminated.

# Implementation
- parseArgs(args: string[]): Recognize supported flags and return a boolean options object; on unknown flags log an error and exit with code 1.
- printUsage(): Display usage text listing all flags and descriptions.
- printVersion(): Read version from package.json, print and return the version string.
- printDiagnostics(): Gather process.version, process.platform, process.cwd(), and process.env; print JSON and return the diagnostics object.
- startHttpServer(options, port?): Use Node’s http module to serve GET /health and GET /options endpoints; log listening port and return the server instance.
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }.
- performBuildEnhanced(options): Read the intermediate manifest via INTERMEDIATE_PATH or default, add a transformedAt timestamp, write enhanced output to os.tmpdir(), log and return { transformed, path }.
- refreshConfiguration(): Load and parse config.json or config.yml, validate with a Zod schema (inputPath, outputPath, timeout, enableFeatureX), print and return the validated config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge, write merged-data.json or use environment override, log and return { path, size }.
- startWatchMode(options): Use chokidar to watch patterns ['*.json','*.y?(a)ml'], debounce events by 100ms, on change rerun serve, buildIntermediate, buildEnhanced, or refresh based on options; log file events when no primary flag is set.
- main(args: string[]): Call parseArgs, then dispatch flags in the above order, invoking each function and exiting or returning results. If no flags, log 'Options:' and the options object.