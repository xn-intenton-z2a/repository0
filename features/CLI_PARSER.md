# CLI_PARSER

# Description
Consolidate and refine the command-line interface into a structured parser supporting core flags and operations. Users invoke a single entry point with validated flags to perform:

- **--help**: Show usage information and exit with code 0
- **--version**: Print the tool version from package.json and exit with code 0
- **--diagnostics**: Collect and display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit with code 0
- **--serve**: Start an HTTP server on a configurable port with /health and /options endpoints
- **--build-intermediate**: Generate an intermediate manifest from source.json or source.yml and exit with code 0
- **--build-enhanced**: Execute enhanced build transformations on the intermediate manifest and exit with code 0
- **--refresh**: Load and validate configuration from JSON or YAML via Zod schema, print JSON, and exit with code 0
- **--merge-persist**: Merge data sources and persist the combined result to disk, print summary, and exit with code 0
- **--watch**: Watch JSON/YAML files and debounce change events to automatically rerun the selected operation until terminated

# Implementation
1. parseArgs(args: string[]): Record<string, boolean>
   - Recognize supported flags and map to a boolean options object
   - On unknown flags, log error and exit with code 1

2. printUsage()
   - Display usage text listing all supported flags and descriptions

3. printVersion()
   - Read `version` from package.json, print it, and return the version string

4. printDiagnostics()
   - Gather `process.version`, `process.platform`, `process.cwd()`, and filtered `process.env`
   - Print formatted JSON and return the diagnostics object

5. startHttpServer(options, port?)
   - Use Node’s `http` to serve:
     • GET `/health` → 200, JSON `{ status: "ok" }`
     • GET `/options` → 200, JSON of parsed options
     • Others → 404, JSON `{ error: "Not Found" }`
   - Call `server.listen(port)` and log `Server listening on port <port>`

6. performBuildIntermediate(options)
   - Locate and parse `source.json` or `source.yml`, count entries
   - Write intermediate manifest to `os.tmpdir()` named `intermediate-<timestamp>.json`
   - Log and return `{ items, path }`

7. performBuildEnhanced(options)
   - Read intermediate manifest via `INTERMEDIATE_PATH` or default `intermediate.json`
   - Add `transformedAt` timestamp, write enhanced JSON to `os.tmpdir()` named `enhanced-<timestamp>.json`
   - Log and return `{ transformed: true, path }`

8. refreshConfiguration()
   - Load `config.json` or `config.yml`, validate raw object against a Zod schema with fields:
     • inputPath: string
     • outputPath: string (default cwd)
     • timeout: number (default 30000)
     • enableFeatureX: boolean (default false)
   - Print validated config JSON and return the config object

9. mergeAndPersistData(options)
   - Read `data1.json` and `data2.json`, merge into a single object
   - Write to `merged-data.json` or `MERGED_PATH`, log and return `{ path, size }`

10. startWatchMode(options)
    - Use `chokidar` to watch patterns `['*.json','*.y?(a)ml']`, debounce events by 100ms
    - On `add`, `change`, or `unlink`, rerun serve, build, or refresh based on options

11. main(args: string[])
    - Call `parseArgs` and dispatch in the above order, calling each function and exiting or returning results. If no flags, log `Options:` and the options object