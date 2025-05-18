# File Watcher

## CLI Behavior

Introduce a top-level command watch to monitor files or directories for changes and automatically execute a specified CLI subcommand when changes occur.

Usage:

npm run start -- watch <subcommand> <path> [--pattern <glob>] [--delay <ms>] [--recursive]

- `<subcommand>`: Any existing CLI command (e.g., convert, markdown, render) to run on file events.
- `<path>`: File or directory path to watch for changes.
- `--pattern`: Glob pattern to filter watched files (default `**/*`).
- `--delay`: Debounce delay in milliseconds before executing the command after changes (default 100).
- `--recursive`: When watching a directory, include all subdirectories (default true).

Behavior:
- On file add, change, or unlink events matching the pattern, wait for the debounce delay then re-run the specified subcommand with the changed file path as argument.
- Print a timestamped log of events and command output to stdout.
- Exit on Ctrl+C, closing the watcher gracefully.

## Implementation

- sandbox/source/main.js:
  - Add import of chokidar and child_process.spawn.
  - In the main switch, add case "watch" to call async function doWatchCommand(argv).
  - Implement doWatchCommand(argv):
    - Validate argv._[1] as subcommand and argv._[2] as path; exit with code 1 if missing.
    - Build chokidar watcher with options from argv.pattern, argv.delay, and argv.recursive.
    - On each event (add, change, unlink), debounce events per file, then spawn a child process:
      - `node sandbox/source/main.js <subcommand> <file>`, inheriting stdio for real-time output.
    - Log events with timestamp and event type.
    - Handle process signals to close watcher.

## Testing

- sandbox/tests/watch.test.js:
  - Use Vitest to spawn the watch command in a temporary directory.
  - Create a file, start watch targeting that file and a simple subcommand (e.g., echo).
  - Modify the file content and assert that watch logs the change and prints the subcommand output.
  - Test --pattern filtering to only respond to matching extensions.
  - Verify that the debounce delay combines rapid changes into a single command execution.

## Documentation

- README.md and sandbox/docs/CLI_USAGE.md:
  - Add a section for the watch command under Commands Reference with usage examples.
  - Describe options pattern, delay, and recursive with practical scenarios.