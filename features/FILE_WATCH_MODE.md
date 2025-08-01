# FILE_WATCH_MODE

# Description
Enable a file watch mode in the CLI that monitors JSON and YAML files in the project root and automatically reruns the selected primary operation on change. This live feedback loop improves developer productivity by reacting to file updates without manual invocation.

# Behavior
1. Patterns: Monitor files matching `*.json` and `*.y?(a)ml` in the current working directory.
2. Debouncing: Batch rapid change events within a 100 ms delay to avoid duplicate executions.
3. Event Handling:
   - On `add`, `change`, or `unlink` events:
     - If `--serve` is active, restart or refresh the HTTP server.
     - Else if `--build-intermediate` is active, rerun the intermediate build.
     - Else if `--build-enhanced` is active, rerun the enhanced build.
     - Else if `--refresh` is active, rerun configuration validation and log the result.
     - Else log the event path to stdout.
4. Lifecycle: Continue watching until the process is terminated by the user (e.g., Ctrl+C).

# Implementation
- Extend `parseArgs(args)` to set `options.watch` when `--watch` is present.
- Import `chokidar` and export `startWatchMode(options)`:
  1. Use `chokidar.watch(['*.json','*.y?(a)ml'], { ignoreInitial: true })`.
  2. Register handlers for `add`, `change`, and `unlink` events.
  3. Debounce calls with a 100 ms timer before invoking tasks based on `options`.
  4. Return the watcher instance to support testing.
- In `main(args)`, after parsing, if `options.watch` is true, call `startWatchMode(options)` and do not exit immediately.

# Testing
- Mock `chokidar.watch` to return an object with spyable `on` methods.
- In unit tests:
  - Verify `startWatchMode` is called with correct patterns and options.
  - Simulate a file event and confirm the corresponding core function is called once after debounce.
  - Use fake timers to advance time and test debouncing.
- In integration tests:
  - When `--watch` is combined with other flags, ensure `startWatchMode` is invoked in `main` and tasks rerun on simulated events.

# Documentation
- Under **CLI Usage** in `README.md`, include:
  - **--watch**: Watch JSON and YAML files and automatically rerun the selected operation on changes.
- Provide inline examples:
  npm run start -- --serve --watch  → start server and restart on file changes
  npm run build-intermediate -- --watch  → rerun build when source files change
  npm run refresh -- --watch  → rerun config validation on change
