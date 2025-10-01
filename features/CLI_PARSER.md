# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser supporting core flags and dispatching to dedicated actions. Users invoke a single entry point with validated flags to perform: help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and file watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help               Show usage information and exit with code 0
2. --version            Print the tool version and exit with code 0
3. --diagnostics        Collect and display system diagnostics (version, platform, cwd, env) as JSON and exit with code 0
4. --serve              Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit with code 0
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest and exit with code 0
7. --refresh            Load and validate config.json or config.yml via a Zod schema, print JSON, and exit with code 0
8. --merge-persist      Merge data1.json and data2.json into merged-data.json, log path and size, and exit with code 0
9. --watch              Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map each supported flag to a boolean in an options object; on unknown flags log an error and exit(1).
- printUsage(): Display usage text listing all flags.
- printVersion(): Read version from package.json, log and return the string.
- printDiagnostics(): Gather process.version, process.platform, process.cwd(), and filtered process.env; print JSON and return object.
- startHttpServer(options, port?): Use Node http module to serve GET /health and GET /options, log listening port.
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return summary.
- performBuildEnhanced(options): Read intermediate manifest via INTERMEDIATE_PATH or default, add transformedAt timestamp, write enhanced output, log and return report.
- refreshConfiguration(): Load config.json or config.yml, validate with a Zod schema, print and return config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge, write merged-data.json, log and return summary.
- startWatchMode(options): Use chokidar to watch patterns ['*.json','*.y?(a)ml'], debounce 100ms, on change rerun serve, buildIntermediate, buildEnhanced, or refresh based on options, log file events when no primary flag is set.
- main(args: string[]): Call parseArgs, then dispatch flags in the order above, invoking each function and exiting or returning results. If no flags, log 'Options:' and the parsed options object.