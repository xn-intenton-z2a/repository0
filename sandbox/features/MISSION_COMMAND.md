# Mission Command

## Overview
Add a `--mission` flag to the CLI that reads and prints the repository mission statement from `MISSION.md`. This enables users to view the project mission directly in their terminal without opening the file.

## Behavior

- Detect a `mission` boolean option in CLI arguments after handling `--help` and before other flags.
- Resolve the path to `MISSION.md` in the repository root.
- Read the file contents with UTF-8 encoding.
- If file read succeeds:
  - Print the full content of `MISSION.md` to standard output.
  - Exit the process with code 0.
- If file read fails (file not found or read error):
  - Print a descriptive error message to standard error in the form:
    Error reading mission file: <error message>
  - Exit the process with code 1.

## Implementation Details

- In `sandbox/source/main.js`, extend minimist options to include `mission` as a boolean flag.
- Add an `else if (mission)` branch immediately after the `--version` branch and before any flags that depend on project content.
  - Use `path.resolve(process.cwd(), 'MISSION.md')` to locate the mission file.
  - Call `fs.readFileSync(missionPath, 'utf8')` to load content.
  - Wrap the read in a `try/catch` block:
    - On success: `console.log(content)` and `process.exit(0)`.
    - On failure: `console.error('Error reading mission file: ' + err.message)` and `process.exit(1)`.

## Tests

- Create `sandbox/tests/mission.test.js` with scenarios:
  - **Valid Mission File**: Mock `fs.readFileSync` to return a sample markdown string. Invoke `main(['--mission'])` and assert `console.log` is called with that string and `process.exit(0)` is invoked.
  - **Read Failure**: Mock `fs.readFileSync` to throw an error. Invoke `main(['--mission'])` and assert `console.error` is called with `Error reading mission file: <message>` and `process.exit(1)` is invoked.

- Use Vitest spies to mock `fs.readFileSync`, `console.log`, `console.error`, and `process.exit`.

## Documentation

- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md`:
  - Add a section for `--mission`:
    ```
    npm run start -- --mission
    ```
  - Show example output of the mission statement and error case if file is missing.

## Compatibility

- No new dependencies are required; uses built-in `fs` and `path` modules.
- Aligns with existing CLI structure in `sandbox/source/main.js`.
- Follows Vitest test setup and sandbox file layout.