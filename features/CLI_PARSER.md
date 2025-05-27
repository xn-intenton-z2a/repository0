# CLI_PARSER

# Description
Merge and extend the command-line interface to support structured parsing, diagnostics reporting, HTTP serving, build workflows, configuration validation, and data persistence. Users invoke all core operations through a single entrypoint with validated flags.

# Flags and Subcommands
1. --help               Show usage information and exit
2. --diagnostics        Collect and display system and environment diagnostics and exit
3. --serve              Start an HTTP server on a configurable port
4. --build-intermediate Perform staged build operations to generate an intermediate manifest
5. --build-enhanced     Execute enhanced build transformations on the intermediate manifest
6. --refresh            Reload, validate, and normalize configuration from JSON or YAML files
7. --merge-persist      Merge data sources and persist the combined result to disk

# Configuration Validation
When `--refresh` is provided:

- Read `config.json` or `config.yml` from project root.
- Define a Zod schema:
  ```js
  const configSchema = z.object({
    inputPath: z.string().nonempty(),
    outputPath: z.string().optional().default(process.cwd()),
    timeout: z.number().optional().default(30000),
    enableFeatureX: z.boolean().optional().default(false)
  });
  ```
- Parse the raw object and apply defaults.
- On validation failure, throw a ZodError with readable messages.
- Print the validated configuration as formatted JSON and exit with code 0.

# Implementation
- In `src/lib/main.js`:
  1. **parseArgs(args: string[])**: use minimist or whitelist to parse all supported flags into a boolean options object.
  2. **printUsage()**: display usage text listing all flags.
  3. **printDiagnostics()**: collect `nodeVersion`, `platform`, `cwd`, and selected environment variables, return diagnostics object.
  4. **startHttpServer(options, port)**: start an HTTP server with `/health` and `/options` endpoints.
  5. **performBuildIntermediate(options)**: locate and parse `source.json` or `source.yml`, count entries, write intermediate manifest to temp directory, return `{ items, path }`.
  6. **performBuildEnhanced(options)**: read intermediate manifest, add `transformedAt` timestamp, write enhanced output, return `{ transformed, path }`.
  7. **refreshConfiguration()**: load and parse config file, apply Zod schema, return typed config.
  8. **mergeAndPersistData(options)**: merge two data sources, write result to configurable path, return `{ path, size }`.
  9. **main(args: string[])**: dispatch based on parsed options, invoking each function and exiting or logging appropriately.

# Testing
- Unit tests in `tests/unit/main.test.js`:
  * `parseArgs`: valid flags, invalid flags exit behavior, and help handling.
  * `printDiagnostics`: assert returned object keys and filtered env entries.
  * `startHttpServer`: verify server instance, endpoints behavior via simulated requests.
  * `performBuildIntermediate` and `performBuildEnhanced`: mock file I/O and OS tmpdir, assert summary and report.
  * `refreshConfiguration`: mock file reads for JSON and YAML, assert valid and invalid cases.
  * `mergeAndPersistData`: mock data files and fs operations, assert returned path and size.
  * Integration tests for `main`: spy on each exported function to confirm dispatch flows and process exit codes.

# Documentation
- Update `README.md` under **CLI Usage**, **Diagnostics Mode**, **HTTP Server**, **Build Operations**, **Configuration Validation**, and **Data Persistence** sections.
- Provide inline examples without fenced code blocks:
  npm run start --help
  npm run diagnostics
  npm run serve
  npm run build-intermediate
  npm run build-enhanced
  npm run refresh
  npm run merge-persist