# Outdated Command

## Overview
Add a `--outdated` flag to the CLI that checks for outdated npm dependencies and reports available updates. This helps users maintain up-to-date dependencies and catch potential security or compatibility issues early.

## Behavior
- Detect an `outdated` boolean option in CLI arguments after handling other flags.
- Invoke `npm outdated --json` in the repository root using a child process.
- If the command returns valid JSON with outdated entries:
  - Parse the JSON output representing packages with current, wanted, and latest versions.
  - Print a formatted JSON object with two-space indentation to standard output.
  - Exit the CLI process with code 0.
- If no outdated dependencies are found (empty output or empty object):
  - Print "All dependencies are up to date." to standard output.
  - Exit with code 0.
- On spawn failure or invalid JSON parse:
  - Print a descriptive error message to standard error.
  - Exit with code 1.

## Implementation Details
- In `sandbox/source/main.js`, extend `minimist` options to include `outdated` mapped to `outdated` boolean.
- After existing branches, add an `else if (outdated)` branch that:
  - Imports `child_process` and calls `spawnSync("npm", ["outdated", "--json"], { encoding: "utf8" })`.
  - Checks `result.error` or non-zero `result.status` to detect errors.
  - If `result.stdout` is non-empty:
    - Parse JSON and `console.log(JSON.stringify(parsed, null, 2))`.
  - If `result.stdout` is empty or parses to an empty object:
    - `console.log("All dependencies are up to date.")`.
  - Wrap spawn and parse in `try/catch` to handle exceptions.

## Tests
- Create `sandbox/tests/outdated.test.js` with scenarios:
  - **With Outdated Packages**: Mock `child_process.spawnSync` to return a `stdout` string of JSON with outdated entries and `status` 0. Invoke `main(["--outdated"])` and assert `console.log` is called with formatted JSON and `process.exit(0)` is invoked.
  - **No Outdated Packages**: Mock `child_process.spawnSync` to return empty `stdout` and `status` 0. Assert `console.log` is called with "All dependencies are up to date." and `process.exit(0)`.
  - **Spawn Failure**: Mock `spawnSync` to throw an error or return an `error` property. Assert `console.error` with error message and `process.exit(1)`.
  - **Invalid JSON**: Mock `spawnSync` to return invalid JSON in `stdout`. Assert `console.error` and `process.exit(1)`.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include a section for `--outdated`:
  - Show usage example:
    npm run start -- --outdated
  - Describe example outputs for both outdated packages and up-to-date case.

## Compatibility
- No new dependencies required; uses built-in `child_process` module.
- Follows existing CLI structure in `sandbox/source/main.js`.
- Aligns with Vitest testing setup and sandboxed source and test paths.
