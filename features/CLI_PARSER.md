# CLI_PARSER

# Description
Provide a comprehensive command-line interface for the tool, covering argument parsing, version reporting, diagnostics, HTTP serving, build workflows, configuration validation, and data persistence. Users invoke a single entry point with well-defined flags to perform core operations.

# Flags and Subcommands
1. --help               Show usage information and exit
2. --version            Print current tool version from package.json and exit
3. --diagnostics        Collect and display system and environment diagnostics and exit
4. --serve              Start an HTTP server on a configurable port
5. --build-intermediate Perform staged build operations to generate an intermediate manifest
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest
7. --refresh            Reload, validate, and normalize configuration from JSON or YAML files and exit
8. --merge-persist      Merge data sources and persist the combined result to disk and exit

# Implementation
In **src/lib/main.js**:
1. **parseArgs(args: string[])**
   - Use a minimal parser (e.g. minimist) or whitelist to map each supported flag to a boolean in an options object.
   - On unknown flags, print usage and call `process.exit(1)`.
2. **printUsage()**
   - Display clear usage text listing all supported flags and their effects.
3. **printVersion()**
   - Read `version` field from `package.json` and return the version string.
4. **printDiagnostics()**
   - Collect `nodeVersion`, `platform`, `cwd`, and selected environment variables.
   - Return a diagnostics object for testing and logging.
5. **startHttpServer(options, port?)**
   - Create a simple HTTP server that handles:
     • GET `/health` → 200, JSON `{ status: "ok" }`
     • GET `/options` → 200, JSON of the parsed options object
     • Others → 404, JSON `{ error: "Not Found" }`
   - Log "Server listening on port <port>" and keep the process alive.
6. **performBuildIntermediate(options)**
   - Locate a source definition file (`source.json` or `source.yml`) in the project root.
   - Parse its contents (JSON or YAML) and count top-level entries.
   - Write an intermediate manifest to the system temporary directory `intermediate-<timestamp>.json` containing `{ items, data }`.
   - Log and return a summary object `{ items, path }`.
7. **performBuildEnhanced(options)**
   - Read the intermediate manifest via `process.env.INTERMEDIATE_PATH` or `./intermediate.json`.
   - Add a `transformedAt` timestamp to the payload.
   - Write enhanced output to a temp file `enhanced-<timestamp>.json`.
   - Log and return a report object `{ transformed: true, path }`.
8. **refreshConfiguration()**
   - Locate `config.json` or `config.yml` in the project root.
   - Define a Zod schema:
     ```js
     const configSchema = z.object({
       inputPath: z.string().nonempty(),
       outputPath: z.string().optional().default(process.cwd()),
       timeout: z.number().optional().default(30000),
       enableFeatureX: z.boolean().optional().default(false)
     });
     ```
   - Parse and validate the raw config, applying defaults.
   - Return the validated config or throw on error.
9. **mergeAndPersistData(options)**
   - Read two data sources (`data1.json` and `data2.json`) from the root or environment paths.
   - Merge into a single object and write to `merged-data.json` or a configurable `MERGED_PATH`.
   - Log and return `{ path, size }`.
10. **main(args: string[])**
   - Call `parseArgs` and dispatch in this order:
     1. `--help` → `printUsage()` + exit(0)
     2. `--version` → `printVersion()` + exit(0)
     3. `--diagnostics` → `printDiagnostics()` + log JSON + exit(0)
     4. `--serve` → `startHttpServer(options, port)`
     5. `--build-intermediate` → `performBuildIntermediate(options)` + exit(0)
     6. `--build-enhanced` → `performBuildEnhanced(options)` + exit(0)
     7. `--refresh` → `refreshConfiguration()` + log JSON + exit(0)
     8. `--merge-persist` → `mergeAndPersistData(options)` + exit(0)
     9. Otherwise, log `Options:` and the options object.

# Testing
- Unit tests for each exported function in `tests/unit/main.test.js`:
  • `parseArgs`: valid and invalid flags, help and version flows.
  • `printVersion`: mock package.json and assert return.
  • `printDiagnostics`: spy on returned object keys and filtered env.
  • `startHttpServer`: simulate requests to `/health` and `/options`.
  • `performBuildIntermediate` and `performBuildEnhanced`: mock file I/O and OS tmpdir.
  • `refreshConfiguration`: valid JSON/YAML and error cases.
  • `mergeAndPersistData`: mock data files and stat calls.
- Integration tests for `main([...])` to confirm dispatch logic and exit codes.

# Documentation
- Update `README.md` under sections **CLI Usage**, **Version**, **Diagnostics Mode**, **HTTP Server**, **Build Operations**, **Configuration Validation**, and **Data Persistence**.
- Provide inline examples (no fenced code blocks) for each command: `npm run start --help`, `npm run start --version`, `npm run diagnostics`, `npm run serve`, `npm run build-intermediate`, `npm run build-enhanced`, `npm run refresh`, `npm run merge-persist`.