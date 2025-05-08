# Summary

Update the repository default issue-to-code conversion rate from 0.5 to a higher baseline and expose a CLI option to override this value at runtime. Ensure the new rate is documented in the README and covered by unit tests.

# Implementation

1. Update package.json to set config.issueToCodeConversionRate to 0.75.
2. Enhance src/lib/main.js to:
   - Read the conversion rate from package.json config.
   - Accept an optional --issue-to-code-rate CLI argument (numeric between 0 and 1) that overrides the default.
   - Log the effective conversion rate on startup.

# README Updates

- Document the new default conversion rate in the Configuration section.
- Show example of running the CLI with and without the --issue-to-code-rate flag:

  ```bash
  npm run start -- --issue-to-code-rate 0.85
  ```

# Testing Deliverables

1. Add unit tests in tests/unit/main.test.js to verify:
   - Default behavior uses rate 0.75.
   - CLI override sets the conversion rate to the provided value.
   - Invalid values (outside [0,1] or non-numeric) cause the tool to exit with an error.
2. Ensure all tests pass with new behavior.
