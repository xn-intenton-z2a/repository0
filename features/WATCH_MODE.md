# WATCH_MODE

# Description
Implement a file watch mode for the CLI to monitor JSON and YAML files in the project root and automatically rerun a selected primary operation on change events. This mode improves developer feedback loops by reacting to updates in source definitions, configuration, or data without manual reruns.

# Behavior and Options
1. Debounce delay: 100 ms to batch rapid file events.
2. Watched patterns: `*.json` and `*.y?(a)ml` in current working directory.
3. On file `add`, `change`, or `unlink`:
   - If `serve` flag: restart or refresh the HTTP server.
   - Else if `build-intermediate` flag: rerun the intermediate build.
   - Else if `build-enhanced` flag: rerun the enhanced build.
   - Else if `refresh` flag: reload and validate configuration.
   - Else log the file event path.
4. Process remains alive until terminated.

# Implementation
- Extend `parseArgs` to detect `--watch` and set `options.watch: true`.
- Export `startWatchMode(options)` that:
  1. Imports `chokidar` to watch patterns `['*.json','*.y?(a)ml']`.
  2. Debounces events by clearing and setting a 100 ms timer on each event.
  3. Dispatches to the corresponding core function based on active flags.
  4. Logs `Watching files for changes...` on start.

# Testing
- In `tests/unit/main.test.js`:
  * Mock `chokidar.watch` to return an object with an `on` method.
  * Verify `startWatchMode` calls `chokidar.watch` with correct patterns and options.
  * Simulate `change` event and confirm that the appropriate core function (`startHttpServer`, `performBuildIntermediate`, `refreshConfiguration`) is called once per debounce interval.
  * Test that without primary flags, file events result in logging of file paths.
