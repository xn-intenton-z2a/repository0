# ENV_VARS

## Overview
This feature enables the CLI to load environment variables from a `.env` file and expose them through a new `--env` option. Users can retrieve a single variable by name or list all loaded variables in JSON format. This adds a core capability for CLI configuration and inspection using environment settings.

## Specification

### Loading Environment File
- On startup, the CLI will attempt to load a `.env` file in the working directory using `dotenv`. Environment variables defined in `.env` are merged into `process.env`.

### New CLI Option
- Introduce a boolean/parameter option `--env` (alias `-e`) via `minimist` configuration.
- If invoked as `--env VAR_NAME`, the CLI will print the value of `process.env.VAR_NAME`. If the variable is not defined, it will print an error message and exit with code 1.
- If invoked as `--env` without a name, the CLI will print all loaded environment variables as a JSON string.

### Error Handling
- If `.env` cannot be found or parsed, proceed silently (no error), relying on existing `process.env` only.
- Missing variable requests will result in a console.error message: Missing environment variable: VAR_NAME and exit code 1.

### Tests
- Add `sandbox/tests/env.test.js` covering:
  - Loading `.env` file with sample variables and retrieving a known variable.
  - Requesting an undefined variable yields an error and exit code 1.
  - Listing without a name prints a JSON object containing all keys and values from `.env`.
  - Alias `-e` works the same as `--env`.

## Usage Examples
node sandbox/source/main.js --env
node sandbox/source/main.js --env API_KEY
node sandbox/source/main.js -e NODE_ENV