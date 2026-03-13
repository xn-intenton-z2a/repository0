# HAMMING_DISTANCE_CLI

Specification

Document the small CLI surface exposed by src/lib/main.js and ensure it remains stable.

Acceptance Criteria

- Running `node src/lib/main.js --version` prints the package version string to stdout.
- Running `node src/lib/main.js --identity` prints a JSON object with keys `name`, `version`, and `description` to stdout.
- The file is executable as a Node module (`#!/usr/bin/env node`) and does not crash when invoked with no arguments.

Notes

This feature verifies the CLI helper bits of the public module; tests may call the script as a child process.
