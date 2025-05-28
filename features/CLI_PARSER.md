# CLI_PARSER

# Description
Consolidate and refine the command-line interface to support core flags and operations. Users invoke a single entry point with validated flags to perform:

- **help**: Show usage information and exit(0)
- **version**: Print the current tool version from package.json and exit(0)
- **diagnostics**: Display system diagnostics (nodeVersion, platform, cwd, env) as JSON and exit(0)
- **serve**: Start an HTTP server on a configurable port with `/health` and `/options` endpoints
- **build-intermediate**: Generate an intermediate manifest from `source.json` or `source.yml` and exit(0)
- **build-enhanced**: Execute enhanced build transformations on the intermediate manifest and exit(0)
- **refresh**: Load and validate `config.json` or `config.yml` against a Zod schema, print JSON, and exit(0)
- **merge-persist**: Merge `data1.json` and `data2.json`, write `merged-data.json`, and exit(0)
- **watch**: Watch JSON/YAML files and debounce change events to rerun the selected operation until terminated

# Implementation

1. parseArgs(args: string[]) : Record<string, boolean>
   - Recognize supported flags and map them to boolean values
   - On unknown flags, log an error and exit(1)

2. printUsage()
   - Display usage text listing all flags and descriptions

3. printVersion()
   - Read `version` from package.json, log it, and return the version string

4. printDiagnostics()
   - Collect `process.version`, `process.platform`, `process.cwd()`, and `process.env`
   - Print formatted JSON and return the diagnostics object

5. startHttpServer(options, port?)
   - Create a Node HTTP server to serve:
     - GET `/health` → 200, JSON `{ status: "ok" }`
     - GET `/options` → 200, JSON of parsed CLI options
     - Other paths → 404, JSON `{ error: "Not Found" }`
   - Log `Server listening on port <port>` and return the server instance

6. performBuildIntermediate(options)
   - Locate `source.json` or `source.yml`, parse it, count entries
   - Write an intermediate manifest to `os.tmpdir()` named `intermediate-<timestamp>.json`
   - Log and return `{ items, path }`

7. performBuildEnhanced(options)
   - Read the intermediate manifest via `INTERMEDIATE_PATH` or default `intermediate.json`
   - Add a `transformedAt` timestamp, write enhanced output to `os.tmpdir()` as `enhanced-<timestamp>.json`
   - Log and return `{ transformed: true, path }`

8. refreshConfiguration()
   - Load `config.json` or `config.yml`, validate against a Zod schema:
     ```js
     z.object({
       inputPath: z.string().nonempty(),
       outputPath: z.string().optional().default(process.cwd()),
       timeout: z.number().optional().default(30000),
       enableFeatureX: z.boolean().optional().default(false)
     })
     ```
   - Print the validated config JSON and return it

9. mergeAndPersistData(options)
   - Read `data1.json` and `data2.json`, merge them
   - Write the merged result to `merged-data.json` or `MERGED_PATH`
   - Log and return `{ path, size }`

10. startWatchMode(options)
    - Use `chokidar` to watch `['*.json','*.y?(a)ml']`, debounce events by 100ms
    - On file add/change/unlink, rerun serve, build, or refresh based on options
    - Continue until terminated

11. main(args: string[])
    - Call `parseArgs`
    - Dispatch flags in the order: help, version, diagnostics, serve, build-intermediate, build-enhanced, refresh, merge-persist, watch
    - For each flag, invoke its function and exit or return result
    - If no flags, log `Options:` and the options object
