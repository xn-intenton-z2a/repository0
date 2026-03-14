# CLI

# Summary

Provide a lightweight command-line interface that exposes basic operations for rapid experimentation: define classes, define properties, add individuals, list stats, save, and load. The CLI should be built from the library and export a program entrypoint at src/lib/main.js when run as a script.

# Motivation

A CLI enables manual exploration, quick reproduction of examples, and easier debugging during development and in CI when troubleshooting persisted data.

# Specification

Behavior

- The CLI supports commands: define-class, define-property, add-individual, stats, save, load.
- Each command accepts simple arguments and prints machine-friendly JSON summary output to stdout for use in tests and scripting.
- The CLI should return non-zero exit codes for errors.

# Acceptance Criteria

- The repository entry point src/lib/main.js can be executed as a CLI that supports at least stats, save, and load commands.
- A unit or integration test runs the CLI programmatically (spawn or require) to execute a seed sequence and asserts exit code zero and expected stats in the JSON output.

# Testing Recommendations

- Add a test in tests/unit/cli.test.js that requires or spawns the CLI to run a small command sequence and verifies JSON output.

# Implementation Notes

- Keep the CLI minimal and use the same public API used by programmatic consumers to avoid duplication.
- Document example CLI commands in README.

# Related features

- SEED_DATA
- PERSISTENCE
- STATS