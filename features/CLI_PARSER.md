# CLI_PARSER

# Description
Consolidate and refine the command-line interface into a structured parser supporting core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help               Show usage information and exit(0)
2. --version            Print tool version from package.json and exit(0)
3. --diagnostics        Collect and display system diagnostics (version, platform, cwd, env) as JSON and exit(0)
4. --serve              Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh            Load and validate configuration from JSON or YAML via Zod schema, print JSON, and exit(0)
8. --merge-persist      Merge data sources and persist to disk, print summary, and exit(0)
9. --watch              Watch JSON/YAML files, debounce change events (100ms), and rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map each supported flag to a boolean in an options object; on unknown flags log error and exit(1).
- printUsage(): Output usage text listing all supported flags and descriptions.
- printVersion(): Read `version` from package.json, print and return it.
- printDiagnostics(): Collect `process.version`, `process.platform`, `process.cwd()`, `process.env`; print JSON and return object.
- startHttpServer(options, port?): Use Node’s http module to serve:
  - GET /health → 200, JSON `{ status: "ok" }`
  - GET /options → 200, JSON of parsed options
  - Others → 404, JSON `{ error: "Not Found" }`
  Call `server.listen(port)` and log listening port.
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write intermediate manifest to `os.tmpdir()`, log and return `{ items, path }`.
- performBuildEnhanced(options): Read intermediate manifest via env or default, add `transformedAt`, write enhanced JSON to `os.tmpdir()`, log and return `{ transformed: true, path }`.
- refreshConfiguration(): Load config.json or config.yml, validate via Zod schema, print formatted JSON, return typed config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge, write merged-data.json or override, log and return `{ path, size }`.
- startWatchMode(options): Use chokidar to watch patterns `['*.json','*.y?(a)ml']`, debounce events 100ms, on file change rerun serve, buildIntermediate, buildEnhanced, or refresh based on options.
- main(args): Call parseArgs, then dispatch in above order, invoking each function and exiting or returning results. If no flags, log `Options:` and the options object.
