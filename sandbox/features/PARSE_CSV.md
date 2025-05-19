# Feature Overview

Add a new CLI command `parse-csv` that reads a CSV file from disk, parses its contents, and outputs the resulting data structure as JSON to stdout. This feature leverages the existing `csv-parse` dependency and provides a quick way for users to convert CSV data into JSON via the CLI.

# CLI Usage

The command is invoked as a positional command:

    npm run start -- parse-csv <path-to-csv-file>

- `<path-to-csv-file>`: Required. Path to the CSV file to parse.

# Behavior

1. Validate that a file path argument is provided; if missing, print an error to stderr and exit with code 1.
2. Read the specified file from disk using `fs/promises`.
3. Pass the file contents to the `csv-parse` library to parse into an array of records.
4. Print the JSON representation of the records to stdout and exit with code 0.
5. On parse or file-read errors, print the error message to stderr and exit with code 1.

# Implementation Details

- Update `main()` in `sandbox/source/main.js` to detect the `parse-csv` command.
- Import and use `csv-parse` to handle parsing, with default options:
  - Treat the first row as headers if present.
  - Output each row as an object keyed by header values if headers exist, otherwise an array.
- Use `process.exit` to return appropriate exit codes.

# Tests

Provide new tests in `sandbox/tests/csv.test.js` covering:

- Successful parsing of a small CSV fixture: confirm JSON output matches expected array of objects or arrays.
- Error when no file argument is provided: expect stderr message and exit status 1.
- Error when file does not exist: expect stderr message and exit status 1.

# Documentation

- Update `sandbox/docs/README.md` to include the `parse-csv` command under the Commands section, with usage examples.
- Add a feature markdown file in `sandbox/features/parse_csv.md` describing this feature, with optional mission tags `[cli, data-processing]`.
