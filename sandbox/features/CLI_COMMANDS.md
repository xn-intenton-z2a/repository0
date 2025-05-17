# Overview
Add support for standard CLI flags in the main entry point to enhance usability and expose repository metadata.

# Behavior
When the CLI is invoked, the following behaviors are supported:
- `--help` : Display usage instructions and available flags.
- `--version` : Read and display the version field from package.json.
- `--mission` : Read and display the full mission statement from MISSION.md.
- No recognized flag : Fall back to echoing provided arguments, preserving existing functionality.

# Implementation Details
1. Import `minimist` to parse command line arguments.
2. Import `fs/promises` and `url` utilities to load and read external files (package.json and MISSION.md).
3. Extend `src/lib/main.js`:
   - Parse `process.argv` using minimist.
   - Branch logic for each supported flag, reading files asynchronously and printing contents.
   - Fall back to the existing argument-echo behavior when no flags match.
4. Update unit tests in `tests/unit/main.test.js` to cover:
   - Help output contains a usage summary.
   - Version output matches package.json version.
   - Mission output contains key phrases from MISSION.md.
   - Default invocation still echoes arguments without error.
5. Update `README.md`:
   - Document the new CLI flags with usage examples.
   - Show sample outputs for help, version, and mission.
