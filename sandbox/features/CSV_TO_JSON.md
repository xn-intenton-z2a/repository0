# CSV to JSON Conversion

This feature adds a new CLI command to convert CSV files into JSON. It reads a CSV file from a specified path, parses it into an array of records using csv-parse, and outputs a JSON array of objects either to stdout or to a user-specified file.

# Usage

--csv2json <csvPath> [--output <file>]

The user provides the path to an input CSV file. If the --output option is provided, the JSON result is written to the given file; otherwise it is printed to stdout.

# Implementation

Import the csv-parse library. Implement a convertCsvToJson function that:
1. Reads the CSV file from the file system.
2. Parses the CSV text with header row detection and record mapping.
3. Serializes the parsed data to JSON with 2-space indentation.
4. Writes the JSON to stdout or to the output file path.
Handle errors for missing files and parse failures with appropriate exit codes.

# Tests

Add unit and E2E tests in sandbox/tests:
- Valid CSV with headers converting to JSON array.
- CSV without headers treated as arrays of values.
- Missing CSV path triggers error exit.
- JSON output written correctly when --output is specified.
- Alias -c for --csv2json works the same.