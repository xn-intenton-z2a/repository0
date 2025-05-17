# JSON Query

## CLI Behavior

Introduce a new CLI command query to extract data from JSON files using JSONPath expressions.

Usage:

npm run start -- query <jsonFile> <jsonPath> [--output <file>]

Options:
- jsonFile: Path to the input JSON file.
- jsonPath: JSONPath expression specifying data to extract.
- --output: Optional file path to write the result instead of stdout.

## File Modifications

- sandbox/source/main.js:
  - Import jsonpath from the jsonpath dependency.
  - Add a query case in the CLI switch to call doJsonQuery(argv).
  - Implement async function doJsonQuery(argv) that:
    - Reads and parses the JSON file.
    - Evaluates the JSONPath expression using jsonpath.query.
    - Serializes the resulting array to JSON.
    - Writes the output to stdout or to the specified file.

- sandbox/tests/query.test.js:
  - Create feature-level tests that write temporary JSON files with nested objects and arrays.
  - Invoke node sandbox/source/main.js query with various JSONPath expressions and assert correct output.
  - Test the --output flag writes the JSON result to a file.
  - Verify error handling for missing file or invalid JSONPath expressions.

- README.md:
  - Update the CLI Usage section to document the query command with examples.

- package.json:
  - Add jsonpath under dependencies.

## Testing

Add tests to verify:
- Querying a top-level key returns the correct value.
- Filtering array elements with JSONPath filter expressions.
- Writing output to a file with --output produces the expected JSON.
- Invalid file path or malformed JSONPath yields a clear error message and non-zero exit code.