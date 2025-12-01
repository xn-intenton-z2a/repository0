# FILE_WATCH_MODE

# Description
Extend the CLI to support a watch mode that monitors JSON and YAML files in the project root and automatically reruns the selected primary operation when files change. This live feedback loop improves developer productivity by reacting to file updates without manual reruns.

# Behavior
1. When the --watch flag is provided, the CLI enters watch mode instead of exiting after one operation.
2. Monitor files matching `*.json` and `*.y?(a)ml` in the current working directory, ignoring initial loads.
3. Debounce rapid change events with a 100ms delay to prevent duplicate executions.
4. On `add`, `change`, or `unlink` events:
   - If `options.serve` is true, restart or refresh the HTTP server.
   - Else if `options.buildIntermediate` is true, rerun the intermediate build.
   - Else if `options.buildEnhanced` is true, rerun the enhanced build.
   - Else if `options.refresh` is true, rerun configuration validation and log the result.
   - Else log the file event and path.
5. Continue watching until the process is terminated by the user (e.g., Ctrl+C).

# Implementation
- In `src/lib/main.js`:
  - Add detection for `--watch` in `parseArgs`, setting `options.watch = true`.
  - Import `chokidar` and export a function `startWatchMode(options)` that:
    1. Calls `chokidar.watch(['*.json','*.y?(a)ml'], { ignoreInitial: true })`.
    2. Sets up `on('all', handler)` for events `add`, `change`, and `unlink`.
    3. Debounces invocation of the handler by 100ms.
    4. Inside the handler, dispatches to the appropriate core function based on options.
    5. Returns the watcher instance to allow tests to inspect it.
  - In `main(args)`, after parsing options, if `options.watch` is true, call `startWatchMode(options)` and return, preventing process exit.

# Testing
- In `tests/unit/main.test.js`:
  - Mock `chokidar.watch` to return an object with a spyable `on` method.
  - Verify `startWatchMode` calls `watch` with the correct patterns and options.
  - Simulate rapid successive file events and use fake timers to advance time, asserting that the correct task function is called once per debounce interval.
  - Test that when no primary operation flags are set, the handler logs the file change path.
  - Test integration of `--watch` combined with `--serve`, `--build-intermediate`, and `--refresh` to confirm `startWatchMode` is invoked and the correct core functions are called on simulated events.
