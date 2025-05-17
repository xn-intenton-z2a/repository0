# CLI Options

## Overview

Add support for standard CLI flags for help and version, while preserving the existing argument echo functionality.

## Usage

The CLI tool can be invoked with optional flags followed by any number of arguments. Available flags are:

- -h, --help: Display the help message and exit with status code 0.
- -v, --version: Display the version number from package.json and exit with status code 0.

When no recognized flag is provided, the tool continues to echo provided arguments.

## Behavior

- If help flag is present:
    Display usage instructions summarizing available flags and exit with code 0.
- If version flag is present:
    Import version from package.json, print the version string, and exit with code 0.
- Otherwise:
    Use existing logic to log Run with: followed by a JSON array of the supplied arguments.

## Implementation Details

Modify src/lib/main.js to:

- Import a command line parser such as minimist to extract flags and positional arguments.
- Import the version value from package.json.
- Check for help flag before any other logic and print the usage message.
- Check for version flag and print the version.
- Fallback to the existing main implementation for echoing arguments.

Add new unit tests in tests/unit/main-cli.test.js to cover scenarios for help, version, and fallback behavior. Update README.md to include a CLI usage section illustrating flag examples.