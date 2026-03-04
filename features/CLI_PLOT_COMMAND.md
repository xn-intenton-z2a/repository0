# CLI_PLOT_COMMAND

Summary

Provide a CLI command that ties parsing and generation together and produces a plot file. The CLI offers a compact, scriptable entry point for users to convert expressions into SVG or PNG plot files.

Motivation

A CLI is the primary user-facing surface for this library per the mission. Users should be able to call the tool from scripts or the terminal with options for expression, range, output format, and filename, and optionally dry-run to inspect the pipeline without producing binary output.

Scope

- Implement a CLI command, invocable as node run start or an npm script, accepting options: --expression, --range, --format, --file, --steps, --step, --dry-run, --width, --height.
- On dry-run return a JSON-like summary printed to stdout describing the parsed expression, resolved range, sample count and target file path without creating files.
- On normal run, the CLI uses parser and generator to produce points then invokes renderer to write SVG or PNG to the specified file path.
- CLI should exit with appropriate status codes: 0 on success, non-zero on parse, generate, or render errors and print human-readable messages.

Implementation notes

- Use an existing CLI arg parser already used in the project or a minimal dependency. Map option names to the generator and renderer APIs.
- Keep code in src/cli.js or wire into src/lib/main.js with a small CLI entrypoint script and tests.

Files to modify

- package.json scripts to include a start or bin entry if necessary and document example usage in README.md
- src/lib/main.js or src/cli.js
- tests/unit/cli.test.js

Acceptance criteria

- CLI parses provided arguments and returns dry-run output illustrating the steps without writing files when --dry-run is supplied.
- CLI successfully generates an SVG file when given --format svg and a writable filename.
- CLI returns non-zero exit code and prints an error message when the expression cannot be parsed.
- Unit tests validate argument parsing logic and dry-run behaviour.

Examples (for README)

node run start -- --expression y=sin(x) --range 0:6.28 --format svg --file output.svg
node run start -- --expression y=x^2 --range -1:1:101 --dry-run

Notes

Make the CLI behaviour deterministic and document default values for width, height and sample counts in README.