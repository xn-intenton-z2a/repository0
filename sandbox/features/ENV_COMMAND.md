# Env Command

## Overview
When invoked with the --env flag, the CLI loads environment variables from a .env file at the project root and prints the resulting key-value pairs in JSON format, allowing users to verify configuration without inspecting files manually.

## Behavior
- Detect the --env flag in CLI arguments.
- Use dotenv to load and parse a .env file from the repository root.
- If parsing succeeds, print the parsed variables as a formatted JSON string to standard output and exit with code 0.
- If loading or parsing fails, print an error message to standard error and exit with code 1.

## Implementation Details
- Import dotenv in sandbox/source/main.js.
- After handling --help, --version, and --mission flags, detect --env.
- Call dotenv.config() and inspect the returned object for parsed data or error.
- On success, call console.log with JSON.stringify(parsed, null, 2) and process.exit(0).
- On failure, call console.error with a descriptive message and process.exit(1).

## Tests
- Create sandbox/tests/env.test.js.
- Mock dotenv.config to return parsed and no error; invoke main with ["--env"] and assert console.log called with formatted JSON and process.exit(0).
- Mock dotenv.config to return an error; invoke main with ["--env"] and assert console.error called with descriptive message and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to add a section for the --env flag.
- Include examples: npm run start -- --env and sample output.