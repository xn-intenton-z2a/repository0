# COMMAND_HISTORY Feature

This feature introduces a simple command history mechanism for the CLI tool. It enables logging of executed commands along with relevant metadata, and provides commands to view or clear the command history. This enhancement aligns with the repository's mission by enhancing diagnostics and traceability in automated workflows.

## Overview

- **Purpose:** Maintain a persistent log of CLI commands executed along with timestamps, command names, input parameters, and execution duration.
- **Scope:** The feature adds two new CLI flags:
  - `--history`: Reads and outputs the last N commands executed, with their metadata.
  - `--clear-history`: Clears the stored command history.
- **Data Storage:** The history is maintained in a single text file (e.g., `history.log`) in the repository root. The log can be stored in a simple JSON lines format for ease of reading, appending, and parsing.

## Implementation Details

- **Integration:**
  - Extend the `src/lib/main.js` file by adding support for the new flags. Use Node's file system library (`fs`) to handle read and write operations.
  - When any CLI command (excluding history commands) is executed, append a JSON object representing the command execution into `history.log`. This object includes fields like `timestamp`, `commandName`, `inputParameters`, and `executionDuration`.
  - When the `--history` flag is invoked, read `history.log`, parse its entries, and display them in a friendly output format. Optionally support a parameter to limit the number of entries (e.g., `--history 10`).
  - When the `--clear-history` flag is invoked, truncate or delete the `history.log` file after confirmation.

- **Error Handling & Validation:**
  - If the history file does not exist, initialize it without error.
  - Provide clear error messages if file operations fail.

## Testing & Documentation

- **Unit Tests:**
  - Add tests to verify that command executions are correctly appended to `history.log`.
  - Test retrieval of the history via the `--history` flag, including parsing correctness.
  - Test the clear functionality via the `--clear-history` flag to ensure the history file is properly reset.

- **Documentation:**
  - Update the README and CLI usage documentation to describe the new flags and provide usage examples:
    - Example: `node src/lib/main.js --history` to list command history.
    - Example: `node src/lib/main.js --clear-history` to clear the command log.
  - Include inline comments in the source to explain file operations and history management logic.

## Alignment with Repository Mission

This feature enhances the repository's focus on automation and diagnostics by providing a clear, persistent record of command usage. It supports collaborative debugging and auditing, thereby reinforcing the template's goal of promoting healthy collaboration and continuous improvement.