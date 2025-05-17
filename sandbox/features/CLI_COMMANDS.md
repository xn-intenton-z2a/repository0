# CLI Command Support

## Overview
Add support for built-in CLI flags to enhance interactivity of the main script without altering its existing echo behavior.

## Flags

- **--help**: Display usage instructions with descriptions of all supported flags.
- **--version**: Read the version field from package.json and print it to stdout.
- **--mission**: Load and print the contents of MISSION.md located at the repository root.

## Implementation Details

1. Update `src/lib/main.js`:
   - Import `minimist` for argument parsing.
   - Use Node’s `fs/promises` and `path` modules to read files for mission content.
   - Add conditional branches before the default echo behavior:
     - If `args.help` is truthy, print usage and return.
     - If `args.version` is truthy, import version from `package.json` and print it.
     - If `args.mission` is truthy, read `MISSION.md` and print its full contents.
   - Fallback to existing `console.log` of JSON-serialized args.

2. Update `tests/unit/main.test.js`:
   - Add unit tests for each new flag:
     - Ensure `--help` prints expected usage text (hint at flags list).
     - Ensure `--version` prints the version matching package.json.
     - Ensure `--mission` prints content matching MISSION.md.
   - Retain existing tests verifying no errors on default invocation.

3. Update `README.md`:
   - Document each of the new flags under a "CLI Usage" section.
   - Provide example invocations and expected outputs.

4. Dependencies:
   - No new dependencies required; existing `minimist`, `fs`, and `path` suffice.
