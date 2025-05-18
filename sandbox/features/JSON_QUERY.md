# JSON Query

## CLI Behavior

Introduce a new top-level command query to extract data from a JSON file using JSONPath expressions.

Usage

npm run start -- query <jsonFile> <expression> [--output <file>] [--pretty]

- <jsonFile>: Path to the JSON file to query (required)
- <expression>: JSONPath expression for selecting data (required)
- --output <file>: Optional path to write the query result; defaults to stdout
- --pretty: Format the JSON output with two-space indentation

Behavior

Read the JSON file and parse its contents. Evaluate the JSONPath expression against the parsed object using the jsonpath library. Serialize the result as JSON. If --pretty is provided, format the output with indentation. If --output is specified, write the output to the given file, otherwise print to stdout. On missing arguments, read or parse errors, or invalid expressions, print descriptive error messages to stderr and exit with code 1.

## Implementation

- sandbox/source/main.js
  - Add dependency jsonpath to package.json
  - Import jsonpath from 'jsonpath'
  - In the main CLI switch, add a case query that calls await doQueryCommand(argv)
  - Implement async function doQueryCommand(argv):
    - Validate presence of argv._[1] and argv._[2]; if missing, print usage and exit code 1
    - Read and parse the JSON file as UTF-8 text
    - Use jsonpath.query on the parsed object and the expression
    - Serialize the result; apply JSON.stringify with two spaces if argv.pretty is true, else compact
    - Write to output file if specified, or console.log to stdout
    - Catch and report errors, exiting with code 1

## Testing

Add sandbox/tests/query.test.js to cover:

- Extract a top-level property
- Select nested array items using a JSONPath expression
- Handle expressions that yield multiple results
- Use --pretty to format output with indentation
- Write results to a file with --output
- Error on non-existent file, invalid JSON, or invalid JSONPath expression

## Documentation

- Update README.md and sandbox/docs/CLI_USAGE.md to include the query command under Commands Reference with usage, flags, and examples for common patterns