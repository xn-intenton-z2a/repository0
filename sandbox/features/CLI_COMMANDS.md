# CLI Commands

## Overview

Unify core CLI command support, file utilities, and detailed help into a single feature. This feature covers the `help`, `help <command>`, `replace`/`text-replace`, and `stats` commands under one conceptual grouping, ensuring consistent documentation, usage, and maintenance.

## Detailed Help

### CLI Behavior

- Running `help` or no command prints the general usage message and lists all available commands.
- Running `help <command>` prints detailed usage, flags, and examples for the specified command. If the command does not exist, prints an error message and exits with code 1.

### Implementation

- **sandbox/source/main.js**:
  - Extend the existing `showHelp` function to accept an optional command argument.
  - Create a mapping from command names to their usage strings and examples.
  - In the main switch block, handle `help` by checking `argv._[1]`: if present, lookup and print detailed help; otherwise, fallback to general help.
  - For unknown commands in `help <command>`, print `Unknown command: <command>` and exit code 1.

- **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Update the Commands Reference to document the `help <command>` syntax and include per-command usage sections for `replace`, `text-replace`, and `stats` under a unified File Utilities section.

## File Utilities

### replace / text-replace

Perform search-and-replace on a text file with options for literal or regex replacement.

- Flags: `--search <pattern>`, `--replace <string>`, optional `--regex`, `--flags <regexFlags>`, `--all`, `--output <file>`.
- Default behavior: first occurrence literal replacement; `--all` for global literal replacement; `--regex` defaults to global when no flags are provided.

### stats

Compute file metrics: lines, words, characters, bytes.

- Usage: `stats <filePath> [--lines] [--words] [--chars] [--bytes] [--json] [--output <file>]`.
- When no metric flags are provided, report all metrics.
- Support streaming mode for large files.

## Testing

- Add tests under `sandbox/tests` to cover:
  - `help help` and `help replace` produce correct detailed usage.
  - Error on `help unknown` with exit code 1.
  - Existing tests for `replace` and `stats` continue to pass unchanged.