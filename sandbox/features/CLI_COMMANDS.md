# CLI Core Commands

## Overview
Enhance the existing command-line interface to support core subcommands: help, version, mission, and default echo behavior. This delivers immediate user impact by providing discoverability, version information, and mission context directly via the CLI.

## Requirements

- The main entry point remains src/lib/main.js.
- No additional files beyond source, test, README, and package.json can be created.
- Tests must be added or updated in tests/unit/main.test.js (and sandbox tests if necessary).
- README.md must document the new commands.
- package.json dependencies may be updated if needed for argument parsing.

## Implementation Details

1. Argument Parsing
   - Use minimist or similar to parse flags and positional arguments.
   - Recognize the flags --help, --version, and --mission.

2. Command Behavior
   - --help: Print usage information with a summary of available commands and flags.
   - --version: Read the version field from package.json and print it.
   - --mission: Read and print the contents of MISSION.md to the console.
   - Default (no recognized flags): Echo all positional arguments in JSON form, preserving current behavior.

3. Error Handling
   - Unrecognized flags should trigger a brief error message and exit with non-zero code.
   - File read errors (e.g., missing MISSION.md) should be reported and exit with non-zero code.

## Testing

- Unit tests for each command scenario in tests/unit/main.test.js:
  - help flag prints lines containing command summaries.
  - version flag prints a semantic version matching the pattern x.y.z.
  - mission flag prints the full text from MISSION.md.
  - default invocation echoes arguments as JSON.
  - unrecognized flag exits with an error.

## Documentation Updates

- Update README.md to include:
  - Usage examples for each command: npm run start -- --help, --version, --mission, and echo behavior.
  - Brief descriptions of what each command does.
  - Link to MISSION.md in the help section.

## Deliverables

- Modify src/lib/main.js to implement subcommand parsing and dispatch.
- Update package.json if a new parsing library is required.
- Update tests in tests/unit/main.test.js to cover all new command behaviors.
- Revise README.md to document the CLI commands.

