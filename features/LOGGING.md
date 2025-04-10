# LOGGING

## Overview
This feature consolidates file-based logging, log rotation, configurable log levels, and automated log cleanup into a unified logging module. It provides a single interface to manage logging output, perform log rotation, and clean up old log files. This integration ensures that both active logging and passive maintenance are handled in one place, simplifying configuration and reducing disk clutter. This is in line with the repository's mission of providing robust and actionable diagnostics for healthy CI/CD workflows.

## Implementation Details
- **File Logging & Rotation:**
  - Activate logging via a CLI flag (e.g. `--log-file <filename>`) to write timestamped log entries in a human-readable format.
  - Implement log rotation so that when a specified file size threshold is reached (configurable via an environment variable), the current log file is archived (renamed with a timestamp or incremental index) and a new log file is started.
  - Support activation via an additional CLI flag (e.g. `--enable-log-rotation`) or through environment configuration.

- **Configurable Log Levels:**
  - Provide a `--log-level <level>` flag where `<level>` can be one of DEBUG, INFO, WARN, or ERROR. Ensure that log output respects the configured level for both console and file outputs.

- **Automated Log Cleanup Integration:**
  - Merge log cleanup responsibilities into the unified logging module. Introduce a CLI flag (e.g. `--cleanup-logs`) that triggers a routine to scan the designated log directory for rotated log files.
  - The cleanup process will apply configurable criteria based on maximum file age (e.g. older than 7 days) or a maximum number of log files to retain, with settings provided via environment variables (e.g. `LOG_CLEANUP_MAX_AGE`, `LOG_CLEANUP_MAX_FILES`).
  - The module should log a summary of the cleanup actions performed and handle any errors gracefully without interrupting the main CLI flow.

- **Integration & Modularity:**
  - Refactor the logging functionality into a dedicated module (e.g. `src/lib/logging.js`) that encapsulates file logging, rotation, level filtering, and cleanup.
  - Integrate with existing diagnostics by ensuring that any issues in logging do not affect other CLI operations. Fallback to console logging if file operations fail.

## Testing
- **Unit Tests:**
  - Develop tests to confirm that log entries are correctly written and formatted in both console and file outputs.
  - Simulate scenarios where the log file reaches the size limit to verify that rotation occurs as expected.
  - Create tests to simulate the presence of rotated log files and validate that the cleanup routine deletes files that exceed the configured retention policy.

- **Edge Cases:**
  - Test behavior for unwritable file paths, missing directories, and invalid log level inputs. Ensure that the system logs warnings if cleanup cannot be performed and safely degrades to console-only logging if necessary.

## Documentation
- **Usage Examples:**
  ```bash
  # Activate file logging with rotation
  node src/lib/main.js --log-file app.log --enable-log-rotation --log-level INFO

  # Run the application and trigger log cleanup
  node src/lib/main.js --cleanup-logs
  ```
- Update the README and CONTRIBUTING documentation to include usage instructions for all logging-related CLI flags (`--log-file`, `--enable-log-rotation`, `--log-level`, and `--cleanup-logs`) along with examples and troubleshooting tips.

## Benefits
- **Unified Logging Management:** Combines logging, rotation, and cleanup into one maintainable module, reducing redundancy.
- **Enhanced Diagnostics:** Provides clear logging output with automatic cleanup to prevent disk clutter, improving system reliability in CI/CD environments.
- **User Flexibility:** Offers configurable options that allow users to tailor logging behavior to their project’s needs.
