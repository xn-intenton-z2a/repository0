# CONFIG_VALIDATION

# Description
Introduce schema validation for configuration files loaded by the CLI to ensure correctness and prevent runtime errors. Users supplying invalid or malformed settings will receive clear feedback and default values will be applied for optional fields.

# Schema Definition
Define a Zod schema for configuration fields:
1. inputPath: string (required, non-empty)  
2. outputPath: string (optional, defaults to current working directory)  
3. timeout: number (optional, defaults to 30000)  
4. enableFeatureX: boolean (optional, defaults to false)

# Implementation
In src/lib/main.js:
- Import zod and fs, path, and js-yaml.  
- Export function `refreshConfiguration()` that:
  1. Locates config.json or config.yml in project root.  
  2. Reads and parses raw object using JSON.parse or yaml.load.  
  3. Validates raw object against configSchema, applying defaults.  
  4. Returns the validated config object or throws a ZodError on failure.
- Modify `main()` to detect `--refresh` flag, call `refreshConfiguration()`, print the JSON stringified config with indentation, and exit with code 0. On validation errors, print the error to stderr and exit with non-zero code.

# Testing
In tests/unit/main.test.js:
- Unit tests for `refreshConfiguration()`:  
  • Valid JSON config: mock fs and assert returned object includes defaults.  
  • Valid YAML config: mock js-yaml and assert return with correct values.  
  • Missing inputPath: assert function throws a ZodError mentioning 'inputPath'.  
  • Invalid timeout type: assert ZodError mentions 'timeout'.
- Integration tests for CLI:  
  • `main(['--refresh'])` stub `refreshConfiguration()` to succeed and error, spy on console.log/error and process.exit, assert behavior and exit codes.

# Documentation
In docs/CONFIG_VALIDATION.md and update README:
- Document configuration fields, defaults, and sample JSON/YAML examples.  
- Show CLI usage: `npm run refresh` to load and validate config.  
- Provide example error output for validation failures.