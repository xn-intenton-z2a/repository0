# FILE_WATCH_MODE

# Description
Enable a watch mode for the CLI that monitors JSON and YAML files in the project root and automatically reruns the selected primary operation on change. This live feedback loop improves developer productivity by reacting to file updates without manual reruns.

# Watch Behavior
1. Patterns: Monitor any files matching `*.json` or `*.y?(a)ml` in the current working directory.
2. Debouncing: Batch rapid change events with a 100 ms debounce to prevent duplicate executions.
3. Event Handling:
   - On `add`, `change`, or `unlink` events:
     - If `--serve` is active, restart or refresh the HTTP server.
     - Else if `--build-intermediate` is active, rerun the intermediate build.
     - Else if `--build-enhanced` is active, rerun the enhanced build.
     - Else if `--refresh` is active, reload and validate configuration.
     - Else log the file event path.
4. Persistence: Continue watching until the process is terminated by the user (Ctrl+C).

# Implementation
- In `src/lib/main.js`, extend parseArgs to detect a `watch` flag and set `options.watch: boolean`.
- Import `chokidar` to create a file watcher:
  - Use `chokidar.watch(['*.json','*.y?(a)ml'], { ignoreInitial: true })`.
  - Register handlers for `add`, `change`, and `unlink` events.
- Debounce events by storing a timer and delaying the handler by 100 ms.
- On each debounced call, dispatch to the same core functions as non-watch flows (serve, build, refresh) based on `options`.
- Export a new function `startWatchMode(options): FSWatcher` that returns the watcher instance for testing.
- In `main(args)`, if `options.watch` is true, call `startWatchMode(options)` and return, bypassing immediate exit.

# Testing
- In `tests/unit/main.test.js`:
  * Mock `chokidar.watch` to return an object with a spyable `on` method.
  * Verify `startWatchMode` calls `chokidar.watch` with correct patterns and options.
  * Simulate file events by invoking the registered handler and assert that:
    - Core functions (serve, buildIntermediate, buildEnhanced, refreshConfiguration) are called once per debounced event.
    - Logging of file paths occurs when no primary operation flags are set.
  * Use fake timers to control debounce timing and assert handlers trigger after 100 ms.
  * Test integration: With `--watch` in args, `main()` should invoke `startWatchMode` and not exit.

# Documentation
- Update `README.md` under **CLI Usage**:
  - Add `--watch`: "Watch JSON and YAML files and automatically rerun the selected operation on changes."
  - Provide inline examples:
    npm run start --serve --watch  → Start server and restart on file changes
    npm run build-intermediate --watch  → Rerun staged build on source changes
    npm run refresh --watch  → Rerun config validation on change