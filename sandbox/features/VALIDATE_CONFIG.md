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
