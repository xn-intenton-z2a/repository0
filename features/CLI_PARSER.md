# CLI_PARSER

# Description
Consolidate and refine the main CLI into a structured parser supporting core flags and dispatching dedicated actions. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Each flag triggers a clear action with proper logging and exit codes.

# Flags and Dispatch Order
1. --help               Show usage information and exit with code 0
2. --version            Print the tool version from package.json and exit with code 0
3. --diagnostics        Display system diagnostics (node version, platform, cwd, filtered env) as JSON and exit with code 0
4. --serve              Start an HTTP server on a configurable port (default 3000)
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit with code 0
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest and exit with code 0
7. --refresh            Load and validate config.json or config.yml via Zod schema, print JSON, and exit with code 0
8. --merge-persist      Merge data1.json and data2.json into merged-data.json, log path and size, and exit with code 0
9. --watch              Watch JSON/YAML files, debounce events, and rerun the selected operation until terminated

# Implementation
- Export `parseArgs(args: string[])` that maps each supported flag to a boolean in an options object and calls `process.exit(1)` on unknown flags.
- Export `printUsage()`, `printVersion()`, and `printDiagnostics()` functions:
  - `printUsage()` logs usage text listing all flags.
  - `printVersion()` reads `version` from package.json, logs it, and returns the string.
  - `printDiagnostics()` gathers `process.version`, `process.platform`, `process.cwd()`, and selected entries of `process.env`, logs JSON, and returns the object.
- Export operational functions:
  - `startHttpServer(options, port?)` uses Node’s http to serve GET /health and GET /options endpoints, logs the listening port, and returns the server.
  - `performBuildIntermediate(options)` locates and parses source.json or source.yml, counts entries, writes an intermediate manifest to os.tmpdir(), logs and returns `{ items, path }`.
  - `performBuildEnhanced(options)` reads an intermediate manifest via `INTERMEDIATE_PATH` or default, adds a `transformedAt` timestamp, writes an enhanced file to os.tmpdir(), logs and returns `{ transformed: true, path }`.
  - `refreshConfiguration()` loads config.json or config.yml, validates with a Zod schema (`inputPath`, `outputPath`, `timeout`, `enableFeatureX`), prints and returns the typed config.
  - `mergeAndPersistData(options)` reads data1.json and data2.json, merges them, writes `merged-data.json` or an override, logs and returns `{ path, size }`.
  - `startWatchMode(options)` uses `chokidar.watch(['*.json','*.y?(a)ml'], { ignoreInitial: true })` to watch files, debounces events by 100 ms, reruns serve, build-intermediate, build-enhanced, or refresh based on options, and logs file events when no primary flag is set.
- In `main(args: string[])`, call `parseArgs`, then dispatch flags in the order above, invoking each function and exiting or returning results. If no flags, log `Options:` and the parsed options object.
