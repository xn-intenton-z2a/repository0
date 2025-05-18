# Word Count

## CLI Behavior

Introduce a new CLI command wc to compute line, word, and character counts for one or more files.

Usage:

wc <filePath> [<filePath> ...] [--lines] [--words] [--chars] [--json] [--output <file>]

- filePath: Path to the file; multiple paths allowed.
- --lines: Show only the line count.
- --words: Show only the word count.
- --chars: Show only the character count.
- --json: Output results as a JSON array of objects { path, lines, words, chars }.
- --output: Write the output to the specified file instead of stdout.

By default, wc prints lines, words, and characters counts for each file in a human-readable format.

## File Modifications

- sandbox/source/main.js:
  - Import fs/promises for file reading.
  - Add a wc case in the CLI switch to invoke doWcCommand(argv).
  - Implement async function doWcCommand(argv) that:
    - Validates at least one file path is provided; else prints an error and exits with status 1.
    - Reads each file as UTF-8 and computes:
      - Lines: number of newline characters plus one if not empty.
      - Words: number of whitespace-separated tokens.
      - Chars: length of the string.
    - Builds a results array of objects with path, lines, words, and chars fields.
    - Formats output:
      - If --json: JSON.stringify(results, null, 2).
      - Otherwise: one line per file: path: L lines, W words, C chars.
    - Writes to stdout or to the file specified by --output.
    - Handles read errors by printing an error and exiting non-zero.

- sandbox/tests/wc.test.js:
  - Create temporary text files with known content.
  - Invoke node sandbox/source/main.js wc and assert default output lines.
  - Test --lines, --words, --chars flags individually.
  - Test --json produces valid JSON with correct counts.
  - Test multiple file arguments.
  - Test --output writes to the given file.
  - Test error on missing arguments or non-existent files.

- README.md:
  - Update the Commands Reference section to document the wc command with usage examples.

- package.json:
  - No new dependencies required.

## Testing

Ensure npm test runs the new sandbox/tests/wc.test.js. Verify correct counts, JSON formatting, file output, and error handling.