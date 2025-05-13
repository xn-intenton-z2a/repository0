# Info Command

## Overview
Extend the --info flag to provide a comprehensive, consolidated summary of the project state. The CLI prints a JSON object containing repository metadata and useful configuration details, enabling users to view all key information in a single command.

## Behavior

- Detect the --info flag in the CLI arguments after handling --help, --version, and --mission flags.
- Read package.json at the repository root and parse the name, version, scripts, dependencies, devDependencies, and license fields.
- Read MISSION.md at the repository root to obtain the mission statement.
- Load environment variables from a .env file at the project root using dotenv.config.
- Combine the extracted values into an object with keys: name, version, mission, env, scripts, dependencies, devDependencies, license.
- Print the JSON representation of this object to standard output with two-space indentation.
- Exit the process with code 0 on success.
- On any error reading files or loading environment variables, print a descriptive error message to standard error and exit with code 1.

## Implementation Details

- In sandbox/source/main.js, extend minimist option parsing to recognize an info boolean flag.
- After existing branches for help, version, and mission, insert a new branch for info.
- Use fs.readFileSync with utf8 encoding to load package.json and MISSION.md.
- Use JSON.parse to extract the desired fields from package.json.
- Invoke dotenv.config to load environment variables.
- Wrap all operations in a try/catch block to handle exceptions.
- On success, call console.log with JSON.stringify(infoObject, null, 2) and process.exit(0).
- On failure, call console.error with a descriptive message and process.exit(1).

## Tests

- Create or update sandbox/tests/info.test.js with tests that:
  - Mock fs.readFileSync to return valid package.json content containing known fields, mock dotenv.config to return a parsed env object, invoke main with ["--info"], and assert console.log is called with the expected formatted JSON string and process.exit(0).
  - Mock fs.readFileSync to throw an error or return invalid content, or mock dotenv.config to return an error, invoke main with ["--info"], and assert console.error is called with an appropriate message and process.exit(1).

## Documentation

- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include an expanded section for the --info flag.
- Provide example usage:
  npm run start -- --info
- Show sample JSON output illustrating all keys.