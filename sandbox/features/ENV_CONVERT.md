# ENV Conversion

## CLI Behavior
Add a new command env to convert .env files and JSON objects between dotenv format and JSON format. The command accepts an input file path and optional flags. By default it parses a .env file and outputs JSON. Use the --to-env flag to convert JSON to dotenv format. The command writes the result to stdout or to a file when an --output flag is provided.

Usage:
npm run start -- env <inputFile> [--to-env] [--output <outputFile>]

## File Modifications
- sandbox/source/main.js: import dotenv from dotenv and add an env case in the CLI switch. Read the input file with fs promises. If converting to JSON call dotenv parse on the file content and stringify the result. If converting to dotenv parse the JSON input and serialize key value pairs in the format KEY=VALUE lines. Handle the --output flag to write the result to disk when provided.
- sandbox/tests/env.test.js: add a feature level test that creates temporary .env and JSON files, invokes node sandbox/source/main.js env for both conversion directions, and asserts that the output matches the expected JSON object or dotenv formatted string. Verify that the --output option writes the file with correct content.
- README.md: update the CLI Usage section to document the env command with examples for both conversion directions and the --output flag.
- package.json: ensure that dotenv is listed as a dependency (no change required if already present).

## Testing
Add tests to verify:
- Converting a .env file yields a valid JSON object with correct key value pairs
- Converting a JSON file with --to-env produces a dotenv formatted string with each key value pair on its own line
- The --output option writes the converted result to the specified file path