# Configuration

The repository should support a new configuration option `issueToCodeConversionRate` that controls the proportion of issues automatically converted into code changes by the workflows.

## Default Value

The default conversion rate should be set to 0.5 (50 percent). Users may override this value via an environment variable or the config field in package json.

# Implementation

1. Add a new configuration entry `issueToCodeConversionRate` in package.json under a `config` field.
2. In src/lib/main js update to read the configuration value
   - Load environment variables using dotenv
   - Validate the value with zod to ensure a number between 0 and 1
3. Pass the conversion rate into the workflow invocation logic in main

# CLI Usage

The script npm run start should accept an optional flag `--conversion-rate` when invoking main

If provided this flag overrides the environment or config file value

# Tests

- Update tests/unit/main.test js to include tests for the default conversion rate and custom rate via CLI argument
- Add a feature level test in sandbox/tests to simulate the workflow output given different rates

# Documentation

Update README md to document the new configuration option with examples
- Show config field in package json example
- Show environment variable usage ISSUE_TO_CODE_CONVERSION_RATE
- Show CLI flag example
