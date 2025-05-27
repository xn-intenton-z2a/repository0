# CLI_PARSER

# Description
Merge and refine the comprehensive command-line interface to include a file watch mode alongside existing flag-driven operations. Users can invoke the single entry point with flags to perform help, version, diagnostics, HTTP serving, build workflows, configuration validation, data persistence, and now watch mode to automatically rerun tasks on file changes.

# Flags and Subcommands
1. --help               Show usage information and exit
2. --version            Print current tool version and exit
3. --diagnostics        Collect and display system diagnostics and exit
4. --serve              Start an HTTP server on a configurable port
5. --build-intermediate Perform staged build operations to generate an intermediate manifest
6. --build-enhanced     Execute enhanced build transformations on the intermediate manifest
7. --refresh            Reload, validate, and normalize configuration from JSON or YAML files and exit
8. --merge-persist      Merge data sources and persist the combined result to disk and exit
9. --watch              Watch source, config, or data files and automatically rerun relevant tasks on changes

# Watch Mode
When --watch is provided:

- Detect changes in project files: source definitions (JSON/YAML), config files, or data files.
- Debounce rapid change events to avoid duplicate runs.
- On each change, perform the selected primary operation:
  - If --serve is also provided, restart or refresh the HTTP server.
  - If --build-intermediate or --build-enhanced is provided, rerun the corresponding build.
  - If --refresh is provided, rerun configuration validation.
  - If no other operation flags are provided, log file change events to stdout.
- Continue running until user terminates the process.

# Implementation
- In `src/lib/main.js`:
  1. Extend `parseArgs` to detect the `watch` flag and set `options.watch = true`.
  2. Import a file-watching library such as `chokidar`.
  3. Export a new function `startWatchMode(options)` that:
     - Determines the patterns to watch (e.g., `*.json`, `*.yml` in project root).
     - Creates a watcher that listens for `add`, `change`, and `unlink` events.
     - On event, debounces and invokes the logic for serve, build, or refresh based on `options`.
     - Logs a summary of the triggered action and the file path.
  4. In `main(args)`, after parsing options:
     - If `options.watch` is true, call `startWatchMode(options)` instead of exiting.
     - Ensure watch mode integrates with serve or build flows seamlessly.

# Testing
- In `tests/unit/main.test.js`:
  * Mock the file-watching library to emit synthetic events.
  * Test `startWatchMode` behavior:
    - Confirm watcher is set up with correct patterns.
    - Simulate a `change` event and assert the correct task function is called.
    - Verify debounce logic prevents duplicate calls within a short time frame.
  * Test integration of `--watch` with other flags:
    - Spy on `startHttpServer`, `performBuildIntermediate`, `refreshConfiguration` invoked by watch events.

# Documentation
- Update `README.md` under **CLI Usage** to include the **watch** flag and describe its purpose.
- Provide inline examples without fenced code blocks:
  npm run start --serve --watch   → start server and restart on file changes
  npm run build-intermediate --watch  → rerun staged build on source file changes
  npm run refresh --watch  → validate and print config on file change
- Note that watch mode continues until termination with Ctrl+C or kill signal.