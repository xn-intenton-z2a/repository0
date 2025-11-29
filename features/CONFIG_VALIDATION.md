# CONFIG_VALIDATION

# Description
Introduce schema validation for configuration files loaded by the CLI to ensure correctness and prevent runtime errors. Users supplying invalid or malformed settings will receive clear feedback and default values will be applied for optional fields.

# Configuration Schema
Define a Zod schema for configuration fields:
1. inputPath: string (required, non-empty)
2. outputPath: string (optional, default to project root)
3. timeout: number (optional, default to 30000)
4. enableFeatureX: boolean (optional, default to false)

# Implementation
- In src/lib/main.js:
  1. Import Zod and JS-YAML.
  2. Export a function `refreshConfiguration()` that:
     - Locates `config.json` or `config.yml` in project root.
     - Parses the raw object with JSON.parse or yaml.load.
     - Validates the object against the Zod schema, applying defaults.
     - Throws a ZodError on validation failure with descriptive messages.
     - Returns the validated and typed configuration object.
  3. In `main(args)`, detect `--refresh`, call `refreshConfiguration()`, `console.log(JSON.stringify(config, null, 2))`, and exit with code 0 on success or non-zero on validation failure.

# Testing
- In tests/unit/main.test.js:
  * Unit tests for `refreshConfiguration()`:
    - Valid JSON config: mock fs.existsSync and fs.readFileSync to return minimal valid JSON. Assert defaults.
    - Valid YAML config: mock yaml.load and file reads. Assert provided and default values.
    - Missing required field: raw config without `inputPath`. Assert ZodError mentioning `inputPath`.
    - Wrong type: raw config with `timeout` as string. Assert ZodError mentioning `timeout`.
  * Integration tests for `main(['--refresh'])`: spy on console.log/error and process.exit to verify success and failure flows.

# Documentation
- Update README.md under **Configuration Validation**:
  - Describe required and optional config fields and defaults.
  - Provide inline examples of valid JSON and YAML configs.
  - Show sample validation error output (human-readable ZodError).