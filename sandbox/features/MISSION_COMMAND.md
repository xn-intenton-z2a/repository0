# Mission Command

## Overview
The CLI will support a `--mission` flag that prints the repository mission statement directly to the terminal, allowing users to quickly understand the tool’s purpose without opening external files.

## Behavior
- When invoked with `--mission`, the CLI reads the `MISSION.md` file at the repository root.
- The CLI prints the full markdown content of `MISSION.md` to standard output.
- After printing, the process exits with code 0.
- If reading the mission file fails, the CLI prints an error message to standard error and exits with code 1.

## Implementation Details
- In `sandbox/source/main.js`, detect the `--mission` flag immediately after handling `--help` and `--version` flags.
- Use `fs.readFileSync` with `utf8` encoding to load `MISSION.md`.
- Wrap file reading in a `try/catch` block to handle errors gracefully. On error, call `console.error` with a descriptive message and `process.exit(1)`.

## Tests
- Create `sandbox/tests/mission.test.js` with tests that:
  - Invoke `main` with `--mission`, mocking `fs.readFileSync` to return sample mission content. Assert that `console.log` is called with the exact content and `process.exit(0)` is called.
  - Mock `fs.readFileSync` to throw an error. Assert that `console.error` is called with an appropriate message and `process.exit(1)` is called.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to describe the `--mission` flag.
- Include usage examples:
  - `npm run start -- --mission`
  - Example output showing the mission statement markdown.

## Compatibility
- No new dependencies required.
- Aligns with the existing CLI structure and uses `minimist` for flag parsing.