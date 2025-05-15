sandbox/features/OUTDATED_COMMAND.md
# sandbox/features/OUTDATED_COMMAND.md
# Outdated Command

## Overview
Add a `--outdated` flag to the CLI that checks for outdated npm dependencies and reports available updates. This helps users maintain up-to-date dependencies and catch potential security or compatibility issues early.

## Behavior
- Detect an `outdated` boolean option in CLI arguments after handling other flags.
- Invoke `npm outdated --json` in the repository root using a child process.
- If the command returns valid JSON with outdated entries:
  - Parse the JSON output representing packages with current, wanted, and latest versions.
  - Print a formatted JSON object with two-space indentation to standard output.
  - Exit the CLI process with code 0.
- If no outdated dependencies are found (empty output or empty object):
  - Print "All dependencies are up to date." to standard output.
  - Exit with code 0.
- On spawn failure or invalid JSON parse:
  - Print a descriptive error message to standard error.
  - Exit with code 1.

## Implementation Details
- In `sandbox/source/main.js`, extend `minimist` options to include `outdated` mapped to `outdated` boolean.
- After existing branches, add an `else if (outdated)` branch that:
  - Imports `child_process` and calls `spawnSync("npm", ["outdated", "--json"], { encoding: "utf8" })`.
  - Checks `result.error` or non-zero `result.status` to detect errors.
  - If `result.stdout` is non-empty:
    - Parse JSON and `console.log(JSON.stringify(parsed, null, 2))`.
  - If `result.stdout` is empty or parses to an empty object:
    - `console.log("All dependencies are up to date.")`.
  - Wrap spawn and parse in `try/catch` to handle exceptions.

## Tests
- Create `sandbox/tests/outdated.test.js` with scenarios:
  - **With Outdated Packages**: Mock `child_process.spawnSync` to return a `stdout` string of JSON with outdated entries and `status` 0. Invoke `main(["--outdated"])` and assert `console.log` is called with formatted JSON and `process.exit(0)` is invoked.
  - **No Outdated Packages**: Mock `child_process.spawnSync` to return empty `stdout` and `status` 0. Assert `console.log` is called with "All dependencies are up to date." and `process.exit(0)`.
  - **Spawn Failure**: Mock `spawnSync` to throw an error or return an `error` property. Assert `console.error` with error message and `process.exit(1)`.
  - **Invalid JSON**: Mock `spawnSync` to return invalid JSON in `stdout`. Assert `console.error` and `process.exit(1)`.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include a section for `--outdated`:
  - Show usage example:
    npm run start -- --outdated
  - Describe example outputs for both outdated packages and up-to-date case.

## Compatibility
- No new dependencies required; uses built-in `child_process` module.
- Follows existing CLI structure in `sandbox/source/main.js`.
- Aligns with Vitest testing setup and sandboxed source and test paths.
sandbox/features/RUN_COMMAND.md
# sandbox/features/RUN_COMMAND.md
# Run Command

## Overview
Add a `--run <script>` flag to the CLI that executes an npm script defined in `package.json`, enabling users to run automation tasks and shortcuts without switching context.

## Behavior

- Detect a `run` option in CLI arguments, expecting a string value for the script name.
- Read `package.json` from the repository root and parse its `scripts` section.
- If the specified script name exists:
  - Spawn a child process to execute `npm run <script>`.
  - Pipe the child process's standard output and error streams to the CLI.
  - Exit the CLI process with the same exit code as the child process.
- If the script name is not found in `scripts`:
  - Print an error message to standard error indicating the unknown script.
  - Exit with code 1.
- On any file read, parse, or spawn failure, print a descriptive error to standard error and exit with code 1.

## Implementation Details

- In `sandbox/source/main.js`, extend the `minimist` options to include `run` as a string option.
- After existing branches for `--help`, `--version`, `--mission`, `--info`, `--scripts`, and `--validate-config`, add an `else if (run)` branch:
  - Use `fs.readFileSync` with `utf8` encoding to load `package.json`.
  - Parse JSON to extract the `scripts` object.
  - Check if `scripts[run]` is defined.
  - If defined, import `child_process` and call `child_process.spawnSync("npm", ["run", run], { stdio: "inherit" })`.
  - Capture the returned `status` and call `process.exit(status)`.
  - If not defined or if `spawnSync` throws, console.error a clear message and call `process.exit(1)`.

## Tests

- Create `sandbox/tests/run.test.js` with scenarios:
  - **Valid Script**: Mock `fs.readFileSync` to return JSON containing a known script, mock `spawnSync` to return `{ status: 0 }`. Invoke `main(["--run", "build"])`, assert that `spawnSync` is called correctly and `process.exit(0)` is invoked.
  - **Unknown Script**: Mock `fs.readFileSync` to return JSON without the script. Invoke `main(["--run", "deploy"])`, assert that `console.error` is called with an appropriate message and `process.exit(1)` is invoked.
  - **Spawn Failure**: Mock `fs.readFileSync` to return valid JSON and `spawnSync` to throw an error. Assert that `console.error` and `process.exit(1)` are invoked.

- Use Vitest spies to mock `fs.readFileSync`, `child_process.spawnSync`, `console.error`, and `process.exit`.

## Documentation

- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include a section for the `--run` flag:
  - Show usage example:
    npm run start -- --run test
  - Describe expected output when running a known script and error case when script is missing.

## Compatibility

- Uses built-in `child_process`; no additional dependencies are required.
- Maintains consistency with existing CLI branching in `sandbox/source/main.js`.
- Aligns with Vitest testing setup and sandboxed source and test paths.sandbox/features/VALIDATE_CONFIG.md
# sandbox/features/VALIDATE_CONFIG.md
# Validate Config Command

## Overview
Add a `--validate-config <file>` flag to the CLI that reads a YAML configuration file, parses it with js-yaml, and validates its content against a predefined schema using zod. This feature helps users detect invalid or missing configuration values early in their workflow.

## Behavior
- Detect a `validate-config` string option in CLI arguments after handling other flags.
- Resolve the provided file path relative to the current working directory.
- Read the file contents using `fs.readFileSync` with UTF-8 encoding.
- Parse the content as YAML using `js-yaml`.
- Validate the resulting object against a Zod schema defined in the CLI source:
  - Required fields: `name` (string), `port` (number), `env` (object of string values).
  - Additional fields may be allowed or stripped based on schema design.
- On successful validation:
  - Print "Configuration is valid." to standard output.
  - Exit the process with code 0.
- On validation failure:
  - Print each Zod error message to standard error.
  - Exit the process with code 1.
- On file read or YAML parse failure:
  - Print a descriptive error message to standard error.
  - Exit the process with code 1.

## Implementation Details
- In `sandbox/source/main.js`, extend the `minimist` options to include:
  ```js
  string: ["run", "validate-config"],
  ```
- After existing command branches, add:
  ```js
  else if (validateConfig) {
    const configPath = path.resolve(process.cwd(), validateConfig);
    try {
      const raw = fs.readFileSync(configPath, "utf8");
      const parsed = yaml.load(raw);
      const schema = z.object({
        name: z.string(),
        port: z.number(),
        env: z.record(z.string())
      });
      const result = schema.safeParse(parsed);
      if (result.success) {
        console.log("Configuration is valid.");
        process.exit(0);
      } else {
        result.error.errors.forEach(err => console.error(err.message));
        process.exit(1);
      }
    } catch (err) {
      console.error(`Error validating config: ${err.message}`);
      process.exit(1);
    }
  }
  ```
- Import `js-yaml` as `yaml` and `z` from `zod` at the top of the file.

## Tests
- Create `sandbox/tests/validate-config.test.js` with scenarios:
  - **Valid Configuration**: Mock `fs.readFileSync` to return valid YAML. Invoke `main(["--validate-config", "config.yaml"])` and assert `console.log` is called with "Configuration is valid." and `process.exit(0)` is invoked.
  - **Validation Errors**: Mock file to return YAML missing required fields or type mismatches. Assert `console.error` is called with specific Zod error messages and `process.exit(1)` is invoked.
  - **YAML Parse Failure**: Mock `yaml.load` to throw. Assert `console.error` with parse error and `process.exit(1)`.
  - **File Read Failure**: Mock `fs.readFileSync` to throw. Assert `console.error` with file error and `process.exit(1)`.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md`:
  - Add a section for the `--validate-config` flag:
    ```bash
    npm run start -- --validate-config path/to/config.yaml
    ```
  - Show expected outputs for valid and invalid cases.
sandbox/features/HELP_COMMAND.md
# sandbox/features/HELP_COMMAND.md
# Help Command

## Overview
The CLI will support a `--help` flag that displays detailed usage instructions, available flags, and examples. This enhances user experience by providing built-in guidance without referring to external documentation.

## Behavior
- When invoked with `--help`, the CLI prints:
  - A short description of the tool based on the repository mission.
  - A list of supported flags (`--help`, `--mission`, `--version`) with explanations.
  - Usage examples for common workflows.
- After displaying help text, the process exits with code 0.
- The help text is printed to standard output.

## Implementation Details
- Modify `sandbox/source/main.js` to detect the `--help` flag before other flags and output the help message.
- Ensure ordering: `--help` takes precedence over other flags. If both `--help` and other flags are present, only help is shown.

## Tests
- Add a feature-level test in `sandbox/tests/help.test.js` covering:
  - Invoking main with `--help` prints expected help content and exits with code 0.
  - No side effects when `--help` is provided.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include help usage section.
- Examples:
  - `npm run start -- --help` prints usage instructions.

## Compatibility
- Follows existing CLI structure.
- No new dependencies required.
sandbox/features/MISSION_COMMAND.md
# sandbox/features/MISSION_COMMAND.md
# Mission Command

## Overview
Add a `--mission` flag to the CLI that reads and prints the repository mission statement from `MISSION.md`. This enables users to view the project mission directly in their terminal without opening the file.

## Behavior

- Detect a `mission` boolean option in CLI arguments after handling `--help` and before other flags.
- Resolve the path to `MISSION.md` in the repository root.
- Read the file contents with UTF-8 encoding.
- If file read succeeds:
  - Print the full content of `MISSION.md` to standard output.
  - Exit the process with code 0.
- If file read fails (file not found or read error):
  - Print a descriptive error message to standard error in the form:
    Error reading mission file: <error message>
  - Exit the process with code 1.

## Implementation Details

- In `sandbox/source/main.js`, extend minimist options to include `mission` as a boolean flag.
- Add an `else if (mission)` branch immediately after the `--version` branch and before any flags that depend on project content.
  - Use `path.resolve(process.cwd(), 'MISSION.md')` to locate the mission file.
  - Call `fs.readFileSync(missionPath, 'utf8')` to load content.
  - Wrap the read in a `try/catch` block:
    - On success: `console.log(content)` and `process.exit(0)`.
    - On failure: `console.error('Error reading mission file: ' + err.message)` and `process.exit(1)`.

## Tests

- Create `sandbox/tests/mission.test.js` with scenarios:
  - **Valid Mission File**: Mock `fs.readFileSync` to return a sample markdown string. Invoke `main(['--mission'])` and assert `console.log` is called with that string and `process.exit(0)` is invoked.
  - **Read Failure**: Mock `fs.readFileSync` to throw an error. Invoke `main(['--mission'])` and assert `console.error` is called with `Error reading mission file: <message>` and `process.exit(1)` is invoked.

- Use Vitest spies to mock `fs.readFileSync`, `console.log`, `console.error`, and `process.exit`.

## Documentation

- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md`:
  - Add a section for `--mission`:
    ```
    npm run start -- --mission
    ```
  - Show example output of the mission statement and error case if file is missing.

## Compatibility

- No new dependencies are required; uses built-in `fs` and `path` modules.
- Aligns with existing CLI structure in `sandbox/source/main.js`.
- Follows Vitest test setup and sandbox file layout.sandbox/features/INFO_COMMAND.md
# sandbox/features/INFO_COMMAND.md
# Info Command

## Overview
Provide a unified summary of the repository state with a new `--info` flag. When invoked, the CLI gathers key project metadata, mission text, environment variables, and configuration, then prints a formatted JSON object for easy inspection.

## Behavior

- Detect the `--info` flag in the CLI arguments after handling `--help`, `--version`, and `--mission`.
- Read `package.json` at the repository root and parse the following fields: `name`, `version`, `scripts`, `dependencies`, `devDependencies`, and `license`.
- Read `MISSION.md` at the repository root to extract the full mission statement text.
- Load environment variables from a `.env` file at the project root using `dotenv.config()`. Capture the parsed key/value pairs in an `env` object.
- Combine all extracted data into an object with the following shape:
  {
    name,
    version,
    mission,
    env,
    scripts,
    dependencies,
    devDependencies,
    license
  }
- Print the JSON representation of this object to standard output with two-space indentation.
- Exit the process with code 0 on success.
- If any operation (file reading, parsing, or env loading) fails, print an error message to standard error and exit with code 1.

## Implementation Details

- In `sandbox/source/main.js`, import `dotenv` alongside `fs`, `path`, and `minimist`.
- Extend the flag parsing to include an `info` boolean option.
- After existing branches for help, version, and mission, add an `else if (info)` branch:
  - Use `fs.readFileSync` with `utf8` to load `package.json` and `MISSION.md`.
  - Use `JSON.parse` to extract package fields.
  - Call `dotenv.config()` and capture `result.parsed` as `env`.
  - Construct the combined object and call `console.log(JSON.stringify(object, null, 2))`.
  - Wrap the entire sequence in a `try/catch` to handle errors gracefully.

## Tests

- Create `sandbox/tests/info.test.js` with tests that:
  - Mock `fs.readFileSync` to return valid JSON and markdown for `package.json` and `MISSION.md`.
  - Mock `dotenv.config` to return an object with a `parsed` property containing known env values.
  - Invoke `main(["--info"])` and assert that `console.log` is called with the expected formatted JSON and `process.exit(0)` is called.
  - Mock a failure scenario by having `fs.readFileSync` throw or `JSON.parse` fail, then assert that `console.error` is called with a descriptive message and `process.exit(1)` is called.

## Documentation

- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md`:
  - Add a section for `--info`, including a usage example:
    npm run start -- --info
  - Show sample JSON output demonstrating all keys.

## Compatibility

- Reuses existing dependencies: `fs`, `path`, `minimist`, and the already-installed `dotenv`.
- Aligns with existing CLI structure in `sandbox/source/main.js`.
sandbox/features/VERSION_COMMAND.md
# sandbox/features/VERSION_COMMAND.md
# Version Command

## Overview
When invoked with the `--version` flag, the CLI prints the package version from `package.json` and exits with code 0. This enables users to quickly identify the installed tool version.

## Behavior
- Detect the `--version` flag in the CLI arguments.
- Read `package.json` at the repository root.
- Parse the `version` field from its JSON content.
- Print the version string to standard output.
- Exit the process with code 0 on success.
- If reading or parsing fails, print an error message to standard error and exit with code 1.

## Implementation Details
- In `sandbox/source/main.js`, after handling `--help`, check for `--version`.
- Use `fs.readFileSync` with `utf8` encoding to load `package.json`.
- Use `JSON.parse` to parse the JSON content and extract the `version` property.
- Wrap file operations and parsing in a `try/catch` block to catch and handle errors.
- On success, call `console.log` with the version string and `process.exit(0)`.
- On failure, call `console.error` with a descriptive message and `process.exit(1)`.

## Tests
- Create `sandbox/tests/version.test.js` with tests that:
  - Mock `fs.readFileSync` to return valid JSON containing a known version, invoke `main` with `["--version"]`, and assert that `console.log` is called with that version and `process.exit(0)`.
  - Mock `fs.readFileSync` to throw an error or return invalid JSON, invoke `main` with `["--version"]`, and assert that `console.error` is called with an appropriate message and `process.exit(1)`.

## Documentation
- Update `sandbox/docs/USAGE.md` and `sandbox/docs/README.md` to include a section for the `--version` flag.
- Provide a usage example:
  - `npm run start -- --version`
  - Show example output of a version string.

## Compatibility
- Follows existing CLI structure in `sandbox/source/main.js`.
- No new dependencies are required.
sandbox/features/AUDIT_COMMAND.md
# sandbox/features/AUDIT_COMMAND.md
# Audit Command

## Overview
Add an --audit flag to the CLI that runs npm audit and reports security vulnerabilities, enabling users to quickly identify and address dependency issues.

## Behavior
- Detect an audit boolean option in CLI arguments.
- Invoke npm audit --json in the repository root using a child process.
- If the command returns valid JSON with a vulnerabilities object:
  - Parse the JSON containing vulnerability details.
  - If vulnerabilities are present, print a formatted JSON object with two-space indentation and exit with code 0.
  - If no vulnerabilities found, print 'No vulnerabilities found.' to standard output and exit with code 0.
- On spawn failure or invalid JSON parse, print a descriptive error message to standard error and exit with code 1.

## Implementation Details
- In sandbox/source/main.js, extend minimist options to include audit mapped to audit boolean.
- After the outdated branch, add an else if (audit) branch that:
  - Imports child_process and calls spawnSync('npm', ['audit', '--json'], { encoding: 'utf8' }).
  - Checks result.error or non-zero result.status to detect execution errors.
  - Parses result.stdout when available:
    - If parse succeeds and parsed.vulnerabilities has keys, console.log(JSON.stringify(parsed, null, 2)).
    - If parsed.vulnerabilities is empty or stdout empty, console.log('No vulnerabilities found.').
  - Wrap spawn and parse in a try catch to handle exceptions and call process.exit with the appropriate code.

## Tests
- Create sandbox/tests/audit.test.js with scenarios:
  - With Vulnerabilities: Mock child_process.spawnSync to return a stdout string of JSON containing vulnerabilities and status 0. Invoke main(['--audit']) and assert console.log is called with formatted JSON and process.exit(0).
  - No Vulnerabilities: Mock spawnSync to return parsed.vulnerabilities empty or empty stdout and status 0. Assert console.log is called with 'No vulnerabilities found.' and process.exit(0).
  - Spawn Failure: Mock spawnSync to throw an error or return an error property. Assert console.error with error message and process.exit(1).
  - Invalid JSON: Mock spawnSync to return invalid JSON in stdout. Assert console.error and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for the --audit flag:
  - Show usage example:
    npm run start -- --audit
  - Describe example outputs for both vulnerability report and no vulnerabilities case.

## Compatibility
- No new dependencies required; uses built-in child_process module.
- Follows existing CLI structure in sandbox/source/main.js.
- Aligns with Vitest testing setup and sandboxed source and test paths.