# Summary

The PARSE_CSV feature adds a new CLI command to read and parse a CSV file and output its contents as a JSON array. This provides a straightforward way to convert tabular data into JSON for pipelines, scripts, and other tooling without requiring external dependencies or manual conversion.

# CLI Interface

--csv <filePath>

Reads the CSV file at the specified filePath, parses it using the csv-parse library with header row support, and writes the resulting JSON array to stdout. Supports an alias -c for convenience.

# Implementation Details

- Import the parse function from the csv-parse module.
- Extend the main entrypoint in sandbox/source/main.js to detect `args.csv` or `args['parse-csv']` and alias `-c`.
- Use fs/promises to read the file content, then pass the content to the parse function with `columns: true` to produce an array of objects.
- Output the JSON array with `console.log(JSON.stringify(records, null, 2))`.
- Handle errors by printing an error message to stderr and exiting with code 1.

# Test Scenarios

- Unit tests in sandbox/tests/csv.test.js to validate parsing of a simple CSV string with header and multiple rows by invoking the exported main function.
- E2E tests using child_process in sandbox/tests/csv.e2e.test.js to verify `node sandbox/source/main.js --csv sample.csv` outputs the correct JSON array and exits with code 0.
