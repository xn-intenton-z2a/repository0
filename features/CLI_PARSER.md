# CLI_PARSER

# Description
Consolidate and refine the command-line interface into a structured parser supporting core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help               Show usage information and exit(0)
2. --version            Print tool version from package.json and exit(0)
3. --diagnostics        Collect and display system diagnostics (node version, platform, cwd, env) as JSON and exit(0)
4. --serve              Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Load and validate configuration from JSON or YAML via Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map supported flags to a boolean options object; on unknown flags log an error and exit(1).
- printUsage(): Display usage text listing all flags and descriptions.
- printVersion(): Read and return the version from package.json and log it.
- printDiagnostics(): Gather process.version, platform, cwd, and selected env vars; print JSON and return object.
- startHttpServer(options, port): Use Node’s http to serve GET /health and GET /options with JSON responses; log listening port.
- performBuildIntermediate(options): Locate source.json or source.yml, parse and count entries, write intermediate manifest to os.tmpdir(), log and return summary.
- performBuildEnhanced(options): Read intermediate manifest via INTERMEDIATE_PATH or default, add transformedAt, write enhanced output to os.tmpdir(), log and return report.
- refreshConfiguration(): Load config.json or config.yml, validate against a Zod schema (inputPath, outputPath, timeout, enableFeatureX), print and return config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge into one object, write merged-data.json or override via env, log and return { path, size }.
- startWatchMode(options): Use chokidar to watch ["*.json","*.y?(a)ml"], debounce events by 100ms, on change rerun serve, buildIntermediate, buildEnhanced, or refresh based on options.
- main(args: string[]): Call parseArgs, then dispatch flags in the order above, invoking each function and exiting or returning results. If no flags, log "Options:" and the options object.
