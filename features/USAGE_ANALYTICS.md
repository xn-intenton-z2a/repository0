# USAGE_ANALYTICS

## Overview
This feature introduces a lightweight analytics module aimed at tracking and reporting the usage patterns of CLI commands in the repository. It logs every command execution and aggregates statistics over time. The analytics data, stored in a simple JSON file, enables developers and maintainers to understand which commands are most frequently used, thus guiding improvements and optimizations in the overall workflow.

## Implementation Details
- **Command Logging:**
  - Intercept CLI executions within the main entry point (`src/lib/main.js`) or via a dedicated wrapper in a single module (e.g. `src/lib/usageAnalytics.js`).
  - Capture the command invoked along with a timestamp and any relevant arguments.
  - Append this information to a persistent JSON file (e.g. `usage.json`) that acts as a simple database.

- **Analytics Reporting:**
  - Introduce a new CLI flag (e.g. `--usage-analytics`) that triggers the display of aggregated analytics data.
  - When invoked, the module reads the stored usage records, computes statistics (e.g., frequency count per command, most recent usage times), and outputs a summary in both human-readable and JSON formats.

- **Modularity:**
  - Ensure that the analytics logic is encapsulated in a single source file to maintain the repository's simplicity.
  - Implement minimal overhead so that analytics recording does not degrade the performance of the main flow.

## Testing
- **Unit Tests:**
  - Create tests to simulate various CLI commands and verify that each invocation is correctly logged in the `usage.json` file.
  - Test the reporting functionality using sample usage data to ensure the computed statistics are accurate.

- **Edge Cases:**
  - Ensure that the module gracefully handles cases where the `usage.json` file is missing, corrupted, or has permission issues, defaulting to in-memory analytics if needed.

## Documentation
- **User Documentation:**
  - Update the README and CONTRIBUTING files to include instructions on how to enable and view usage analytics through the new `--usage-analytics` flag.
  - Provide usage examples illustrating how analytics can be activated and interpreted.

- **Developer Guidelines:**
  - Document the structure of the `usage.json` file and guide contributors on how to extend analytics tracking if additional metrics are needed.

## Benefits
- **Actionable Insights:**
  - Offers maintainers clear visibility into which CLI commands are most utilized, guiding prioritization for future improvements.
  - Helps identify rarely used features which might be deprecated or require rethinking.

- **Enhanced User Experience:**
  - Empowers developers with data-driven insights to optimize and refine the CLI interface for more efficient workflows.

- **Single-File Simplicity:**
  - The feature is designed to be encapsulated in a single module, keeping the repository focused and easily maintainable.