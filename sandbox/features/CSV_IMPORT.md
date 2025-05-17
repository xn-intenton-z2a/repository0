# CSV Data Importer

# CLI Behavior

The new command csv-import accepts a CSV file path and optional flags. It reads the CSV file and converts its rows into a JSON array of objects using the first row as header keys. By default the JSON is written to stdout. Use the --output flag to write the JSON to a file. Use the --delimiter flag to specify a custom field delimiter. Use the --header flag to control whether the first row is treated as headers or data only.

# File Modifications

- sandbox/source/main.js: import csv-parse and add a csv-import case in the CLI switch. Read the CSV input file with fs/promises, parse the content into records using the csv-parse sync API, convert rows to objects or arrays based on the --header flag, and handle the --output, --delimiter, and --header flags to write the JSON output to disk when provided.
- sandbox/tests/csv-import.test.js: add feature-level tests that create temporary CSV files with headers and without headers, invoke node sandbox/source/main.js csv-import, and assert that JSON output matches the expected array of objects or arrays. Also verify that the --output flag writes the JSON to the specified file and that custom delimiters are respected.
- README.md: update the CLI Usage section to document the csv-import command with examples for default usage, custom delimiter, headerless data, and the --output flag.
- package.json: ensure that csv-parse is listed as a dependency (add if not already present).

# Testing

Add tests to verify:

- Converting a CSV file with a header row yields a JSON array of objects with correct key/value pairs.
- Converting a CSV file without a header row using --header false yields an array of arrays.
- Using a custom delimiter flag correctly parses fields separated by the specified character.
- The --output option writes the JSON output to the specified file path.