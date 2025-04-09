# PERFORMANCE_LOG

## Overview
This feature introduces persistent performance logging to the CLI application. By enabling the `--log-performance` flag, the application will capture key performance metrics such as execution time and memory usage, and append these details to a log file in JSON format. This allows users and CI/CD systems to track performance trends over time and diagnose regressions or resource usage issues in an automated fashion.

## Implementation Details
- **CLI Integration:** Update the argument parser in `src/lib/main.js` to detect the new `--log-performance` flag. When this flag is provided, the application will capture the start and end timestamps as well as initial and final memory usage.
- **Metric Collection:** Utilize Node.js process APIs such as `process.hrtime()` for high-resolution timing and `process.memoryUsage()` to obtain memory statistics. Compute deltas for execution time and memory footprint.
- **Logging Mechanism:** Implement a lightweight logging module (e.g., in a new file `src/lib/performanceLog.js`) that writes the collected metrics as a JSON object to a log file (e.g., `performance.log`). The log entries should be appended with a timestamp for easy chronological analysis.
- **Optional Reporting:** In addition to file logging, consider outputting the performance summary to the console if the `--log-performance` flag is enabled, to provide immediate feedback.

## Testing
- **Unit Tests:** Add tests (e.g., in `tests/unit/performanceLog.test.js`) to simulate the CLI invocation with `--log-performance` and verify that a valid JSON log entry is appended to the performance log file.
- **Edge Cases:** Test the behavior when the log file is not writable or when file access issues occur. Ensure that failure to log performance metrics does not interrupt the main execution of the application.

## Documentation
- **Usage Examples:** Update the README and CONTRIBUTING guides with examples such as:
  ```bash
  node src/lib/main.js --log-performance
  ```
- **Configuration Guidance:** Document any configurable aspects, such as the log file path and any environment variables that might override default settings.
- **Integration:** Ensure that the feature description integrates seamlessly with the overall mission of the repository to provide actionable diagnostics and promote reliable automated workflows.
