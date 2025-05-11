# Overview
Add a new CLI command to load and validate environment variables from a .env file. This feature ensures required configuration values are present and correctly typed before other commands run, preventing runtime errors due to missing or misconfigured environment settings.

# CLI Usage
Invoke the validator via the main script:

  node src/lib/main.js validate-config [-e <envFile>]

- The `validate-config` command must be the first argument.
- Optional `-e <envFile>` specifies the path to the env file; defaults to `.env` in the project root.
- On success, the validated configuration is printed as JSON to stdout and exit code is 0.
- On validation failure, errors describing missing or invalid keys are printed to stderr and exit code is non-zero.

# Implementation Details
1. Detect the `validate-config` command in the main dispatch logic.
2. Parse the optional `-e` flag to determine the env file path, using `minimist` or manual parsing.
3. Load environment variables from the specified file using `dotenv`.
4. Define a Zod schema for the expected configuration keys (e.g., OPENAI_API_KEY as non-empty string, ISSUE_TO_CODE_CONVERSION_RATE as a number between 0 and 1).
5. Validate the loaded environment object against the schema.
6. On success, serialize the parsed config object to JSON and write to stdout.
7. On failure, iterate schema errors, print human-readable messages to stderr.

# File Changes
- **src/lib/main.js**: Extend command dispatch to handle `validate-config`, implement flag parsing, env loading, schema definition, validation logic, and output behavior.
- **package.json**: Ensure `dotenv` and `zod` remain listed under dependencies, no new packages required.
- **sandbox/tests/validate-config.test.js**: Add unit tests covering valid .env loading, missing file, missing keys, and invalid value types, verifying stdout or stderr and exit codes.
- **README.md**: Document the `validate-config` command under CLI Usage with examples of success and failure cases.
