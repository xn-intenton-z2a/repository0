# NUMERIC_SAFE

## Overview
This feature centralizes and refines the handling of NaN (Not a Number) values across the repository. It introduces new CLI flags to control, diagnose, and configure runtime behavior related to NaN processing. The feature aims to ensure a consistent experience when invalid or unexpected numeric values are encountered, in line with the repository’s mission of promoting reliable, automated CI/CD workflows.

## Purpose
- **Consistent NaN Handling:** Centralize the management of NaN values to minimize inconsistencies in error handling and output.
- **Configurable Flags:** Introduce CLI flags such as `--toggle-allow-nan`, `--allow-nan-inline`, `--diagnose-nan`, and `--ignore-invalid` to adjust runtime behavior regarding NaN acceptance and diagnostics.
- **Enhanced Diagnostics:** Provide detailed diagnostic output when the `--diagnose-nan` flag is used, including information on why a NaN value was encountered and suggestions for resolution.
- **User Flexibility:** Allow users to enable or disable automatic NaN correction suggestions based on project needs.

## Implementation Details
- **CLI Integration:** Modify the CLI parser in `src/lib/main.js` to detect and handle the new flags:
  - `--toggle-allow-nan`: Toggles the global behavior for allowing NaN values.
  - `--allow-nan-inline`: Enables per-command acceptance of NaN values.
  - `--diagnose-nan`: Triggers extended diagnostic output focused on numeric anomalies.
  - `--ignore-invalid`: Skips processing of tokens flagged as invalid numeric inputs.
- **Modular Design:** Implement the NaN handling logic in a single source file module to maintain separation of concerns and ease of maintenance.
- **Testing:** Add unit tests (e.g., in `tests/unit/numericSafe.test.js`) to verify the correct behavior of each flag and their interactions, ensuring edge cases are covered.
- **Documentation:** Update the README and CONTRIBUTING files to include usage examples and guidelines for these new CLI options. Ensure the feature description is aligned with the repository’s mission of reliable automated diagnostics and CI/CD insights.

## Usage Examples
```bash
# Toggle global NaN acceptance
node src/lib/main.js --toggle-allow-nan

# Allow NaN inline for a specific command
node src/lib/main.js --allow-nan-inline 123 NaN 456

# Get detailed NaN diagnostic output
node src/lib/main.js --diagnose-nan

# Bypass invalid numeric tokens
node src/lib/main.js --ignore-invalid
```

## Integration with Existing Features
This feature complements the ENHANCED_DIAGNOSTICS functionality by providing targeted diagnostics and control for numeric issues. Both features cooperate to offer comprehensive insights and configuration options without overlapping responsibilities.