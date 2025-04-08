# USAGE_STATS Feature

## Overview
This feature consolidates the functionality of the existing METRICS and COMMAND_HISTORY features into a unified module. It tracks usage metrics such as command frequency, execution duration, and error counts, while also maintaining a detailed command history with capabilities to search, filter, and export history logs. This consolidation reduces redundancy and streamlines diagnostics, aligning with the repository's mission of promoting healthy collaboration and automation through modular utilities.

## Implementation Details
- **Command Integration:**
  - Introduce a new CLI flag (e.g., `--usage-stats`) that activates both metrics tracking and command history functionalities.
  - Aggregate data from every CLI command execution, recording metrics (e.g., execution time, command counts, error occurrences) and storing the command history in a structured JSON log file.

- **Metrics Recording and Aggregation:**
  - Enhance global helper functions (`sendSuccess` and `sendError`) to increment usage counters and record timing information for all commands.
  - Log detailed metadata including timestamp, execution duration, and input parameters for each command.

- **Command History Management:**
  - Maintain a unified command log that supports additional subcommands or options:
    - `--search-history <keyword>`: Filter the command history based on a keyword.
    - `--export-history`: Export the entire command history to a JSON file for further analysis.
  - Ensure that if no history is available, the user is informed appropriately.

- **Error Handling & Validation:**
  - Provide consistent error messages for invalid inputs, and ensure that file I/O issues (when reading/writing history data) are handled gracefully.
  - Integrate clear warnings within the unified module so that users understand both usage statistics and history-related data.

## Testing & Documentation
- **Unit Tests:**
  - Extend existing tests to cover both metrics aggregation and history management functionalities.
  - Verify that search and export operations return correctly formatted data, and check that aggregated metrics reflect accurate command usage.

- **Documentation:**
  - Update the README and CLI usage docs with examples:
    - `node src/lib/main.js --usage-stats` to view aggregated metrics and history summaries.
    - `node src/lib/main.js --usage-stats --search-history greet` to filter the command history.
    - `node src/lib/main.js --usage-stats --export-history` to export history in JSON format.
  - Inline code comments should document changes to the unified metrics/history logging system.

## Alignment with Repository Mission
By merging METRICS and COMMAND_HISTORY, the USAGE_STATS feature simplifies the CLI’s diagnostic tools, providing a single point for operational insights and historical tracking. This enhancement promotes efficient troubleshooting and fosters healthy collaboration by ensuring that detailed usage data is readily accessible.