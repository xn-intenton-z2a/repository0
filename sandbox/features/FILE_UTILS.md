# File Utilities

## CLI Behavior

Unify text replacement and file statistics under a single "file-utils" conceptual grouping of commands. The existing `replace` (alias `text-replace`) and `stats` commands remain available with their current flags and behavior:

### replace / text-replace

- `--search <pattern>` (required): String or regex pattern to search for.
- `--replace <string>` (required): Replacement string.
- `--regex`: Treat `<pattern>` as a regular expression. Defaults to global (`g`) replacement when no `--flags` are provided.
- `--flags <regexFlags>`: Specify flags for regex replacement (e.g., `gi`).
- `--all`: Perform global literal replacements when `--regex` is not provided.
- `--output <file>`: Write the replaced output to a file instead of stdout.

Behavior remains unchanged: literal replacement replaces the first occurrence by default, global literal when `--all` is set, regex replacement uses provided flags or defaults to global.

### stats

Usage: npm run start -- stats <filePath> [--lines] [--words] [--chars] [--bytes] [--json] [--output <file>]

- `--lines`: Include line count.
- `--words`: Include word count (split on whitespace).
- `--chars`: Include character count.
- `--bytes`: Include byte count.
- `--json`: Output metrics as a JSON object.
- `--output <file>`: Write the report to the specified file.

If no metric flags are provided, report all metrics. Reading is done efficiently in streaming mode for large files.

## File Modifications

- sandbox/source/main.js: Retains and groups the existing `doTextReplace` and `doStatsCommand` implementations under the CLI switch for `replace` / `text-replace` and `stats`. No new code is required, but documentation grouping in comments can be updated to reflect the unified feature.
- sandbox/tests/text-replace.test.js and sandbox/tests/stats.test.js: Existing tests remain and cover all replace and stats scenarios.
- README.md and sandbox/docs/CLI_USAGE.md: Update Commands Reference to group `replace`, `text-replace`, and `stats` under File Utilities and document their flags and examples in one section.
- package.json: No change required; dependencies for fs and stream remain.

## Testing

All current tests for replace and stats continue to apply without modification, ensuring backward compatibility and validation of both command behaviors.