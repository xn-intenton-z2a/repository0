# License Command

## Overview
Provide a `--license` flag for the CLI that prints the full repository license text to standard output. This helps users quickly inspect the license terms without opening the LICENSE file manually.

## Behavior
- Detect a `license` boolean option in CLI arguments after handling `--help`, `--version`, `--mission`, and `--info`.
- Resolve the path to `LICENSE.md` at the repository root.
- Read the file with UTF-8 encoding and print its contents verbatim to standard output.
- Exit the process with code 0 on successful output.
- On file read failure (missing file or read error), print a descriptive error message to standard error and exit with code 1.

## Implementation Details
- In `sandbox/source/main.js`, extend `minimist` options to include a `license` boolean flag.
- After existing branches, add an `else if (license)` block that:
  - Uses `path.resolve(process.cwd(), "LICENSE.md")` to locate the file.
  - Calls `fs.readFileSync` with `utf8` encoding to load the content.
  - Calls `console.log` with the file content and then `process.exit(0)`.
  - Wraps file operations in a `try/catch` to handle and report errors via `console.error` and `process.exit(1)`.

## Tests
- Create `sandbox/tests/license.test.js` with scenarios:
  - **Valid License File**: Mock `fs.readFileSync` to return a sample license text. Invoke `main(["--license"])` and assert `console.log` is called with the sample text and `process.exit(0)` is invoked.
  - **Read Failure**: Mock `fs.readFileSync` to throw an error. Invoke `main(["--license"])` and assert `console.error` is called with an error message and `process.exit(1)` is invoked.
- Use Vitest spies to mock `fs.readFileSync`, `console.log`, `console.error`, and `process.exit`.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include a section for the `--license` flag:
  - Usage example: npm run start -- --license
  - Show example output printing full LICENSE.md content or error message if missing.

## Compatibility
- No new dependencies; uses built-in `fs`, `path`, and existing `minimist`.
- Follows existing CLI branching in `sandbox/source/main.js` and aligns with Vitest testing setup.