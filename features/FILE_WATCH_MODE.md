# FILE_WATCH_MODE

# Description
Extend the CLI to support a watch mode that monitors JSON and YAML files in the project root and automatically reruns the selected primary operation on changes. This live feedback loop improves developer productivity by reacting to file updates without manual reruns.

# Behavior
1. Patterns: Watch files matching `*.json` and `*.y?(a)ml` in the current working directory, ignoring initial loads.
2. Debouncing: Batch rapid change events with a 100 ms debounce to avoid duplicate executions.
3. Event Handling:
   - On `add`, `change`, or `unlink` events:
     • If `--serve` is active, restart or refresh the HTTP server.
     • Else if `--build-intermediate` is active, rerun the intermediate build.
     • Else if `--build-enhanced` is active, rerun the enhanced build.
     • Else if `--refresh` is active, rerun configuration validation and log the result.
     • Else log the file event path to stdout.
4. Lifecycle: Continue watching until the process is terminated by the user (e.g., Ctrl+C).

# Implementation
- In `src/lib/main.js`, extend `parseArgs` to set `options.watch` when `--watch` is provided.
- Import `chokidar` and export `startWatchMode(options)` that:
  1. Uses `chokidar.watch(["*.json","*.y?(a)ml"], { ignoreInitial: true }).
  2. Registers handlers for `add`, `change`, and `unlink` events.
  3. Debounces handler calls by 100 ms before invoking tasks based on `options`.
  4. Returns the watcher instance so tests can verify behavior.
- In `main(args)`, after parsing options, if `options.watch` is true, call `startWatchMode(options)` and do not exit.

# Testing
- Mock `chokidar.watch` in unit tests to return an object with spyable `on` methods.
- Verify `startWatchMode` sets up the watcher with correct patterns.
- Simulate file events and confirm the correct core functions (`serve`, `buildIntermediate`, `buildEnhanced`, `refreshConfiguration`) are called once per debounced interval.
- Use Vitest’s fake timers to test debounce behavior.
- Integration tests: when `--watch` is combined with other flags, confirm `startWatchMode` is invoked in `main` and tasks rerun on simulated events.

# Documentation
- Update `README.md` under **CLI Usage** to include the `--watch` flag and describe its behavior:
  npm run start -- --serve --watch   → start server and restart on file changes
  npm run build-intermediate -- --watch  → rerun build when source files change
  npm run refresh -- --watch  → rerun config validation on change