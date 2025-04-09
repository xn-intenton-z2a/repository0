# CONFIG

## Overview
This feature provides runtime configuration management for the CLI tool. It enables users to view and modify key settings such as invalid token handling, punctuation stripping, and the special treatment of 'NaN' inputs. The feature is designed as a self-contained module within the repository that integrates seamlessly with the existing command framework.

## CLI Integration
- **Commands:**
  - `--config`: Outputs the current configuration, including the tool version, environment variables (e.g., INVALID_TOKENS, DYNAMIC_WARNING_INDEX, TOKEN_PUNCTUATION_CONFIG, DISABLE_NAN_SUGGESTION, ALLOW_NAN), and other runtime options. 
  - `--toggle-allow-nan`: Dynamically toggles the ALLOW_NAN setting to control whether inputs resembling 'NaN' are accepted or explicitly rejected.
- **Output Modes:**
  - Standard text mode for human-readable output.
  - JSON mode (activated via `--json` or `--json-pretty`) that includes additional metadata such as timestamp, execution duration, and input echo.

## Implementation Details
- **Configuration Retrieval:**
  - Reads environment variables including `INVALID_TOKENS`, `DYNAMIC_WARNING_INDEX`, `TOKEN_PUNCTUATION_CONFIG`, `DISABLE_NAN_SUGGESTION`, and `ALLOW_NAN` to generate a comprehensive configuration report.
  - Uses caching of regex patterns for configurable punctuation stripping.
- **Dynamic Toggling:**
  - The `--toggle-allow-nan` command flips the state of the `ALLOW_NAN` setting at runtime, immediately affecting numeric parsing and error reporting.
  - Toggling is logged and the new state is reflected in subsequent operations.
- **Error Handling & Validation:**
  - Clear messaging is provided if configuration details are missing or environment variables are misconfigured.
  - The feature ensures that updates to configuration do not disrupt the core command processing.

## Testing & Documentation
- **Unit Tests:**
  - Tests cover both the plain text and JSON output modes for the configuration report.
  - Validation tests ensure that toggling ALLOW_NAN updates numeric parsing behavior as expected.
- **Documentation:**
  - The README is updated to include usage instructions for `--config` and `--toggle-allow-nan`.
  - Inline comments in the source file explain the configuration retrieval and dynamic toggling logic.

## Alignment with Repository Mission
This CONFIG feature reinforces the repository's focus on streamlined automation and healthy collaboration by enabling users to inspect and modify crucial runtime settings easily. It encapsulates configuration management in a self-contained CLI module that complements the modular design of the tool.