# SYSTEM_METRICS

## Overview
This feature consolidates system diagnostics and performance logging into a single, unified module. It merges the responsibilities of the SYSTEM_INFO and PERFORMANCE_LOG features to provide comprehensive insight into the application’s runtime environment. By exposing detailed metrics such as Node.js version, OS details, dependency summary, execution time, and memory usage, the feature supports actionable diagnostics and efficient CI/CD workflows. Additionally, it offers persistent logging of performance metrics when enabled, ensuring that trends and regressions can be tracked over time.

## Implementation Details
- **Unified Metric Collection:**
  - Integrate data collection from both previously separate modules. Gather system information (e.g. Node.js version, operating system details, key dependency versions) and performance metrics (e.g. execution time using process.hrtime() and memory usage via process.memoryUsage()).
  - Format output in both human-readable and JSON modes. The JSON output will include metadata like timestamps for automated processing.
- **CLI Flag Integration:**
  - Enhance the CLI parser in `src/lib/main.js` to detect the `--diagnostics` flag. When active, the feature aggregates system information and performance metrics in a single response.
  - Introduce an optional `--log-performance` flag that triggers persistent logging of performance data. When enabled, performance metrics are appended as JSON entries to a dedicated log file (e.g., `performance.log`).
- **Modularity and Reusability:**
  - Implement the unified functionality in a dedicated module (e.g. `src/lib/systemMetrics.js`). This module will be responsible for both on-demand diagnostics and performance logging without interfering with other CLI functions.
- **Error Handling:**
  - Ensure that any failures in metric retrieval or log file access do not interrupt the primary CLI execution. Fallback to console-based output in case of file write issues.

## Testing
- **Unit Tests:**
  - Update existing tests or create new ones (e.g. in `tests/unit/systemMetrics.test.js`) to simulate CLI invocations with `--diagnostics` and `--log-performance` flags. Verify that all expected metrics are included in the output and that log entries are correctly appended.
- **Edge Cases:**
  - Validate behavior when the log file is not writable or when some system information cannot be retrieved. The module should fail gracefully and provide clear error messages.

## Documentation
- Update the README and CONTRIBUTING guides to describe the unified system diagnostics and performance logging functionality.
- Provide usage examples, such as:
  ```bash
  # Display system metrics and performance data
  node src/lib/main.js --diagnostics
  
  # Log performance metrics over time
  node src/lib/main.js --diagnostics --log-performance
  ```
- Document configuration and any environment variables influencing log file paths or output formats.

This feature streamlines prior diagnostics and logging responsibilities, enhancing overall maintainability and aligning with the repository’s mission of promoting robust, actionable CI/CD workflows.