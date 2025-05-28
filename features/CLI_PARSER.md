# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support structured parsing of core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print current tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Load and validate configuration from JSON or YAML using a Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- In `src/lib/main.js`, implement `parseArgs(args: string[])` to map supported flags to a boolean options object and exit with code 1 on unknown flags.
- Export `printUsage()`, `printVersion()`, and `printDiagnostics()` functions for help, version, and diagnostics behaviors.
- Export `startHttpServer(options, port)` for `--serve` behavior with `/health` and `/options` endpoints.
- Export `performBuildIntermediate(options)` and `performBuildEnhanced(options)` for build workflows writing JSON manifests to `os.tmpdir()`.
- Export `refreshConfiguration()` that reads and parses `config.json` or `config.yml`, validates with a Zod schema, and returns typed config.
- Export `mergeAndPersistData(options)` to merge `data1.json` and `data2.json` into a merged file and return its path and size.
- Export `startWatchMode(options)` using `chokidar` to watch `['*.json','*.y?(a)ml']` with a 100ms debounce and rerun serve, build, or refresh based on options.
- In `main(args)`, dispatch flags in the order above, calling each function and exiting or returning results appropriately.
