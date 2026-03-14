# CLI

# Summary

Provide a lightweight command-line interface that exposes basic operations for rapid experimentation and data interchange: define classes, define properties, add individuals, list stats, save, load, import, and export. The CLI should be built from the library and export a program entrypoint at src/lib/main.js when run as a script.

# Motivation

A CLI enables manual exploration, quick reproduction of examples, easier debugging during development and in CI, and simple data interchange for importing and exporting example ontology fragments used by the website and other tools.

# Specification

Behavior

- The CLI supports commands: define-class, define-property, add-individual, stats, save, load, import, export.
- import and export accept a --format option to indicate the file format. Supported formats at minimum: jsonld. Optional formats: turtle (if the n3 dependency is installed).
- import reads one or more files and merges their contents into the in-memory model, returning a JSON summary of items imported and any per-file errors.
- export writes ontology content to a target file or directory in the requested format and returns a JSON summary listing files written.
- Each command accepts simple arguments and prints machine-friendly JSON summary output to stdout for use in tests and scripting.
- The CLI returns non-zero exit codes for errors and sets exit code zero for successful operations.

User-facing flags

- --dir or -d: directory to read/write persisted data for save/load operations (defaults to data/).
- --format or -f: format for import/export operations (default jsonld).
- --validate: when used with save or import, run the library validate() function and fail on error-level issues.
- --quiet: suppress non-JSON logging for use in scripting.

# Acceptance Criteria

- src/lib/main.js can be executed as a Node CLI and accepts the commands listed above.
- The CLI implements import and export for JSON-LD files and returns machine-friendly JSON summaries describing action results.
- When invoked with --format turtle and the implementation provides the required dependency, export produces a valid Turtle file; tests may mock or skip Turtle behavior if dependency absent.
- A unit or integration test programmatically runs the CLI to perform: run seed, save to a temp dir, export the saved data as jsonld into a temp file, import that file into a fresh model, and assert that stats match the original model.
- CLI exit codes reflect success (0) and failure (non-zero) scenarios, and CLI JSON output includes at least keys: { ok: boolean, summary: object, errors?: [] }.

# Testing Recommendations

- Add tests in tests/unit/cli.test.js that spawn the CLI programmatically to run a seed sequence and assert JSON output and exit codes.
- Add an import/export round-trip test that writes exported JSON-LD to a temporary file, runs import against it in a fresh process, and asserts stats() equivalence.
- When testing format-specific behavior (e.g., Turtle), conditionally run the test only if the optional dependency is present or provide a mocked implementation to avoid brittle CI failures.

# Implementation Notes

- Keep the CLI minimal and use the same public API used by programmatic consumers to avoid duplication of logic.
- Implement import/export as thin wrappers around load/save plus format translators where necessary. Prefer supporting JSON-LD first and adding format translators later.
- If adding Turtle support, consider adding the n3 library as an optional dependency and keep the CLI capable of reporting a clear error when the requested format is not available.
- Ensure JSON summaries are stable and machine-friendly for use in tests and automation.

# Related features

- SEED_DATA
- PERSISTENCE
- STATS
- QUERY
