# DIAGNOSTICS

## Overview
The DIAGNOSTICS feature adds a dedicated system health and configuration check module to the CLI tool. This feature goes beyond a simple "All systems operational" message by performing an in-depth review of the current environment, configuration settings, performance metrics, and token parsing diagnostics. It leverages the existing metadata functionality (such as timestamp, tool version, and execution duration) and provides detailed feedback in both plain text and JSON output modes. This improvement enables users and developers to verify configuration consistency and overall system health in a self-contained CLI module.

## CLI Integration
- **Command Flag:** A new flag `--diagnostics` is used to invoke the diagnostics module.
- **Output Modes:** The module supports both plain text output and global JSON mode. In JSON mode (using `--json` or `--json-pretty`), diagnostics are returned as structured data with metadata, including configuration checks, performance stats, and environmental variables.
- **Usage Examples:**
  - Basic: `node src/lib/main.js --diagnostics`
  - JSON: `node src/lib/main.js --json --diagnostics`

## Implementation Details
- **Health Checks:** Perform checks for key configuration settings such as ALLOW_NAN, TOKEN_PUNCTUATION_CONFIG, and other environment variables. Validate that the token parsing cache is operational and that global settings adhere to expected defaults.
- **Performance Metrics:** Leverage the existing execution duration measurement to provide insights into recent command execution performance and responsiveness of the CLI tool.
- **Diagnostic Data:** Integrate detailed diagnostics from commands like `--diagnose-nan` to include token trim indices, warning indexes, and correction suggestions, allowing for comprehensive troubleshooting.
- **Error Handling:** Provide clear error messages if any configuration inconsistencies or performance anomalies are detected. All errors are reported uniformly across both plain text and JSON outputs.

## Testing & Documentation
- **Unit Tests:** Develop tests to validate that the diagnostics module accurately reports configuration, environment, and performance metrics. Include tests that simulate configuration errors and verify the correctness of the diagnostic output.
- **Documentation:** Update the README and related user guides with examples and troubleshooting advice. Inline comments in the source code will document the diagnostic checks and performance aggregation logic.

## Alignment with Repository Mission
By offering a detailed diagnostic capability within a single, self-contained module, DIAGNOSTICS helps users and developers quickly identify configuration issues and ensure that the CLI tool is operating optimally. This feature supports the repository’s mission of promoting healthy collaboration and streamlined automation through a robust, modular approach to system checks.