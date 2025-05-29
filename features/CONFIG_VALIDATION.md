# CONFIG_VALIDATION

# Description
Introduce schema validation for configuration files loaded by the CLI. Ensure configuration data conforms to expected shapes and types before proceeding, preventing runtime errors and misconfigurations.

# Configuration Schema
1. Define a Zod schema for expected configuration fields:
   - inputPath: string (required, non-empty)
   - outputPath: string (optional, default to project root)
   - timeout: number (optional, default to 30000)
   - enableFeatureX: boolean (optional, default to false)

# Implementation
- In src/lib/main.js:
  - Import Zod and fs, path, and js-yaml.
  - Export function `refreshConfiguration()` that:
    1. Reads `config.json` or `config.yml` from the project root.
    2. Parses the raw object using JSON.parse or yaml.load.
    3. Validates raw object against defined Zod schema.
    4. Throws a ZodError on validation failure with descriptive messages.
    5. Returns the validated and typed configuration object with defaults applied.
  - In `main(args)`, detect the `--refresh` flag, call `refreshConfiguration()`, then `console.log(JSON.stringify(config, null, 2))` and exit with code 0.

# Testing
- In tests/unit/main.test.js:
  - Add unit tests for `refreshConfiguration()`:
    * Valid config JSON: mock fs.existsSync and fs.readFileSync to return minimal valid JSON. Assert returned object matches expected shape.
    * Valid config YAML: mock yaml.load and file reads. Assert returned object with defaults and provided values.
    * Missing required field: mock raw config missing inputPath. Assert calling function throws a ZodError mentioning inputPath.
    * Wrong type: raw config with timeout as string. Assert throws ZodError mentioning timeout.
  - Integration tests for `main(["--refresh"])`: spy on process.exit, console.log, console.error to verify success and error flows.

# Documentation
- Update README.md under **Configuration Validation**:
  - Describe required and optional config fields and defaults.
  - Provide inline example of valid JSON and YAML configs.
  - Show sample validation error output.
