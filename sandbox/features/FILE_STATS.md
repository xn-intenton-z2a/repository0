# File Statistics

## CLI Behavior

Introduce a new CLI command `stats` to display file metadata for one or more paths. The command prints the file size in bytes, creation time, and last modified time. Support human-readable text output by default and JSON output when the `--json` flag is provided. An optional `--output` flag writes the results to a file instead of stdout.

Usage:

npm run start -- stats <filePath> [<filePath> ...] [--json] [--output <outputFile>]

Examples:

npm run start -- stats README.md
npm run start -- stats src/lib/main.js sandbox/source/main.js --json
npm run start -- stats package.json --output stats.txt
npm run start -- stats *.js --json --output stats.json

## File Modifications

- **sandbox/source/main.js**: Import `fs/promises` for `stat` calls. Add a `stats` case in the CLI switch. Iterate over provided file paths, call `fs.stat` on each, and assemble a results array of objects with `path`, `size`, `createdAt`, and `modifiedAt`. If the `--json` flag is set, serialize the array with `JSON.stringify`. Otherwise, format each entry as a human-readable line. Handle errors for missing files by printing an error message and exiting with status code 1. If `--output` is provided, write the result to the specified path; otherwise, print to stdout.

- **sandbox/tests/stats.test.js**: Create tests that write temporary files with known content and timestamps, invoke `node sandbox/source/main.js stats`, and assert that the output contains the correct size and timestamps. Test `--json` output by parsing JSON and verifying object structure. Test the `--output` flag writes the expected content to the file. Test error handling for non-existent paths.

- **README.md**: Update the CLI Usage section to document the `stats` command with examples, flags, and behavior.

- **package.json**: No new dependencies required.

## Testing

Add tests to verify:

- `stats` on an existing file prints a human-readable size and timestamps line.
- Using `--json` outputs a valid JSON array with objects containing `path`, `size`, `createdAt`, and `modifiedAt` fields.
- The `--output` flag writes the correct content to the specified file path.
- Error for non-existent file prints an appropriate message and exits with a non-zero status code.