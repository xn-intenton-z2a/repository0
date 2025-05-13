# Scripts Command

## Overview
Provide a `--scripts` flag that lists all runnable npm scripts defined in `package.json`. This helps users discover and understand available automation shortcuts without inspecting the file manually.

## Behavior
- Detect the `--scripts` flag in the CLI arguments after handling `--help`, `--version`, `--mission`, `--info`, and `--validate-config`.
- Read `package.json` at the repository root and parse the `scripts` section.
- Print a formatted JSON object mapping each script name to its command string with two-space indentation.
- Exit the process with code 0 on success.
- If reading or parsing fails, print an error message to standard error and exit with code 1.

## Implementation Details
- In `sandbox/source/main.js`, extend minimist options to include a `scripts` boolean mapped to `scripts`.
- After existing branches, add an `else if (scripts)` branch:
  - Use `fs.readFileSync` with `utf8` to load `package.json`.
  - Use `JSON.parse` to extract the `scripts` object.
  - Call `console.log(JSON.stringify(scripts, null, 2))`.
  - Wrap in a `try/catch` block to handle file read or parse errors.
  - On success, call `process.exit(0)`; on error, call `console.error` with a descriptive message and `process.exit(1)`.

## Tests
- Create `sandbox/tests/scripts.test.js` with tests that:
  - Mock `fs.readFileSync` to return valid JSON containing a known `scripts` object.
  - Invoke `main` with `["--scripts"]` and assert that `console.log` is called with the expected formatted JSON and `process.exit(0)` is called.
  - Mock `fs.readFileSync` to throw an error or return invalid JSON, then assert that `console.error` is called with an appropriate message and `process.exit(1)` is called.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md`:
  - Add a section for `--scripts`, including a usage example:
    npm run start -- --scripts
  - Show sample JSON output listing script names and commands.

## Compatibility
- Reuses existing dependencies: `fs`, `path`, and `minimist`.
- No new dependencies are required.
- Follows existing CLI structure in `sandbox/source/main.js`.