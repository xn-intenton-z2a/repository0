# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser supporting core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help               Show usage information and exit(0)
2. --version            Print the current tool version from package.json and exit(0)
3. --diagnostics        Collect and display system diagnostics (version, platform, cwd, env) as JSON and exit(0)
4. --serve              Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Reload and validate configuration from JSON or YAML using a Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map each supported flag to a boolean options object; on unknown flags log an error and exit(1).
- printUsage(): Display usage text listing each flag and description.
- printVersion(): Read version from package.json, print it, and return the version string.
- printDiagnostics(): Gather process.version, process.platform, process.cwd(), and filtered process.env; print JSON and return diagnostics object.
- startHttpServer(options, port?): Use Node’s http to serve GET /health (200 JSON { status: "ok" }) and GET /options (200 JSON of options); log listening port.
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }.
- performBuildEnhanced(options): Read intermediate manifest via INTERMEDIATE_PATH or default, add transformedAt timestamp, write enhanced file to os.tmpdir(), log and return { transformed: true, path }.
- refreshConfiguration(): Read config.json or config.yml, validate against a Zod schema (inputPath, outputPath, timeout, enableFeatureX), print and return validated config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge into a single object, write merged-data.json or override via env, log and return { path, size }.
- startWatchMode(options): Use chokidar to watch ['*.json','*.y?(a)ml'], debounce events by 100ms, on file change rerun serve, buildIntermediate, buildEnhanced, or refresh based on options; continue until terminated.
- main(args: string[]): Call parseArgs, then dispatch flags in the order above, invoking each function and exiting or returning results where appropriate. If no flags, log "Options:" and the parsed options object.
