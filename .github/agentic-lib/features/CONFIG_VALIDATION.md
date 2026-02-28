# CONFIG_VALIDATION

# Description
Introduce schema validation for configuration files loaded by the CLI to ensure correctness and prevent runtime errors. Users supplying invalid or malformed settings will receive clear feedback and default values will be applied for optional fields.

# Configuration Schema
Define a Zod schema for configuration fields:
1. inputPath: string (required, non-empty)
2. outputPath: string (optional, defaults to current working directory)
3. timeout: number (optional, defaults to 30000)
4. enableFeatureX: boolean (optional, defaults to false)

# Implementation
- In src/lib/main.js, export `refreshConfiguration()` that:
  1. Locates `config.json` or `config.yml` in the project root.
  2. Reads and parses raw data using `fs.readFileSync` and `JSON.parse` or `js-yaml`.
  3. Validates the parsed object against the Zod schema, applying defaults.
  4. Throws a ZodError on validation failure with descriptive messages.
  5. Returns the validated configuration object.
- Modify `main(args)` to detect the `--refresh` flag, call `refreshConfiguration()`, print the JSON stringified config with indentation, and exit with status code 0 on success or non-zero on error.

# Testing
- Add unit tests in `tests/unit/main.test.js`:
  * Valid JSON config: mock `fs.existsSync`, `fs.readFileSync` to return minimal valid JSON. Assert defaults are applied.
  * Valid YAML config: mock `js-yaml.load` and file read. Assert provided and default values.
  * Missing `inputPath`: mock raw config missing this field. Assert ZodError mentions `inputPath`.
  * Invalid `timeout` type: mock raw config with string for `timeout`. Assert ZodError mentions `timeout`.
- Integration tests for `main(['--refresh'])`: spy on `console.log`, `console.error`, and `process.exit` to verify behavior.

# Documentation
- Update README.md under **Configuration Validation**:
  * Describe required and optional fields and defaults.
  * Provide inline examples of valid JSON and YAML configs.
  * Show sample validation error output.
