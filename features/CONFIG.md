# CONFIG with SYSTEM_INFO

## Overview
This update enhances the existing CONFIG feature by not only reporting the CLI tool’s current settings (such as TOOL_VERSION, INVALID_TOKENS, and DYNAMIC_WARNING_INDEX) but also by including detailed system information. In addition to configuration settings, this updated feature retrieves and displays host environment details such as the operating system type, Node.js version, process ID, system uptime, and memory usage. This enriched output provides greater transparency and diagnostic insight, aligning with our mission of promoting healthy collaboration and streamlined automation.

## Implementation Details
- **Command Integration:**
  - Update the `--config` flag handling in `src/lib/main.js` to gather additional system information.
  - Leverage Node’s built-in `process` and `os` modules to obtain details:
    - **OS Type:** Using `os.type()` and `os.platform()`.
    - **Node Version:** Using `process.version`.
    - **Process ID:** Using `process.pid`.
    - **Uptime:** Using `process.uptime()`.
    - **Memory Usage:** Using `process.memoryUsage()` (e.g. heapUsed, heapTotal).
  - Structure the output so that when in plain text mode, the configuration and system information are clearly separated, and when in JSON mode, both configuration and system details are included as structured fields.

- **Error Handling & Validation:**
  - Ensure that the retrieval of system information does not introduce new failure modes; if any component (e.g., memory usage) fails, default to a safe message.
  - Validate the environment variables and fallback defaults remain consistent with previous behavior.

- **Testing & Documentation:**
  - Extend unit tests (in tests/unit/main.test.js) to check that the `--config` command now outputs additional system information fields both in plain text and JSON modes.
  - Update the README and CLI usage documentation to include examples of the extended configuration output, highlighting the new system details.
  - Add inline comments in `src/lib/main.js` to document the new retrieval calls (e.g., `os.type()`, `process.uptime()`).

## Alignment with Repository Mission
By enriching the CONFIG feature with comprehensive system information, this update furthers the repository’s mission of transparency and healthy collaboration. Users can now quickly assess not only the tool’s configuration but also the environment in which it is running, facilitating smoother integration into automated workflows and enhanced troubleshooting.
