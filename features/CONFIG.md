# CONFIG Feature

This feature introduces a dedicated configuration command (`--config`) that provides users with an overview of the CLI tool's current settings. It reports essential details such as the tool version, list of disallowed tokens for numeric parsing, and other configuration parameters. This helps users inspect and verify the operational settings of the CLI for better transparency and easier debugging.

## Overview

- **Purpose:** Expose detailed configuration information of the CLI tool. The command outputs key metadata and configurable options used by the tool, such as the current version and invalid tokens configuration.
- **Scope:** This feature handles the `--config` flag in the CLI. It supports both plain text and JSON output modes, ensuring that the output can be easily integrated into automated workflows and diagnostics.

## Implementation Details

- **Command Integration:**
  - Integrate the `--config` command within the main command mapping in `src/lib/main.js`.
  - When triggered, it collects configuration details, including the tool version and the `INVALID_TOKENS` environment variable value (defaulting to 'nan' if not specified).
  - The output is formatted either as plain text or as a structured JSON object if global JSON flags (`--json` or `--json-pretty`) are provided. In JSON mode, metadata such as timestamp, execution duration, and input echo are included.

- **Error Handling & Validation:**
  - Ensure that the command reliably retrieves configuration details without errors.
  - Validate the environment variable parsing and fallback defaults.

## Testing & Documentation

- **Unit Tests:**
  - Add tests in `tests/unit/main.test.js` to verify that the `--config` command outputs expected configuration details in both plain text and JSON formats.
  - Confirm that metadata fields like timestamp, version, and executionDuration are correctly populated in JSON output.

- **Documentation:**
  - Update the README and CLI usage instructions to include examples and usage details for the new configuration command.
  - Inline code comments should explain the purpose and behavior of the new command.

## Alignment with Repository Mission

This feature supports the repository's mission of enhancing transparency and promoting healthy collaboration. By providing a clear overview of the CLI's settings, it enables users and maintainers to diagnose issues quickly, verify configurations, and integrate the tool seamlessly into automated workflows.