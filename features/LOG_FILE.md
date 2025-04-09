# LOG_FILE

## Overview
This feature introduces persistent logging for all CLI command executions. By leveraging Node.js file system APIs, the CLI tool can log command usage along with metadata (timestamp, command name, input parameters, execution duration, and results) into a local file (e.g., `cli.log`). This functionality supports auditing, debugging, and historical analysis of CLI operations, aligning with the repository’s mission of fostering healthy collaboration and streamlined automation.

## CLI Integration
- **New Flag:** Introduce a new global flag `--log-file` that, when specified, enables persistent logging. Optionally, a file path can be provided (defaulting to `cli.log` if omitted).
- **Configuration:** The logging behavior can be toggled on or off via configuration settings (enhanced in the existing CONFIG feature) and works in both plain text and JSON output modes.
- **Output Inclusion:** In JSON mode, metadata such as `timestamp`, `version`, `executionDuration`, and `inputEcho` are already produced; this feature will additionally append the log entry to the file.

## Implementation Details
- **Logging Logic:**
  - On each command execution, if the `--log-file` flag is active, the CLI writes a log entry into the specified file. Each entry includes the command name, cleaned input parameters, final result or error message, warnings (if any), and execution metadata.
  - Use Node’s built-in `fs` module to append the log in an asynchronous manner.
  - The log file contents are maintained in plain text format or optionally JSON lines (one JSON object per line) for easier automated parsing.

- **Error Handling:**
  - If the specified log file path is not writable or any file system error occurs, the tool should output a warning message without interrupting the command’s core functionality.
  - Log entries must be appended safely even under concurrent CLI invocations.

## Testing & Documentation
- **Unit Tests:**
  - Simulate CLI command executions with the `--log-file` flag enabled and verify that a log entry is appended to the default (or provided) file path.
  - Test failure scenarios where the file cannot be written to ensure the warning is properly issued without affecting command output.

- **Documentation:**
  - Update the README and CLI usage documentation to include examples such as:
    - `node src/lib/main.js --log-file --sum 3 4 5`
    - `node src/lib/main.js --log-file=custom.log --multiply 2 3 4`
  - Add inline comments in `src/lib/main.js` documenting the logging integration and the file append logic.

## Alignment with Repository Mission
Adding a persistent logging feature encourages transparency and accountability in automated workflows and user interactions. By providing an audit trail of executed commands, this feature supports diagnosing issues and optimizing workflows, thereby furthering the repository’s mission to promote healthy collaboration and streamlined automation.