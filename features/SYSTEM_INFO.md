# SYSTEM_INFO

## Overview
This feature consolidates system diagnostics and performance metrics into a single, unified interface. Instead of having separate diagnostics and performance outputs, SYSTEM_INFO provides comprehensive insights including Node.js version, package version, dependency summary, environment configuration, operating system details, execution time, and memory usage. This consolidation reduces maintenance overhead and improves the actionable feedback provided to both human users and automated systems.

## Implementation Details
- **Flag Integration:** Enhance the CLI parser in `src/lib/main.js` to detect the `--diagnostics` flag and route the request to the SYSTEM_INFO module.
- **Data Collection:** Combine previously separate modules for enhanced diagnostics and performance metrics:
  - Retrieve Node.js version, OS details, and key dependency versions.
  - Compute execution time by capturing timestamps at the start and end of the command execution.
  - Capture memory usage using Node.js process APIs (e.g. `process.memoryUsage()`).
- **Output Formatting:** Provide output in two modes:
  - **JSON Mode:** For automated systems and integration with CI/CD workflows, including metadata such as timestamps.
  - **Human Readable Mode:** Plain text output for quick diagnostics when required.
- **Modularity:** Implement this in a single source file module (or update `src/lib/main.js`) so that all system information is collected and formatted from one place without affecting other CLI functionalities.

## Testing
- **Unit Tests:** Update or add tests in `tests/unit` to verify that when the `--diagnostics` flag is supplied, the output includes complete system details along with performance metrics (execution time and memory usage).
- **Edge Cases:** Verify behavior when no arguments or unexpected arguments are provided, ensuring graceful degradation.

## Documentation
- Update the README and CONTRIBUTING guides to reflect the new unified system diagnostics and performance output under the `--diagnostics` flag.
- Provide usage examples for both JSON and plain text outputs.

This feature aligns with the repository's mission by offering a streamlined, yet comprehensive, insight into the system environment and performance, thereby supporting actionable CI/CD diagnostics and enhancing overall transparency.