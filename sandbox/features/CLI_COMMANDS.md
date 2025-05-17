# CLI Command Support

## Overview
Enhance the existing CLI entrypoint to parse and handle common flags including help, version, and output format. The default behavior remains argument echoing for compatibility with existing workflows. This feature extends the CLI to provide a JSON output mode, showcasing structured output and preserving its experimental nature.

## Behavior
- When invoked with `--help` or `-h`, the CLI prints usage instructions and exits successfully.
- When invoked with `--version` or `-v`, the CLI reads the version field from package.json and prints it.
- When invoked with `--json` or `-j`, the CLI outputs a JSON string representing the arguments array only. For example, invoking `node main.js --json foo bar` prints:
  {"args":["foo","bar"]}
- When invoked with no recognized flags, the CLI echoes the provided arguments exactly as before.

## Implementation Details
1. Update `src/lib/main.js`:
   - Import the `minimist` library to parse flags.
   - Import version from `package.json`.
   - Detect `help`, `version`, and `json` flags and branch logic accordingly.
   - For `json` output, console.log only the JSON string of the arguments array.
   - Preserve the existing argument echo logic when no flags match.

2. Update tests in `tests/unit/main.test.js`:
   - Add tests for `--json` and `-j` output matching the expected JSON structure and exit behavior.
   - Ensure existing tests for `--help`, `--version`, and echo behavior remain passing.

3. Update `README.md`:
   - Document the new JSON flag with both short and long forms.
   - Provide examples for JSON output alongside help, version, and echo modes.

## Files to Modify
- `src/lib/main.js`
- `tests/unit/main.test.js`
- `README.md`