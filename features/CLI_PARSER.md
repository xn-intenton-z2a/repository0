# CLI_PARSER

# Description
Consolidate and refine the command-line interface into a single entrypoint supporting core operations with validated flags. Provide clear dispatch logic for each flag-driven action, including help, version, diagnostics, HTTP server, build workflows, configuration validation, data persistence, and watch mode.

# Flags and Dispatch Order
1. --help               Show usage information and exit(0)
2. --version            Print current tool version from package.json and exit(0)
3. --diagnostics        Print system diagnostics as formatted JSON and exit(0)
4. --serve              Start HTTP server on PORT env or default 3000
5. --build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. --build-enhanced    Read intermediate manifest, apply transformation, produce enhanced output, and exit(0)
7. --refresh            Reload and validate configuration from JSON or YAML using Zod schema, print JSON, and exit(0)
8. --merge-persist      Merge data sources data1.json and data2.json into merged-data.json, print summary, and exit(0)
9. --watch             Watch JSON/YAML files in project root and rerun selected operation on changes

# Implementation
- Export `parseArgs(args: string[])` to map each supported flag to a boolean in an options object. Unknown flags print an error and exit(1).
- Export `printUsage()`, `printVersion()`, `printDiagnostics()`, `startHttpServer(options)`, `performBuildIntermediate(options)`, `performBuildEnhanced(options)`, `refreshConfiguration()`, `mergeAndPersistData(options)`, and `startWatchMode(options)` with clear responsibilities and return values for testing.
- In `main(args: string[])`, dispatch based on parsed options in the above order, calling each function and exiting or continuing as appropriate.
