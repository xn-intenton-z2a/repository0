# CSV Conversion

## CLI Behavior

Introduce two related commands for bidirectional CSV conversion:

- csv-import <inputFile> [--delimiter <char>] [--header <true|false>] [--output <outputFile>]
  Converts a CSV file into a JSON array. By default the first row is used as header keys. Custom delimiter and headerless mode are supported. Writes JSON to stdout or to the specified output file.

- csv-export <inputFile> [--output <outputFile>]
  Converts a JSON file containing an array of objects or arrays into a CSV string. When the array contains objects, use the keys of the first object as headers. Writes CSV to stdout or to the specified output file.

## File Modifications

- sandbox/source/main.js:
  - Import the sync parse function from csv-parse and implement two cases in the CLI switch: csv-import and csv-export.
  - For csv-import, retain existing logic to parse CSV into records and output JSON.
  - For csv-export, read and parse the JSON input file, detect whether items are objects or arrays, construct a CSV string with an optional header row, join rows with the given delimiter comma, and handle the --output flag to write to disk or print.

- sandbox/tests/csv-export.test.js:
  - Add feature-level tests that create temporary JSON files with arrays of objects and arrays, invoke node sandbox/source/main.js csv-export, and assert that the CSV output or output file contains correctly formatted rows and headers where appropriate.

- README.md:
  - Update the CLI Usage section to document the csv-export command with examples demonstrating conversion of object arrays and array-only data, and the --output flag.

- package.json:
  - No new dependencies required; rely on existing csv-parse and core libraries.

## Testing

Add tests to verify:

- Converting a JSON array of objects produces a header row followed by data rows.
- Converting a JSON array of arrays produces rows without an additional header.
- The --output flag writes the CSV string to the specified file path.
- Existing csv-import tests continue to pass unchanged.