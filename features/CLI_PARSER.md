# CLI_PARSER

# Description
Consolidate the single-entry CLI into a structured parser that supports core flags and operations. Users invoke a single entry point with validated flags to perform:

- **--help**: Show usage information and exit with code 0
- **--version**: Print the current tool version from package.json and exit with code 0
- **--diagnostics**: Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit with code 0
- **--serve**: Start an HTTP server on a configurable port with /health and /options endpoints
- **--build-intermediate**: Generate an intermediate manifest from source.json or source.yml and exit with code 0
- **--build-enhanced**: Execute enhanced build transformations on the intermediate manifest and exit with code 0
- **--refresh**: Load and validate configuration from JSON or YAML using a Zod schema, print JSON, and exit with code 0
- **--merge-persist**: Merge data sources and write the combined JSON to disk, log { path, size }, and exit with code 0
- **--watch**: Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
1. parseArgs(args: string[]): map supported flags to a boolean options object; on unknown flags log an error and exit(1).
2. printUsage(): display usage text listing all flags and descriptions.
3. printVersion(): read and return the version field from package.json, print and return the string.
4. printDiagnostics(): gather process.version, process.platform, process.cwd(), and selected process.env entries; print JSON and return the object.
5. startHttpServer(options, port?): use Node’s http module to serve GET /health and GET /options endpoints; log listening port and return http.Server instance.
6. performBuildIntermediate(options): locate and parse source.json or source.yml, count entries, write intermediate manifest to os.tmpdir(), log and return { items, path }.
7. performBuildEnhanced(options): read the intermediate manifest via INTERMEDIATE_PATH or default, add transformedAt timestamp, write enhanced output to os.tmpdir(), log and return { transformed, path }.
8. refreshConfiguration(): load and parse config.json or config.yml, validate against a Zod schema (inputPath, outputPath, timeout, enableFeatureX), print and return typed config.
9. mergeAndPersistData(options): read data1.json and data2.json, merge them, write merged-data.json or environment override, log and return { path, size }.
10. startWatchMode(options): use chokidar to watch ["*.json","*.y?(a)ml"], debounce events by 100 ms, rerun serve, buildIntermediate, buildEnhanced, or refresh based on options, and return the watcher.
11. main(args: string[]): call parseArgs, then dispatch flags in the order above, invoking each function and exiting or returning results. If no flags, log `Options:` and the options object.