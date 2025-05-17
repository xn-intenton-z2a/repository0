# JSON Formatting

## CLI Behavior

Add a new command json-format that reads a JSON file, formats it with configurable indentation, optional key sorting, and writes the result to stdout or to a file with the --output flag.

Usage:
 npm run start -- json-format <inputFile> [--indent <number>] [--sort] [--output <outputFile>]

Options:
- --indent <number>: Number of spaces for indentation; defaults to 2.
- --sort: Sort object keys alphabetically before formatting.
- --output <outputFile>: Write the formatted JSON to the specified file instead of stdout.

## File Modifications

- sandbox/source/main.js: import fs/promises, parse minimist flags for json-format, read the input JSON file, parse it, optionally sort object keys recursively when --sort is provided, stringify the object using JSON.stringify with the specified indent, and handle the --output flag to write the result to the given file path or print to stdout.
- sandbox/tests/json-format.test.js: add feature-level tests that create temporary JSON files with unsorted keys and nested objects, invoke node sandbox/source/main.js json-format with different indent and sort options, and assert that the output or written file contains correctly formatted JSON with proper indentation and sorted keys when requested.
- README.md: update the CLI Usage section to document the json-format command with examples demonstrating default formatting, custom indentation, sorted keys, and the --output flag.
- package.json: no new dependencies required.

## Testing

Add tests to verify:

- Formatting without flags produces JSON with 2-space indentation and original key order.
- Formatting with --indent 4 produces JSON with 4-space indentation.
- Formatting with --sort sorts object keys alphabetically at all nesting levels.
- The --output flag writes the formatted JSON to the specified file path.