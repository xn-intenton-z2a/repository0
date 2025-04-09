# METRICS

## Overview
The METRICS feature provides aggregated analytics and usage statistics for the CLI tool. It collects data on command frequency, execution duration, and error rates from existing metadata (such as those logged in HISTORY). This summary allows users and developers to assess tool performance, identify frequently used commands, and spot performance bottlenecks.

## CLI Integration
- **Command Flag:** Introduce `--metrics` as a new global flag.
- **Usage Examples:**
  - Basic: `node src/lib/main.js --metrics`
  - JSON Mode: `node src/lib/main.js --json --metrics`

## Implementation Details
- **Data Collection:** Leverage existing metadata already recorded by other commands (e.g., timestamp, executionDuration, command) and/or persist data in a simple log file (or in memory).
- **Aggregation Logic:** Process records to compute:
  - Total number of commands executed
  - Per-command usage counts
  - Average, minimum, and maximum execution durations
  - Success and error ratios
- **Reporting:** Generate a summary report that can be displayed in plain text or JSON. In JSON mode, include detailed metrics along with metadata fields.
- **Error Handling:** Provide a clear message if no historical data is available, and ensure robustness when data is partially missing.

## Testing & Documentation
- **Unit Tests:** Develop tests to simulate histories of command executions and verify that aggregated metrics (counts, averages, min/max values) are computed correctly.
- **Documentation:** Update README and CLI usage guides with examples on how to use the METRICS command and interpret its output. Inline code comments will document the aggregation algorithm and error handling.

## Alignment with Repository Mission
By offering visibility into the performance and frequency of CLI commands, the METRICS feature promotes healthy collaboration and proactive performance tuning. This self-contained module aligns with the repository's mission to provide modular, automated tools that aid streamlined automation and informed tool usage.
