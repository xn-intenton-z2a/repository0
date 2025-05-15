# CLI Interface

Implement a robust command line interface to provide core utility commands alongside the existing argument echo functionality.

# Commands

## --help

Display a concise usage guide listing all available commands, flags, and examples of common invocations.

## --version

Read and print the `version` field from `package.json` to show the current release of the tool.

## --mission

Load and display the first section of the repository mission from `MISSION.md` to remind users of the project purpose.

## Default Behavior

When no recognized flags are provided, echo the supplied arguments as JSON to maintain the existing argument echo feature.

# Implementation Details

- Use the existing dependency `minimist` to parse command line arguments in `src/lib/main.js`.
- Update `main(args)` to detect flags in priority order: `help`, `version`, `mission`, then fallback to echoing arguments.
- Modify `sandbox/source/main.js` to delegate to the enhanced `main` implementation without additional logic.
- No new files; update only `src/lib/main.js`, `sandbox/source/main.js`, existing tests, `README.md`, and `package.json` if necessary.

# Testing

- Extend `tests/unit/main.test.js` to include tests for each command: help output contains usage keywords, version matches `package.json`, mission includes mission header, and default echo returns valid JSON.
- Add demonstration tests under `sandbox/tests/` to showcase the feature in sandbox mode, verifying the entire flow when running `npm run start -- --help` and similar invocations.

# Documentation Updates

- Add a **CLI Usage** section in `README.md` showing examples of each command alongside expected outputs.
- Link to `MISSION.md` in the help output and the README.
