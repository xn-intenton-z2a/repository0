# CLI Options

## Overview

Enhance the command-line interface to support the following standard flags alongside the existing argument echo behavior:

- `-h, --help`: Display usage instructions and exit.
- `-v, --version`: Print the version from package.json and exit.
- `-m, --mission`: Read and display the content of `MISSION.md` and exit.

When none of these flags are present, the tool falls back to echoing the provided arguments.

## Usage

Invoke the CLI tool using the entrypoint script with any combination of flags and positional arguments:
```
node sandbox/source/main.js [flags] [arguments...]
```

### Examples

- Show help:
  `node sandbox/source/main.js --help`

- Show version:
  `node sandbox/source/main.js -v`

- Show mission statement:
  `node sandbox/source/main.js --mission`

- Echo arguments:
  `node sandbox/source/main.js arg1 arg2`

## Behavior

1. If the help flag is present, print the usage instructions and exit with code 0.
2. Else if the version flag is present, import the version from package.json, print it, and exit with code 0.
3. Else if the mission flag is present, attempt to read `MISSION.md` from the working directory and print its contents; on read error, print an error message and exit.
4. Otherwise, fallback to the existing echo behavior that logs `Run with: ${JSON.stringify(args)}`.

## Implementation Details

- Update `src/lib/main.js` or the CLI entrypoint in `sandbox/source/main.js` to:
  - Import the `version` field from `package.json`.
  - Use `minimist` to parse flags: alias `h` → `help`, `v` → `version`, `m` → `mission`, with boolean settings for each.
  - Check flags in the order: help, version, mission, then fallback.
  - For the mission flag, use `fs.promises.readFile` to read `MISSION.md` and handle errors gracefully.

- Add unit tests in `sandbox/tests/main-cli.test.js` to cover:
  - Help flag displays usage and exits.
  - Version flag prints current version.
  - Mission flag prints mocked mission content and handles file errors.
  - Fallback behavior echoes arguments when no flags.

- Update `sandbox/docs/CLI.md` to reflect the new mission flag in the list of supported options.
- Update `README.md` to include a CLI usage section demonstrating examples for help, version, and mission.
