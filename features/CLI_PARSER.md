# CLI_PARSER

# Description
Consolidate the command-line interface to handle parsing of core flags and dispatch to dedicated actions, including an embedded HTTP server when requested. Users invoke a single entrypoint with flags to perform help, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and watch mode.

# Flags and Operations
1. --help               Show usage information and exit(0)
2. --version            Print tool version from package.json and exit(0)
3. --diagnostics        Collect and display system diagnostics (version, platform, cwd, env) as JSON and exit(0)
4. --serve              Start an HTTP server on specified port (default 3000)
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced     Apply enhancement to an intermediate manifest and exit(0)
7. --refresh            Load and validate configuration (config.json or config.yml) via Zod schema and exit(0)
8. --merge-persist      Merge data1.json and data2.json into merged-data.json, log path and size, and exit(0)
9. --watch              Watch JSON/YAML files and debounce change events to rerun the selected primary operation until terminated

# Implementation
- parseArgs(args: string[]): map each supported flag to a boolean in an options object; unknown flags log an error and exit(1).
- printUsage(): display usage text listing all supported flags.
- printVersion(): read the version field from package.json, log it, and return the version string.
- printDiagnostics(): gather process.version, process.platform, process.cwd(), and filtered process.env; print JSON and return the diagnostics object.
- startHttpServer(options, port?): use Node’s http module to serve:
  - GET /health → 200, JSON { status: "ok" }
  - GET /options → 200, JSON of the parsed options
  - Other paths → 404, JSON { error: "Not Found" }
  Call server.listen(port) and log "Server listening on port <port>".
- performBuildIntermediate(options): locate and parse source.json or source.yml, count entries, write an intermediate manifest to os.tmpdir(), log and return { items, path }.
- performBuildEnhanced(options): read the intermediate manifest (via env or default), add a transformedAt timestamp, write enhanced output to os.tmpdir(), log and return { transformed: true, path }.
- refreshConfiguration(): read config.json or config.yml, validate raw object against a Zod schema with fields inputPath, outputPath, timeout, enableFeatureX, apply defaults, return typed config.
- mergeAndPersistData(options): read data1.json and data2.json, merge into a combined object, write to merged-data.json or override via env, log and return { path, size }.
- startWatchMode(options): import chokidar to watch patterns ['*.json','*.y?(a)ml'], debounce events by 100ms, on file change rerun serve, build, or refresh tasks based on options.
- main(args): call parseArgs, then dispatch in the order above, invoking each function and exiting or returning results. If no flag is provided, log "Options:" and the parsed options object.

# Testing
- Use vitest to add unit tests in tests/unit/main.test.js:
  • parseArgs: valid flag combinations, no flags, invalid flag exit behavior.
  • printVersion, printDiagnostics: spy on console.log and return values.
  • startHttpServer: verify server instance, endpoints behavior via simulated HTTP requests.
  • performBuildIntermediate, performBuildEnhanced: mock fs and os.tmpdir to test manifest writing and reports.
  • refreshConfiguration: mock fs and yaml to supply JSON/YAML configs and assert Zod validation and defaults.
  • mergeAndPersistData: mock fs to read JSON files, write merged file, and return size.
  • startWatchMode: spy on chokidar.watch, simulate file events with fake timers to confirm debounce and task invocations.
  • main(): integration tests for each flag flow, spying on process.exit and console.log.

# Documentation
- Update README.md under **CLI Usage** to list all supported flags with descriptions and provide inline examples (no fenced code blocks) for each command, such as:
  npm run start -- --help
  npm run start -- --version
  npm run diagnostics
  npm run serve
  npm run build-intermediate
  npm run build-enhanced
  npm run refresh
  npm run merge-persist
  npm run start -- --serve --watch