# CLI_PARSER

# Description
Consolidate the single-entry CLI into a structured parser that maps supported flags to boolean options and dispatches to dedicated actions. Supported flags include: help, version, diagnostics, serve, build-intermediate, build-enhanced, refresh, merge-persist, watch. Unknown flags produce an error and exit code 1.

# Flags and Dispatch Order
1. help               Show usage information and exit(0)
2. version            Print tool version from package.json and exit(0)
3. diagnostics        Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
4. serve              Start an HTTP server with /health and /options endpoints
5. build-intermediate Generate an intermediate manifest from source.json or source.yml and exit(0)
6. build-enhanced     Execute enhanced build transformations on the intermediate manifest and exit(0)
7. refresh            Load and validate configuration via Zod schema, print JSON, and exit(0)
8. merge-persist      Merge data1.json and data2.json into merged-data.json, print summary, and exit(0)
9. watch              Watch JSON/YAML files and debounce change events to rerun the selected operation

# Implementation
- parseArgs(args): map each supported flag to an options object; on unknown flags log error and exit(1)
- printUsage(): display usage text listing flags
- printVersion(): read version from package.json, print and return version
- printDiagnostics(): gather process.version, process.platform, process.cwd(), process.env, print JSON, return object
- startHttpServer(options, port): create HTTP server with /health and /options, log listening port
- performBuildIntermediate(options): find and parse source file, count entries, write intermediate manifest to os.tmpdir(), log and return summary
- performBuildEnhanced(options): read intermediate manifest, add transformedAt, write enhanced file, log and return report
- refreshConfiguration(): locate config.json or config.yml, validate against Zod schema, print and return config
- mergeAndPersistData(options): read data1.json and data2.json, merge, write merged-data.json, log and return summary
- startWatchMode(options): use chokidar to watch *.json and *.y?(a)ml, debounce events, rerun serve, build, or refresh based on options
- main(args): call parseArgs, then dispatch in the above order, handling each operation and exit flows