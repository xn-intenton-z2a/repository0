# Info Command

## Overview
Add a new flag --info to the CLI to provide a consolidated summary of the project state. The CLI prints a JSON object containing the repository name, version, mission statement, and loaded environment variables, enabling users to view all key information in a single command.

## Behavior

- Detect the --info flag in the CLI arguments after handling --help, --version, --mission, and --env flags.
- Read package.json at the repository root and parse the name and version fields.
- Read MISSION.md at the repository root to obtain the mission statement content.
- Load environment variables from a .env file at the project root using dotenv.config.
- Combine the extracted values into an object with properties: name, version, mission, env.
- Print the JSON representation of this object to standard output with two space indentation.
- Exit the process with code 0 on success.
- On any error reading files or loading environment variables, print a descriptive error message to standard error and exit with code 1.

## Implementation Details

- In sandbox/source/main.js, extend minimist option parsing to recognize an info boolean flag.
- After existing conditional branches for help, version, mission, and env, insert a new branch for info.
- Use fs.readFileSync with utf8 encoding to load package.json and MISSION.md.
- Use JSON.parse to extract fields from package.json.
- Invoke dotenv.config to load environment variables and inspect the returned parsed object or error.
- Wrap all operations in a try catch block to handle exceptions.
- On success, call console.log with JSON.stringify(infoObject, null, 2) and process.exit(0).
- On failure, call console.error with description and process.exit(1).

## Tests

- Create sandbox/tests/info.test.js with tests that:
  - Mock fs.readFileSync to return valid package.json content and mission text, mock dotenv.config to return parsed env object, invoke main with ["--info"], and assert that console.log is called with the expected formatted JSON string and process.exit(0).
  - Mock fs.readFileSync to throw an error or dotenv.config to return an error, invoke main with ["--info"], and assert that console.error is called with a descriptive message and process.exit(1).

## Documentation

- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --info flag, showing example usage: npm run start -- --info and sample JSON output.

## Compatibility

- Utilizes existing dependencies: fs, minimist, dotenv.
- Does not require adding new dependencies or modifying other parts of the codebase.