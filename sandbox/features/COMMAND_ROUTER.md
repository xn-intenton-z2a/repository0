# Summary

Implement a router for top-level CLI commands that dispatches built-in commands: help, version, mission, and echo. This delivers a unified command interface and replaces the current linear argument echoing.

# Behavior

  * When run with no arguments or with `help`, display usage instructions describing valid commands and options.
  * When run with `version`, load the version string from package.json and print it.
  * When run with `mission`, read and print the contents of MISSION.md.
  * When run with any other arguments, treat the first token as a command; if unrecognized, emit a warning and show help.
  * Provide a default `echo` command that prints remaining arguments as a JSON array.

# Implementation

  1. Modify src/lib/main.js to:
     - Parse `args[0]` as the command.
     - Map commands to handler functions.
     - Read files (package.json, MISSION.md) using filesystem APIs.
     - Provide a fallback for unknown commands.
  2. Ensure the CLI entrypoint in sandbox/source/main.js is kept in sync or symlinked.
  3. Add any necessary imports (fs/promises) and maintain ESM compliance.

# Tests

  * Add unit tests in tests/unit for each command:
    - `main(['help'])` returns or prints usage without error.
    - `main(['version'])` prints a semver string matching package.json.
    - `main(['mission'])` prints non-empty mission text.
    - `main(['echo', 'a', 'b'])` prints `["a","b"]`.
    - Unknown commands show help and exit code 1.
  * Use vitest to capture stdout and simulate process.argv.

# Documentation

  * Update README.md:
    - Add a Usage section listing each command and example invocations.
    - Link to CONTRIBUTING.md, MISSION.md, and agentic-lib repository.
  * Ensure the command reference aligns with implementation details.
