# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser supporting core flags and dispatching to dedicated actions. Each flag triggers a dedicated function with clear logging, exit codes, and documentation. Supported operations include:

- --help: Show usage information and exit(0)
- --version: Print the current tool version from package.json and exit(0)
- --diagnostics: Display system diagnostics (node version, platform, cwd, env) as JSON and exit(0)
- --serve: Start an HTTP server on a configurable port with /health and /options endpoints
- --build-intermediate: Generate an intermediate manifest from source.json or source.yml and exit(0)
- --build-enhanced: Execute enhanced build transformations on the intermediate manifest and exit(0)
- --refresh: Load and validate config.json or config.yml using a Zod schema, print JSON, and exit(0)
- --merge-persist: Merge data1.json and data2.json into merged-data.json, log { path, size }, and exit(0)
- --watch: Watch JSON/YAML files and debounce change events (100ms) to rerun the selected operation until terminated

# Implementation
- parseArgs(args: string[]): Map supported flags to a boolean options object; on unknown flags log an error and exit(1)
- printUsage(): Display usage text listing all flags and descriptions
- printVersion(): Read version from package.json, log and return the version string
- printDiagnostics(): Gather process.version, process.platform, process.cwd(), and process.env; print JSON and return the diagnostics object
- startHttpServer(options, port?): Use Node http module to serve GET /health and GET /options; log listening port and return the server instance
- performBuildIntermediate(options): Locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }
- performBuildEnhanced(options): Read intermediate manifest via env or default, add transformedAt timestamp, write enhanced output to os.tmpdir(), log and return { transformed, path }
- refreshConfiguration(): Load config.json or config.yml, validate with a Zod schema (inputPath, outputPath, timeout, enableFeatureX), print JSON, and return the validated config
- mergeAndPersistData(options): Read data1.json and data2.json, merge, write merged-data.json or use environment override, log and return { path, size }
- startWatchMode(options): Use chokidar to watch ['*.json','*.y?(a)ml'], debounce events by 100ms, on change rerun serve, buildIntermediate, buildEnhanced, or refresh based on options; log file events when no primary flag is set
- main(args: string[]): Call parseArgs, then dispatch flags in the order above, invoking each function and exiting or returning results. If no flags, log 'Options:' and the parsed options object
