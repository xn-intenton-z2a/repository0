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
