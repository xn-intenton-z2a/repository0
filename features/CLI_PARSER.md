# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser supporting core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate  Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced   Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Load and validate configuration from JSON or YAML using a Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): map supported flags to boolean options; exit(1) on unknown flags
- printUsage(): display usage text listing flags
- printVersion(): read and print version from package.json; return version
- printDiagnostics(): gather process.version, process.platform, process.cwd(), and process.env; print JSON; return object
- startHttpServer(options, port): use Node http to serve GET /health and GET /options; log listening port
- performBuildIntermediate(options): locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }
- performBuildEnhanced(options): read intermediate manifest, add timestamp, write enhanced output to os.tmpdir(), log and return { transformed, path }
- refreshConfiguration(): load and parse config.json or config.yml, validate with Zod schema (inputPath, outputPath, timeout, enableFeatureX); print and return config
- mergeAndPersistData(options): read data1.json and data2.json, merge, write merged-data.json or override; print and return { path, size }
- startWatchMode(options): use chokidar to watch ["*.json","*.y?(a)ml"], debounce 100ms, on change rerun serve, build, or refresh based on options
- main(args: string[]): call parseArgs, then dispatch flags in above order; for each flag call its function and exit or return result; fallback logs "Options:" and options object