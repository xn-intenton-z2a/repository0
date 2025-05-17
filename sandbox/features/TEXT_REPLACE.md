# Text Replace Command

## CLI Behavior

Introduce a new CLI command `replace` (alias `text-replace`) to perform search-and-replace operations on a text file.

### Usage

npm run start -- replace <filePath> --search <searchPattern> --replace <replacement> [--regex] [--flags <flags>] [--output <outputFile>]

Options:
- `<filePath>`: Path to the input text file (required).
- `--search`: String or pattern to search for (required).
- `--replace`: Replacement text (required).
- `--regex`: Interpret the `--search` pattern as a regular expression.
- `--flags`: Flags for the regular expression (e.g., `gi`). Defaults to `g` for global replacement.
- `--output`: Path to write the modified file. If not provided, prints result to stdout.

Examples:

npm run start -- replace notes.txt --search TODO --replace DONE
npm run start -- text-replace file.txt --search "foo" --replace "bar" --regex --flags "gi"
npm run start -- replace input.txt --search test --replace exam --output output.txt

## File Modifications

- **sandbox/source/main.js**: 
  - Ensure the `replace` and `text-replace` cases in the CLI switch call `doTextReplace(argv)`.
  - Verify that `doTextReplace` reads the input file, applies literal or regex replacement as specified, and writes to stdout or to the `--output` file.

- **sandbox/tests/text-replace.test.js**:
  - Add tests for missing flags, literal replacement, regex replacement with flags, invalid regex patterns, and writing to an output file.

- **README.md**:
  - Update the CLI Usage section to document the `replace` and `text-replace` commands with examples and options.

- **package.json**:
  - No new dependencies required. Ensure existing dependencies support regex operations.

## Testing

Add Vitest tests to verify:

- Error is thrown when `--search` or `--replace` is missing.
- Literal replacement replaces only the first occurrence when `--regex` is not set.
- Regex replacement with provided flags replaces all matches.
- Invalid regular expressions produce a descriptive error and exit with non-zero status.
- When `--output` is specified, the modified file is written correctly and no stdout is produced.