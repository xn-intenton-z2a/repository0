sandbox/features/FEATURE.md
# sandbox/features/FEATURE.md
Reflect updated seeding configuration for increased issue-to-code conversions
sandbox/features/CLI_PARSER.md
# sandbox/features/CLI_PARSER.md
# Overview

Introduce command line argument parsing to the main CLI to support help and version flags and named options.

# Behavior

- Running without flags prints a usage summary.
- Using --help displays detailed usage information.
- Using --version displays the current package version.
- Passing unknown flags prints an error and suggests using --help.

# Usage

node src/lib/main.js --help
Displays the usage information including available flags and their descriptions.

node src/lib/main.js --version
Displays the current version as defined in package.json.

# Implementation

Add minimist as a dependency. In src/lib/main.js import minimist and parse process.argv. Read the version field from package.json. Handle flags to print appropriate output and exit with correct status codes.