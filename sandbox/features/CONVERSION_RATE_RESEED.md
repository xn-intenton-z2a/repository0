# Overview

This feature updates the default issue-to-code conversion rate and allows users to override it via CLI or environment variable.

# Behavior

The application will now use a new default conversion rate of 0.75 instead of 0.5. Users can override this rate by supplying the `--rate` flag or setting the `ISSUE_TO_CODE_CONVERSION_RATE` environment variable. If both are provided, the CLI flag takes precedence.

# Implementation Details

- Update the `config.issueToCodeConversionRate` value in `package.json` to 0.75.
- Modify `src/lib/main.js` to read `--rate` from CLI arguments (using minimist) and fallback to `process.env.ISSUE_TO_CODE_CONVERSION_RATE` or the default config value.
- Ensure that the parsed rate is validated as a number between 0 and 1; if invalid, the program will exit with an error message.

# CLI Usage

- To use the default rate: `npm run start`
- To override via CLI: `npm run start -- --rate 0.9`
- To override via environment: `ISSUE_TO_CODE_CONVERSION_RATE=0.85 npm run start`

# Tests

- Add unit tests in `tests/unit/main.test.js` to verify:
  - Default behavior uses 0.75 when no overrides are provided.
  - CLI override correctly applies the provided rate.
  - Environment variable override correctly applies the provided rate.
  - Invalid values cause the program to exit with a descriptive error.

# Documentation

- Update `README.md` to document the new default rate and override options.
- Include examples of both CLI and environment variable overrides in the Usage section.