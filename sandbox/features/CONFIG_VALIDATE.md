# Config Validation Command

## Overview
Provide a `--validate-config` flag that loads and validates a YAML configuration file at the repository root. This ensures users can catch configuration issues early and maintain reliable automation workflows.

## Behavior

- Detect the `--validate-config` boolean flag in the CLI arguments after handling `--help`, `--version`, `--mission`, and `--info`.
- Resolve the path to `config.yaml` in the repository root.
- Read the file using utf8 encoding and parse its content as YAML using js-yaml.
- Define a Zod schema for expected configuration structure, for example:
  - `schedule` as string
  - `paths` as object with known keys and string values
  - Other fields as needed per agent config guidelines
- Validate the parsed object against the schema.
- On successful validation, print "Configuration is valid." to standard output and exit with code 0.
- On validation error, print detailed Zod error messages to standard error and exit with code 1.
- On file read or parse failure, print an error message to standard error and exit with code 1.

## Implementation Details

- In sandbox/source/main.js, import `js-yaml` and `zod` alongside existing imports.
- Extend minimist options to include `validateConfig` mapped to `validate-config` boolean.
- After existing branches, add an `else if (validateConfig)` branch:
  - Use `path.resolve` to locate `config.yaml` at process.cwd().
  - Use `fs.readFileSync` to load the file content.
  - Call `jsYaml.load` to parse the YAML.
  - Define a Zod schema matching the agent configuration structure.
  - Call `schema.safeParse` on the parsed object.
  - If parse success, console.log and process.exit(0).
  - If parse failure, console.error each issue message and process.exit(1).
  - Wrap file and parse operations in try catch to handle unexpected errors.

## Tests

- Create `sandbox/tests/config.test.js`.
- Test valid scenario:
  - Mock `fs.readFileSync` to return a small valid YAML string.
  - Invoke `main(["--validate-config"])` and assert console.log was called with "Configuration is valid." and process.exit(0).
- Test invalid schema scenario:
  - Mock `fs.readFileSync` to return YAML with missing required fields.
  - Invoke `main(["--validate-config"])` and assert console.error contains expected Zod errors and process.exit(1).
- Test file read failure:
  - Mock `fs.readFileSync` to throw an error.
  - Assert console.error and process.exit(1).

## Documentation

- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for `--validate-config`:
  - Usage example: npm run start -- --validate-config
  - Explain expected output on success and error scenarios.

## Compatibility

- Adds new dependencies on js-yaml and zod which are already declared in package.json.
- Follows existing CLI structure in sandbox/source/main.js.
- No changes outside sandbox source, tests, docs, or dependencies.
