# LOG_LEVEL

## Overview
This feature introduces configurable logging levels for the CLI application. It allows users to control the verbosity of console output and file logging. By specifying a desired log level (such as DEBUG, INFO, WARN, or ERROR) via a new command-line flag, users can filter log messages to see only the information relevant to their current needs. This aligns with the repository’s mission of enhanced diagnostics and actionable CI/CD insights without overcomplicating the implementation.

## Implementation Details
- **Flag Detection:** Update the CLI argument parser in `src/lib/main.js` to detect a new flag `--log-level` that accepts a value (e.g., `node src/lib/main.js --log-level debug`).
- **Logging Levels:** Define logging levels (DEBUG, INFO, WARN, ERROR) within a small helper module (e.g., `src/lib/logLevel.js`). This module will filter messages based on the current level set.
- **Integration with File Logging:** If the `--log-file` flag is also provided, ensure that the log level filter applies to both console output and file logging, keeping consistency across outputs.
- **Modularity:** Implement the log level functionality as a self-contained module, ensuring it requires minimal changes to existing code, while complementing the FILE_LOGGING and ENHANCED_DIAGNOSTICS features.

## Testing
- **Unit Tests:** Create tests (e.g., in `tests/unit/logLevel.test.js`) to verify that the log level flag correctly filters messages.
- **Edge Cases:** Include tests for invalid log level values and ensure that a default level (INFO) is set when no valid level is provided.

## Documentation
- **README and CONTRIBUTING Updates:** Document the usage of the `--log-level` flag with examples like:
  ```bash
  node src/lib/main.js --log-level debug
  ```
- **Usage Examples:** Provide examples in the documentation outlining how different log levels affect the output, both on the console and in log files.
- **Workflow Integration:** Reference the mission statements and CI/CD insights, demonstrating how configurable logging enhances observability and troubleshooting in automated workflows.
