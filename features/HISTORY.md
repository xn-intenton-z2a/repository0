# HISTORY

## Overview
The HISTORY feature not only logs every executed command with rich metadata (timestamp, version, execution duration, input echo, etc.) and aggregates performance metrics, but now it is enhanced to include an export capability. This update enables users to export the complete command history in CSV format for further analysis, sharing, or archival purposes. This additional sub-command supports both human-readable and machine-consumable outputs.

## CLI Integration
- **Primary Commands:**
  - `--history`: Displays the full log of previously executed commands along with detailed metadata.
  - `--clear-history`: Clears the command history log.
  - **New Sub-command:** `--export-history`: Exports the history log to a CSV file. Users can optionally specify a filename and choose between standard output or file write. For example:
    - `node src/lib/main.js --export-history` (exports to default filename, e.g., `history_export.csv`)
    - `node src/lib/main.js --export-history my_history.csv` (exports to specified file)

## Implementation Details
- **Logging and Aggregation:**
  - Continues to log command executions with metadata in a persistent log file (e.g., `history.log`).
  - Aggregates performance metrics including total command count, average, minimum, and maximum execution durations, as well as success and error counts.

- **Export Functionality:**
  - The export module reads the existing log file and converts each entry into CSV format.
  - Columns in the CSV include: Command, Input Echo, Timestamp, Version, Execution Duration, and Result/Error.
  - The export operation can either output the CSV to stdout (when no filename is provided) or write directly to a file specified by the user.
  - Error handling is implemented to manage issues such as file access permissions and empty log states.

## Testing & Documentation
- **Unit Tests:**
  - New tests will verify that the export functionality correctly converts log entries to CSV format.
  - Tests cover edge cases such as an empty history log and file write errors.
- **Documentation:**
  - The README, CLI usage guides, and inline comments will be updated to include examples and instructions for using the new `--export-history` sub-command.

## Alignment with Repository Mission
By enabling history export, the updated HISTORY feature enhances traceability and facilitates deeper analysis of command execution patterns over time. This improvement supports the repository’s mission of promoting healthy collaboration and streamlined automation by providing a self-contained tool for monitoring, analyzing, and sharing execution data without adding unnecessary complexity.