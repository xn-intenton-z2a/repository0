# CLI_PARSER

# Description
Consolidate and refine the command-line interface into a structured parser supporting core flags and dispatching to dedicated actions. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics mode, HTTP serving, build workflows, configuration validation, data persistence, and watch mode.

# Flags and Dispatch Order
1. --help               Show usage information and exit(0)
2. --version            Print the current tool version from package.json and exit(0)
3. --diagnostics        Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve              Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh            Load and validate configuration from JSON or YAML via a Zod schema, print JSON, and exit(0)
8. --merge-persist      Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch              Watch JSON and YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map supported flags to a boolean options object; on unknown flags log error and exit(1).
- printUsage(): Display usage text listing supported flags and their descriptions.
- printVersion(): Read and log the version from package.json; return the version string.
- printDiagnostics(): Gather process.version, process.platform, process.cwd(), and filtered process.env; print as JSON and return diagnostics.
- startHttpServer(options, port?): Use Node’s http module to create a server serving GET /health and GET /options endpoints; log listening port and return the server instance.
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write an intermediate manifest to os.tmpdir(), log and return { items, path }.
- performBuildEnhanced(options): Read the intermediate manifest via INTERMEDIATE_PATH or default, add a transformedAt timestamp, write enhanced output to os.tmpdir(), log and return { transformed, path }.
- refreshConfiguration(): Load and parse config.json or config.yml, validate against a Zod schema with fields inputPath, outputPath, timeout, enableFeatureX, print and return the validated config.
- mergeAndPersistData(options): Read data1.json and data2.json, merge into a single object, write merged-data.json (or environment override), log and return { path, size }.
- startWatchMode(options): Use chokidar to watch ['*.json','*.y?(a)ml'], debounce events with a 100 ms delay, on file events rerun serve, buildIntermediate, buildEnhanced, or refresh based on options; log file events when no primary flag is set.
- main(args: string[]): Call parseArgs, then dispatch flags in the order above. Invoke each function and exit or return results appropriately; if no flags, log 'Options:' and the options object.
