# Overview

Enhance the main CLI tool to support common commands and flags: --help, --version, and --mission. These commands provide users with usage guidance, the current version, and the repository mission statement, respectively.

# Functional Requirements

- Support the following command flags:
  - --help: Display usage instructions with available commands and examples.
  - --version: Read the version field from package.json and print it.
  - --mission: Read the content of MISSION.md and print it.
- If no flags or unrecognized flags are provided, fall back to the existing behavior of echoing supplied arguments.
- Exit with code 0 on successful command execution.

# Tests

- Test that invoking main with ["--help"] logs the help message containing command descriptions.
- Test that invoking main with ["--version"] logs a semantic version string matching the version in package.json.
- Test that invoking main with ["--mission"] logs the full mission statement text from MISSION.md.
- Test that invoking main with arbitrary arguments logs the JSON-serialized argument array.

# Documentation

- Update README.md to include usage examples for each new flag and describe the purpose of each command.
- Include a brief API reference under a "Commands" section with sample invocations.

# Implementation Notes

- Use Node's built-in fs/promises to load files asynchronously.
- Use import.meta.url and fileURLToPath to resolve paths for package.json and MISSION.md.
- Maintain compatibility with ESM and Node >=20.
