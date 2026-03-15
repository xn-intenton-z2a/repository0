# CLI

Summary

Define and implement the command line interface used to drive expression parsing, series generation, CSV loading, rendering, and file output.

Rationale

A simple, well documented CLI is essential for discoverability and automated usage in scripts and CI.

Scope

- Enhance src/lib/main.js so it can be invoked as a CLI and export the same functions for programmatic use.
- Supported flags: --expression, --range, --csv, --file, --help.
- Examples of usage should appear in README and the CLI help text.

Files to change

- src/lib/main.js (CLI entry and exports)
- tests/unit/cli.test.js (unit tests that assert help text and basic invocation behaviour)
- README.md (usage examples)

Acceptance Criteria

- The CLI prints usage and examples when invoked with --help.
- Running node src/lib/main.js --expression y=Math.sin(x) --range -3.14:0.01:3.14 --file output.svg produces an output file named output.svg containing valid SVG.
- Running node src/lib/main.js --csv data.csv --file output.png produces a PNG file when the PNG dependency is installed.

Implementation notes

- Implement a minimal, dependency-free argument parser, or use process.argv directly to reduce dependencies.
- Keep the CLI thin; prefer composing the library exports rather than duplicating logic.
