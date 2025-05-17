# CLI_COMMANDS

## Overview

Enhance the main CLI script to support standard commands: help, version, mission, and default argument echo. This provides users with a clear interface and aligns the demo with the package description.

## Commands

- **--help, -h**
  Display usage instructions and exit without error.

- **--version, -v**
  Read the version from package.json and print it to stdout.

- **--mission**
  Load and print the full contents of MISSION.md.

- **Default (no special flags)**
  Echo the received arguments in JSON format as before.

## Implementation Details

1. Parse command-line arguments using minimist.
2. For help and version flags, output the information and return from main.
3. For mission flag, use fs.promises to read MISSION.md and print its contents.
4. Fallback to existing behavior of printing Run with: JSON string of args.
5. Ensure exit codes: zero for recognized commands and normal runs.
6. Update src/lib/main.js accordingly, preserving ESM and CLI entry logic.

## Tests

- Add unit tests in tests/unit/main.test.js to verify:
  - Help flag outputs usage text.
  - Version flag outputs the version matching package.json.
  - Mission flag outputs content containing the mission heading.
  - Default invocation echoes arguments as JSON without error.

## Documentation

- Update README.md to include:
  - Usage examples for each command:
    * npm run start -- --help
    * npm run start -- --version
    * npm run start -- --mission
    * npm run start -- arg1 arg2
  - Brief descriptions of each command under a new "CLI Commands" section.
