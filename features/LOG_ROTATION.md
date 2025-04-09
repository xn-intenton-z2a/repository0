# LOG_ROTATION

## Overview
This feature introduces log rotation capabilities to the existing file logging system. By adding log rotation, the CLI application ensures that log files are managed effectively, preventing indefinite file growth and ensuring that log files remain manageable and archival for long-term diagnostics and audit trails. This aligns with the repository's mission by enhancing observability and automated diagnostics in a reproducible way, especially in CI/CD environments.

## Implementation Details
- **Integration with File Logging:** Extend the current FILE_LOGGING mechanism to include an optional log rotation mode. When enabled (e.g. via a new CLI flag `--enable-log-rotation` or an environment variable), the logger will monitor the size of the log file.
- **Rotation Logic:** Implement a module (e.g. `src/lib/logRotation.js`) to handle log rotation. The module will check if the log file exceeds a defined size threshold (e.g. configurable via environment variable or a default size limit) and perform the following actions:
  - Close the current log file.
  - Rename the log file with a timestamp or incremental index.
  - Start a new log file for subsequent log entries.
- **CLI Flag and Configuration:** Add optional support in the CLI parser (possibly in `src/lib/argParser.js`) to detect a `--enable-log-rotation` flag. Alternatively, allow users to control log rotation settings via environment configuration.
- **Error Handling:** Ensure that log rotation failures (for example, inability to rename or write to the file) fallback gracefully to continue logging without interrupting the primary application flow.

## Testing
- **Unit Tests:** Create tests (e.g. in `tests/unit/logRotation.test.js`) to simulate log file growth and verify that rotation is triggered at the specified threshold.
- **Edge Cases:** Test behavior when the log file path is unwritable or when multiple rotations are required over the application's lifetime, ensuring consistent behavior.

## Documentation
- **README and CONTRIBUTING Updates:** Document the usage of the `--enable-log-rotation` flag and any configuration options for log rotation. Provide examples of how to configure the size threshold and how rotated files are named.
- **Usage Examples:** Provide command-line examples such as:
  ```bash
  node src/lib/main.js --log-file logs/output.log --enable-log-rotation
  ```

This feature provides actionable value by ensuring that long-running processes or CI/CD runs do not suffer from unwieldy log files, making diagnostics more efficient and logs easier to manage over time.
