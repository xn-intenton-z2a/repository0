# JSON Query

## CLI Behavior

Introduce a new top-level command `query` to filter and project JSON data using JMESPath expressions.

Usage:

npm run start -- query <jsonFile> --expression <jmespathExpr> [--raw] [--output <file>]

- `<jsonFile>`: Path to the JSON file to query.
- `--expression <jmespathExpr>`: Required JMESPath expression to apply to the JSON data.
- `--raw`: Output the result without pretty-print indentation (compact JSON).
- `--output <file>`: Optional path to write the query result; defaults to stdout.

Behavior:

- Read and parse the JSON file; on parse error print an error message and exit with code 1.
- Compile and apply the JMESPath expression to the parsed data; on invalid expression print an error and exit with code 1.
- Serialize the resulting data as JSON:
  - With indentation of two spaces by default.
  - Without indentation when `--raw` is specified.
- If `--output` is provided, write the serialized result to the specified file; otherwise print to stdout.

## Implementation

- **sandbox/source/main.js**:
  - Add import of jmespath from the `jmespath` package.
  - In the main switch, add case `query` to call `await doJsonQueryCommand(argv)`.
  - Implement `async function doJsonQueryCommand(argv)`:
    - Validate presence of `argv._[1]` and `argv.expression`; on missing exit with code 1 and usage message.
    - Read the file content and JSON.parse it inside try/catch.
    - Compile and apply the JMESPath expression: `jmespath.search(data, expr)`.
    - Handle errors for invalid expressions.
    - Determine output formatting based on `argv.raw`.
    - Handle `--output` by writing to file or printing to stdout.

- **package.json**:
  - Add `jmespath` to dependencies.

## Testing

- **sandbox/tests/json-query.test.js**:
  - Create a temporary JSON file containing nested objects and arrays.
  - Test simple projection: extract a single field or array of values.
  - Test filtering: apply an expression that filters elements by a condition.
  - Test `--raw` produces compact JSON.
  - Test `--output` writes the result to a file.
  - Test error on missing file, invalid JSON input, and invalid JMESPath expression.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Add a section for the `query` command under Commands Reference.
  - Document usage, flags, and examples of common JMESPath queries.