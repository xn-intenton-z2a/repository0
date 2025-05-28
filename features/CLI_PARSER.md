# CLI_PARSER

# Description
Consolidate and refine the command-line interface to handle core operations via validated flags. Users invoke a single entry point with flags to perform help, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and watch mode. This unified parser ensures clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print the current tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced   Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Reload and validate configuration from JSON or YAML via a Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch            Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): map each supported flag to a boolean in an options object; on unknown flags log error and exit(1)
- printUsage(): display usage text listing supported flags and descriptions
- printVersion(): read and return the version field from package.json, print and return the string
- printDiagnostics(): gather process.version, process.platform, process.cwd(), and filtered process.env entries, print JSON and return the object
- startHttpServer(options, port): use Node’s http to serve GET /health and GET /options with JSON responses; log listening port
- performBuildIntermediate(options): locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }
- performBuildEnhanced(options): read intermediate manifest from INTERMEDIATE_PATH or default, add a transformedAt timestamp, write enhanced JSON to os.tmpdir(), log and return { transformed, path }
- refreshConfiguration(): locate and parse config.json or config.yml, validate against a Zod schema (inputPath, outputPath, timeout, enableFeatureX), print and return validated config object
- mergeAndPersistData(options): read data1.json and data2.json, merge into a single object, write merged-data.json or environment override, log and return { path, size }
- startWatchMode(options): use chokidar to watch patterns ["*.json","*.y?(a)ml"], debounce events by 100ms, on each add/change/unlink rerun serve, build-intermediate, build-enhanced or refresh tasks based on options, log file events when no primary flag is set
- main(args: string[]): call parseArgs, then dispatch flags in the above order, handling each action with exits or returns; if no flags, log 'Options:' and the parsed options object