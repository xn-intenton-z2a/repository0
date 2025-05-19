# JSON Output

## Description
Provide a structured JSON output mode for every CLI command so that consumers can integrate the tool into automation pipelines. When the --json or -j flag is present, wrap the command result into a JSON object with a predictable schema.

## Implementation

- Update src/lib/main.js and sandbox/source/main.js to accept and remove a --json or -j flag early in parsing.
- Retain the existing help, version, mission, echo, and plot flows, but when json mode is enabled:
  - Build a result object that contains a single top-level key corresponding to the command name.
    * help → { "help": "...full help text..." }
    * version → { "version": "2.1.0-0" }
    * mission → { "mission": "# Mission Statement..." }
    * echo → { "echo": [ ...positional arguments array... ] }
    * plot → { "svg": "<svg ...>...</svg>" } or if --output was used { "output": "path/to/file.svg" }
  - Serialize the result object with JSON.stringify and print to stdout. Omit any additional console logs.
- Ensure that exit codes remain zero on success and non-zero when original commands would have failed.

## Testing

- Add sandbox/tests/json_output.test.js with tests that:
  * Run echo with sample arguments and --json and verify stdout is valid JSON with an "echo" array matching input.
  * Run version with --json and verify stdout parses to an object with a "version" string equal to package.json version.
  * Run plot quadratic with coefficients and --json and verify stdout parses to object with an "svg" string starting with "<svg".
  * Run plot sine with --json and --output and verify that the file is created and stdout JSON contains an "output" field pointing to the file path.
  * Test that invalid flag combinations still exit with a non-zero code when --json is present.

## Documentation

- Update README.md under CLI Usage to include a JSON Output subsection showing how to invoke any command with --json or -j and the shape of the resulting JSON object.
