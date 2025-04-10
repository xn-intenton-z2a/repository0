# LOG_CLEANUP

## Overview
This feature introduces a log cleanup utility that automatically manages log file accumulation by deleting old or excess rotated log files. In repositories where logging with rotation is enabled (via the unified logging feature), leftover logs may consume unnecessary disk space. The LOG_CLEANUP feature supports efficient maintenance and ensures that the repository remains uncluttered, aligning with the mission of promoting robust and actionable diagnostics in CI/CD workflows.

## Implementation Details
- **CLI Integration:**
  - Introduce a new CLI flag (e.g. `--cleanup-logs`) in the main execution file (`src/lib/main.js`). When this flag is present, the application will invoke the log cleanup process before or after normal operations.
  
- **Module Creation:**
  - Develop a dedicated module (e.g. `src/lib/logCleanup.js`) that performs the following actions:
    - Scans the log directory (or current working directory) for rotated log files matching a specific naming pattern (e.g., files with a timestamp or incremental index).
    - Applies configurable criteria such as maximum file age (e.g. files older than 7 days) or a maximum number of log files to retain.
    - Deletes files that exceed the retention policy safely and logs a summary of the cleanup actions performed.
  
- **Configuration Options:**
  - Allow configuration via environment variables (loaded through the `CONFIG` module) such as `LOG_CLEANUP_MAX_AGE` and `LOG_CLEANUP_MAX_FILES` to customize the retention policy.
  - Provide sensible default values if no configuration is supplied.
  
- **Error Handling & Safety:**
  - Ensure that any errors during the file deletion process (e.g. permissions issues) are caught and reported without interrupting the main CLI flow.
  - Optionally log a warning if cleanup cannot be performed, so users are aware and can take manual action if necessary.

## Testing
- **Unit Tests:**
  - Create tests (e.g. in `tests/unit/logCleanup.test.js`) to simulate the presence of log files with various timestamps and verify that the cleanup process correctly identifies and deletes files according to the retention policy.
  
- **Edge Cases:**
  - Test scenarios where no log files exist, or where file access is restricted, ensuring that the application handles these scenarios gracefully without terminating unexpectedly.

## Documentation
- **README & CONTRIBUTING Updates:**
  - Document the usage of the `--cleanup-logs` flag, including configuration options and expected behavior in the relevant sections of README.md and CONTRIBUTING.md.
  
- **Usage Example:**
  ```bash
  # Run the application and trigger log cleanup
  node src/lib/main.js --cleanup-logs
  ```

This feature is designed to be self-contained within a single repository file and complements the unified logging system by ensuring log files are maintained in a clean and efficient manner.