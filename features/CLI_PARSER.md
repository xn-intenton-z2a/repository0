# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support structured parsing of core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print the current tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Load and validate configuration from JSON or YAML via Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]) ⇒ map supported flags to boolean options; unknown flags log an error and exit(1).
- printUsage() ⇒ display usage text listing supported flags.
- printVersion() ⇒ read and print version from package.json; return version string.
- printDiagnostics() ⇒ gather process.version, process.platform, process.cwd(), and process.env; print JSON and return diagnostics.
- startHttpServer(options, port?) ⇒ use Node http module to serve /health and /options; log listening port and return http.Server.
- performBuildIntermediate(options) ⇒ locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return summary.
- performBuildEnhanced(options) ⇒ read intermediate manifest via INTERMEDIATE_PATH or default, add transformedAt timestamp, write enhanced JSON to os.tmpdir(), log and return report.
- refreshConfiguration() ⇒ load config.json or config.yml, validate against a Zod schema (inputPath, outputPath, timeout, enableFeatureX), print and return config.
- mergeAndPersistData(options) ⇒ read data1.json and data2.json, merge into a single object, write merged.json, log and return { path, size }.
- startWatchMode(options) ⇒ use chokidar to watch patterns ['*.json','*.y?(a)ml'], debounce events 100ms, on change rerun serve, build, or refresh according to options.
- main(args: string[]) ⇒ call parseArgs, then dispatch flags in the order above, calling each function and exiting or returning results. If no flags, log 'Options:' and the options object.
