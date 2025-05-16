# Overview

Implement a command-line interface in src/lib/main.js that supports common flags and subcommands, enabling users to view help, version, mission statements or echo arguments.

# CLI Commands

- `--help`, `-h`: Display detailed usage instructions.
- `--version`, `-v`: Print the current package version from package.json.
- `--mission`: Load and display the mission statement from MISSION.md.
- No flags or unrecognized flags: Echo provided arguments as a JSON string.

# Implementation Details

1. Use minimist to parse process.argv.
2. Determine which flag is present and branch logic accordingly.
3. Read package.json to retrieve version for the version command.
4. Read MISSION.md to output the mission text.
5. Console.log output in human-readable format.
6. Ensure the default behavior matches existing echo functionality.

# Tests

- Update tests/unit/main.test.js to include scenarios for `--help`, `--version`, `--mission`, and default echo.
- Add sandbox tests in sandbox/tests/cli.test.js to cover integration flows.
- Confirm exit codes remain zero.

# Documentation

- Update README.md to document new CLI options and provide usage examples for each command.
