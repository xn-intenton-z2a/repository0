# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support core operations via flags. Provide structured parsing of flags, clear dispatch logic, and integration with key behaviors: help, version, diagnostics, HTTP server, build workflows, configuration validation, data persistence, and watch mode.

# Flags and Dispatch Order
1. --help              Show usage information and exit(0)
2. --version           Print tool version and exit(0)
3. --diagnostics       Print system diagnostics as formatted JSON and exit(0)
4. --serve             Start HTTP server on PORT or default 3000
5. --build-intermediate Generate intermediate manifest and exit(0)
6. --build-enhanced    Apply enhancement to manifest and exit(0)
7. --refresh           Load and validate config JSON/YAML via Zod, print JSON, and exit(0)
8. --merge-persist     Merge data sources into merged-data.json, print summary, and exit(0)
9. --watch             Watch JSON/YAML files and rerun selected operation on changes

# Implementation
- parseArgs(args: string[]) → options object mapping flags to booleans; unknown flags log error and exit(1).
- printUsage() → usage text listing flags.
- printVersion() → read version from package.json, print, return version.
- printDiagnostics() → gather nodeVersion, platform, cwd, env; print JSON, return object.
- startHttpServer(options) → create HTTP server with /health and /options endpoints; log listening port.
- performBuildIntermediate(options) → locate source.json/yml, parse, count entries, write manifest to temp, return and log summary.
- performBuildEnhanced(options) → read manifest, add timestamp, write enhanced file, return and log report.
- refreshConfiguration() → locate config file, parse JSON/YAML, validate with Zod schema (inputPath, outputPath, timeout, enableFeatureX), return config.
- mergeAndPersistData(options) → read data1.json and data2.json, merge, write merged file, return and log {path, size}.
- startWatchMode(options) → use chokidar to watch *.json and *.y?(a)ml; debounce 100ms; on change rerun serve, build, or refresh based on options.
- main(args) → call parseArgs, then dispatch in above order; return or exit where appropriate.
