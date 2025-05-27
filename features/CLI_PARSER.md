# CLI_PARSER

# Description
Consolidate and refine the single-entry CLI to handle all core operations with validated flags, including help, version, diagnostics, HTTP serve, build modes, configuration validation, data persistence, and watch mode. Ensure each flag dispatches to its dedicated action with clear logging and exit codes.

# Flags and Subcommands
1. --help               Show usage information and exit with code 0
2. --version            Print current tool version from package.json and exit with code 0
3. --diagnostics        Print system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit with code 0
4. --serve              Start HTTP server on PORT env or default 3000
5. --build-intermediate Generate intermediate manifest from source.json or source.yml and exit with code 0
6. --build-enhanced     Read intermediate manifest, add timestamp, produce enhanced output, and exit with code 0
7. --refresh            Load and validate config.json or config.yml against Zod schema, print config JSON, and exit with code 0 or nonzero on validation error
8. --merge-persist      Merge data1.json and data2.json into merged-data.json, print result summary, and exit with code 0
9. --watch              Watch JSON/YAML files, debounce changes, and rerun the selected operation (serve, build, or refresh) until terminated

# Implementation
- Parse flags into a boolean options object; unknown flags cause error log and exit(1).
- Export functions:
  • printUsage() – usage text
  • printVersion() – reads and prints package.json version
  • printDiagnostics() – gathers and prints diagnostics JSON
  • startHttpServer(options) – serves /health and /options
  • performBuildIntermediate(options) – reads source, counts entries, writes intermediate manifest
  • performBuildEnhanced(options) – reads manifest, transforms, writes enhanced output
  • refreshConfiguration() – loads and validates config with Zod schema
  • mergeAndPersistData(options) – merges two data sources and persists
  • startWatchMode(options) – uses chokidar to watch files and rerun tasks
- In main(args): dispatch in order: help, version, diagnostics, serve, build-intermediate, build-enhanced, refresh, merge-persist, watch, fallback to print options.