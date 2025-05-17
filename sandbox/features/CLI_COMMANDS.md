# CLI Command Support

## Overview

Enhance the existing CLI entrypoint to parse and handle common flags for help and version. The default behavior remains argument echoing for compatibility with existing workflows. This feature demonstrates a core extension of the CLI, showcasing how the template can evolve real functionality while preserving its experimental nature.

## Behavior

- When invoked with `--help` or `-h`, the CLI prints usage instructions and exits successfully.
- When invoked with `--version` or `-v`, the CLI reads the version field from package.json and prints it.
- When invoked with no recognized flags, the CLI echoes the provided arguments exactly as before.

## Implementation Details

1. Update `src/lib/main.js`:
   - Import the `minimist` library to parse flags.
   - Import version from `package.json`.
   - Detect `help` or `version` flags and branch logic accordingly.
   - Preserve the existing argument echo logic.

2. Update tests in `tests/unit/main.test.js`:
   - Add tests for `--help` output and exit code.
   - Add tests for `--version` output matching `package.json`.
   - Ensure existing echo behavior is still covered.

3. Update `README.md`:
   - Document CLI usage with examples for help, version, and echo modes.
   - Link to MISSION.md and CONTRIBUTING.md.
   - Include usage examples for both short and long flag forms.

## Files to Modify

- `src/lib/main.js`
- `tests/unit/main.test.js`
- `README.md`
