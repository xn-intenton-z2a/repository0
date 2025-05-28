# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser supporting core flags and operations. Users invoke a single entry point with validated flags to perform help, version reporting, diagnostics, HTTP serving, build-intermediate, build-enhanced, configuration validation, data persistence, and watch mode. Ensure clear dispatch logic, consistent logging, and proper exit codes.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print tool version from package.json and exit(0)
3. --diagnostics       Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve             Start an HTTP server on a configurable port with /health and /options endpoints
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Execute enhanced build transformations on the intermediate manifest and exit(0)
7. --refresh           Load and validate configuration from JSON or YAML using a Zod schema, print JSON, and exit(0)
8. --merge-persist     Merge data sources and write the combined JSON to disk, log { path, size }, and exit(0)
9. --watch             Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
- **parseArgs(args: string[])**: Map supported flags to a boolean options object and exit(1) on unknown flags.
- **printUsage()**: Output usage text listing all flags.
- **printVersion()**: Read and print version from `package.json`, return string for testing.
- **printDiagnostics()**: Gather `process.version`, `process.platform`, `process.cwd()`, and filtered `process.env`; print JSON and return object.
- **startHttpServer(options, port)**: Use Node `http` to serve GET `/health` and `/options`; log listening port.
- **performBuildIntermediate(options)**: Locate and parse `source.json` or `source.yml`, count entries, write manifest to `os.tmpdir()`, log and return summary.
- **performBuildEnhanced(options)**: Read manifest via `INTERMEDIATE_PATH` or default, add timestamp, write enhanced to `os.tmpdir()`, log and return report.
- **refreshConfiguration()**: Load and parse `config.json` or `config.yml`, validate with Zod schema `{ inputPath, outputPath, timeout, enableFeatureX }`, print and return config.
- **mergeAndPersistData(options)**: Read `data1.json` and `data2.json`, merge, write `merged-data.json`, log and return `{ path, size }`.
- **startWatchMode(options)**: Use `chokidar` to watch `['*.json','*.y?(a)ml']`, debounce events by 100ms, on file change rerun serve, build, or refresh based on options.
- **main(args: string[])**: Call `parseArgs`, then dispatch flags in the order above, handling each action by calling its function and exiting or returning result.
