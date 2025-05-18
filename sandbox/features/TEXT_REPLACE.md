# Text Replace

## CLI Behavior

Introduce a new top-level command `replace` (alias `text-replace`) to perform search-and-replace operations on a text file.

Usage:

npm run start -- replace <filePath> --search <pattern> --replace <replacement> [--regex] [--flags <flags>] [--output <file>]

- `<filePath>`: Path to the input text file.
- `--search`: Literal string or regular expression pattern to find.
- `--replace`: Replacement string.
- `--regex`: Interpret the search pattern as a regular expression. Default is literal search.
- `--flags`: JavaScript RegExp flags (e.g., `g`, `i`, `gi`) when `--regex` is used.
- `--output`: Optional path to write the result. If omitted, the transformed content is printed to stdout.

Behavior:

- Validate that `filePath`, `--search`, and `--replace` are provided; exit with code 1 on missing arguments.
- Read the file content using `fs/promises`.
- If `--regex` is set, construct a `RegExp` from `--search` and `--flags`, catch invalid regex errors and exit with code 1.
- Perform replacement: literal first occurrence when no `--regex`, or RegExp replacement when `--regex` is set.
- Write the resulting content to stdout or to the specified `--output` file.
- On I/O errors, print descriptive message and exit with code 1.

## Implementation

- **sandbox/source/main.js**:
  - Add a new case in the CLI switch for `replace` and alias `text-replace` to call `await doTextReplace(argv)`.
  - Implement `async function doTextReplace(argv)`:
    - Validate required flags and exit on errors.
    - Use `fs.readFile` to load content.
    - Construct replacement logic as described.
    - Use `fs.writeFile` if `--output` is provided, otherwise `console.log` the result.
    - Handle errors with try/catch and proper exit codes.

## Testing

- **sandbox/tests/text-replace.test.js**:
  - Add tests for missing arguments, ensuring exit code 1 and error messages.
  - Verify literal replacement without `--regex` replaces the first occurrence.
  - Verify regex replacement with flags replaces matches as expected.
  - Test invalid regex pattern triggers error.
  - Test writing output to a file when `--output` is specified.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Add a Commands Reference entry for `replace`/`text-replace` with usage examples.
  - Document flags, behavior, and examples of both literal and regex replacements.
