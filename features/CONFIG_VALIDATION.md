# CONFIG_VALIDATION

# Description
Introduce schema validation for configuration files loaded by the CLI. Ensure configuration data conforms to expected shapes and types before proceeding with operations, preventing runtime errors and misconfigurations.

# Configuration Schema
1. Define a Zod schema for expected configuration fields, for example:
   - inputPath: string (required)
   - outputPath: string (optional, default to project root)
   - timeout: number (optional, default to 30000)
   - enableFeatureX: boolean (optional)

# Implementation
1. In src/lib/main.js, import Zod and define a `configSchema` object matching the expected config structure.
2. In the `refreshConfiguration()` function:
   - After reading and parsing config.json or config.yml, validate the raw object against `configSchema`.
   - If validation fails, throw an error with descriptive messages listing invalid fields.
   - Return the validated and typed configuration object.

# Testing
1. Extend tests in tests/unit/main.test.js:
   - Provide valid and invalid sample config objects to `refreshConfiguration()` by mocking file reads.
   - Assert that valid config returns correctly typed object with defaults applied.
   - Assert that invalid config causes a thrown ZodError containing expected error messages.

# Documentation
1. Update README.md under a **Configuration** section:
   - Describe required and optional config fields.
   - Provide inline examples of a valid config.json and one that triggers validation errors.
   - Show expected error output when schema validation fails.