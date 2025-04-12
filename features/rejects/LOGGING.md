# Overview
This feature consolidates file-based logging, log rotation, configurable log levels, and automated log cleanup into a unified logging module. In this update, we are enhancing the existing functionality with structured JSON logging output to better integrate with external logging systems and automated monitoring tools.

# Implementation Details
- **File Logging & Rotation:**
  - Activate logging via a CLI flag (e.g. `--log-file <filename>`) to write timestamped log entries in a human-readable format.
  - Implement log rotation so that when a specified file size threshold is reached (configurable via an environment variable), the current log file is archived (renamed with a timestamp or incremental index) and a new log file is started.
  - Support activation via an additional CLI flag (e.g. `--enable-log-rotation`) or through environment configuration.

- **Configurable Log Levels:**
  - Provide a `--log-level <level>` flag where `<level>` can be one of DEBUG, INFO, WARN, or ERROR. Ensure that log output respects the configured level for both console and file outputs.

- **Structured JSON Logging:**
  - Introduce a new CLI flag (e.g. `--json-logs`) that, when enabled, outputs log entries in a structured JSON format. This format will include keys such as timestamp, level, message, and an optional context object.
  - Allow simultaneous support for both plain text and JSON output modes to accommodate various use scenarios (development vs. automated monitoring).

- **Automated Log Cleanup Integration:**
  - Merge log cleanup responsibilities into the unified logging module. Introduce a CLI flag (e.g. `--cleanup-logs`) that triggers a routine to scan the designated log directory for rotated log files.
  - The cleanup process will apply configurable criteria based on maximum file age (e.g. older than 7 days) or a maximum number of log files to retain, with settings provided via environment variables (e.g. `LOG_CLEANUP_MAX_AGE`, `LOG_CLEANUP_MAX_FILES`).

- **Error Handling & Fallback:**
  - Encapsulate all logging functionality in a dedicated module (e.g. `src/lib/logging.js`) so that any file operation errors or issues with JSON formatting do not interrupt the primary CLI workflow. Fallback to console logging if file-based operations fail.

# Testing
- **Unit Tests:**
  - Write tests to confirm that log entries are correctly formatted in both plain text and JSON modes. Simulate scenarios where file rotation should occur, verifying that old log files are archived according to the size threshold.
  - Test the cleanup routine to ensure it deletes expired log files based on age or number limits.
  - Validate that the `--json-logs` flag correctly toggles structured output and that the logs include all intended meta-data (timestamp, level, message, context).

# Documentation
- **Usage Examples:**
  ```bash
  # Activate file logging with rotation and JSON structured logs
  node src/lib/main.js --log-file app.log --enable-log-rotation --log-level INFO --json-logs

  # Run the application and trigger log cleanup
  node src/lib/main.js --cleanup-logs
  ```
- Update the README and CONTRIBUTING files to include usage instructions for all logging-related CLI flags (`--log-file`, `--enable-log-rotation`, `--log-level`, `--json-logs`, and `--cleanup-logs`) along with examples and troubleshooting tips.

# Benefits
- **Unified Logging Management:** Combines logging, rotation, cleanup, and structured JSON output into one maintainable module, reducing redundancy.
- **Enhanced Diagnostics:** Provides clear logging output with automatic cleanup and enables integration with external logging aggregators and monitoring systems.
- **User Flexibility:** Offers configurable options that allow users to tailor logging behavior to their project’s needs, ensuring both human-readable and machine-consumable outputs.
