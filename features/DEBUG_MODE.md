# DEBUG_MODE

## Overview
This feature introduces a debug mode to the CLI tool that provides detailed internal execution logs. When enabled, the CLI outputs extended diagnostic information, including raw input arguments, intermediate parsing results, environment configuration values, computed warnings, and execution metadata. This mode facilitates development, troubleshooting, and aids contributors in understanding the internal processing pipeline, thereby aligning with the repository’s mission of promoting healthy collaboration and effective automation.

## CLI Integration
- **Global Flag:** The debug mode is enabled using a new global flag `--debug` that can be supplied alongside any other command.
- **Additional Logs:** Upon activation, the CLI prints extra logs which include:
  - The original raw input arguments and cleansed input echo.
  - Detailed output from the numeric parsing function (e.g., lists of valid and invalid tokens).
  - Environment configuration values relevant to processing (like `ALLOW_NAN`, `INVALID_TOKENS`, and `TOKEN_PUNCTUATION_CONFIG`).
  - Intermediate computation steps and timing details beyond the standard execution duration.
- **Behavior:** Debug output merges with existing success or error messages, ensuring that users receive both the primary command result and the extended diagnostics when `--debug` is active.

## Implementation Details
- **Logging Enhancements:** Modify the main CLI execution logic to check for the presence of the `--debug` flag. If present, additional debug statements will be printed to the console.
- **Modular Debug Function:** A helper function will be added to collate and output structured debug information. This function should not affect the normal operation of commands when the flag is absent.
- **Configuration Awareness:** Ensure that the debug mode reflects current environment settings and internal state (such as regex cache status) without exposing sensitive information.
- **Optional JSON Integration:** When combined with global JSON output mode (`--json` / `--json-pretty`), the debug information is merged into the resultant JSON structure under an optional `debugInfo` field.

## Testing & Documentation
- **Unit Tests:** Add tests to simulate command execution with and without the `--debug` flag. Verify that debug output is present when expected and that it contains key diagnostic information.
- **Documentation:** Update CLI usage instructions in README and CONTRIBUTING files to include examples of using the debug flag. Provide sample output and explain the additional fields.

## Alignment with Repository Mission
By providing granular insight into the command processing pipeline, DEBUG_MODE enhances transparency and troubleshooting capabilities. This contribution supports the repository’s goals by facilitating healthful collaboration among developers and users, and by streamlining the debugging and development process in this modular, self-contained CLI tool.