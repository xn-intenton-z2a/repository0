# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI into a structured parser that supports core operations via flags. Each flag triggers a dedicated action with clear logging and exit codes. The supported flags and their dispatch order:

1. --help             Show usage information and exit(0)
2. --version          Print the tool version from package.json and exit(0)
3. --diagnostics      Print system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. --serve            Start an HTTP server on a specific port (default 3000) with /health and /options endpoints
5. --build-intermediate  Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced  Read intermediate manifest, add a timestamp, produce enhanced output, and exit(0)
7. --refresh          Load and validate config.json or config.yml using a Zod schema, print JSON, and exit(0)
8. --merge-persist    Merge data1.json and data2.json into merged-data.json, print summary, and exit(0)
9. --watch           Watch JSON/YAML files for changes and rerun the selected primary operation on file events

# Implementation
In `src/lib/main.js`:

- Export `parseArgs(args: string[])`: iterate supported flags, map to boolean options, error and exit(1) on unknown flags.
- Export `printUsage()`: output usage text listing all flags.
- Export `printVersion()`: read and print version from `package.json`, return version.
- Export `printDiagnostics()`: collect `process.version`, `process.platform`, `process.cwd()`, `process.env`; print JSON and return data.
- Export `startHttpServer(options, port?)`: use Node `http` to serve `/health` and `/options` endpoints.
- Export `performBuildIntermediate(options)`: locate and parse `source.json` or `source.yml`, count entries, write intermediate manifest to `os.tmpdir()`, log and return summary.
- Export `performBuildEnhanced(options)`: read manifest (via `INTERMEDIATE_PATH` or default), add `transformedAt`, write enhanced file to `os.tmpdir()`, log and return report.
- Export `refreshConfiguration()`: load and parse `config.json` or `config.yml`, validate against a Zod schema with fields `inputPath`, `outputPath`, `timeout`, `enableFeatureX`, return validated config.
- Export `mergeAndPersistData(options)`: read `data1.json` and `data2.json`, merge, write `merged-data.json` or environment override, log and return `{path, size}`.
- Export `startWatchMode(options)`: import `chokidar` to watch `*.json` and `*.y?(a)ml`, debounce events with 100ms delay, on file changes rerun `serve`, `buildIntermediate`, `buildEnhanced`, or `refresh` functions according to `options`.
- In `main(args)`: call `parseArgs`, then dispatch flags in the order above. Exit or return each operation result. If no flags, log `Options:` and the options object.
