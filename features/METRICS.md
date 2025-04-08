# METRICS

## Overview
This feature introduces a new CLI command (`--metrics`) that captures and reports usage metrics for commands executed by the CLI tool. The goal is to provide insights into command frequency, execution durations, and error or warning occurrences, aiding in diagnosis and performance tuning. This aligns with the repository’s mission by promoting transparency and data-driven improvements.

## Implementation Details
- **Command Integration:**
  - Introduce a new flag `--metrics` in the CLI command mapping.
  - When invoked, this command reads from a metrics log file (e.g., `metrics.json`) and displays aggregated statistics (command counts, total execution duration, and error counts).
  - If the log is unavailable or empty, output a clear message indicating that no metrics have been recorded yet.

- **Metric Recording:**
  - Enhance helper functions (`sendSuccess` and `sendError`) to increment usage counters and accumulate execution durations for each command.
  - Optionally record error and warning occurrences for each command invocation.
  - Store metrics in a single JSON file (`metrics.json`) kept in the project root. Initialize the file if it does not exist.

- **Error Handling & Validation:**
  - Ensure that issues with metric logging (such as file I/O errors) are handled gracefully, with warnings logged to the console but without impacting the command’s primary function.

## Testing & Documentation
- **Unit Tests:**
  - Create tests simulating multiple CLI invocations to verify that metrics are properly updated and aggregated.
  - Test the output of the `--metrics` command to confirm that it returns correct usage summaries.

- **Documentation:**
  - Update the README and CLI usage docs to include explanations and examples of how to use the new `--metrics` command.
  - Include inline code comments in `src/lib/main.js` where modifications for metric logging are made.

## Alignment with Repository Mission
This enhancement provides actionable operational insights that help maintain transparency regarding tool usage and performance. By offering a clear view of command metrics, it empowers contributors to identify improvement opportunities and fosters a collaborative, data-driven development process.