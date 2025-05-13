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
- Aligns with Vitest testing setup and sandboxed source and test paths.