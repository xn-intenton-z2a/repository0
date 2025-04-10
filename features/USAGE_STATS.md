# USAGE_STATS

## Overview
This feature introduces a lightweight usage statistics module that tracks and aggregates CLI command usage across the repository. By collecting data from command executions (leveraging the existing command history and aliasing functionalities), users and CI/CD systems can gain actionable insights into how often commands are run, which features are most utilized, and potential bottlenecks in the user experience.

## Implementation Details
- **Data Collection:**
  - Integrate with the existing COMMAND_UTILS module to capture each executed command along with its arguments and timestamps.
  - Store the aggregated usage data in a dedicated JSON file (e.g., `usageStats.json`) at the repository root.
  
- **CLI Flag Integration:**
  - Introduce a new CLI flag (e.g., `--usage-stats`) that outputs the current aggregated statistics in either plain text or JSON format. 
  - Include options to reset or archive statistics with appropriate CLI flags.

- **Modularity and Maintenance:**
  - The implementation is encapsulated in a single module (e.g., `src/lib/usageStats.js`) to ensure maintainability and separation of concerns.
  - Ensure that the feature operates independently without interfering with the primary CLI functionalities.

## Testing
- **Unit Tests:**
  - Create tests to simulate command executions and verify that usage data is aggregated correctly.
  - Test edge scenarios such as no command executions and rapid successive invocations to ensure data integrity.

- **Documentation & Integration:**
  - Update the README and CONTRIBUTING files to include instructions on how to use the usage statistics feature, reset statistics, and interpret the output.
  - Provide usage examples:
  ```bash
  # Display aggregated usage statistics
  node src/lib/main.js --usage-stats

  # Reset usage statistics
  node src/lib/main.js --usage-stats --reset
  ```

## Benefits
- **Enhanced Diagnostics:** Provides insights into feature usage that can inform further optimizations and feature enhancements.
- **Informed Decision-Making:** Enables maintainers to understand which parts of the CLI are most valuable, supporting data-driven development.
- **User Engagement:** Offers transparency into command usage, potentially identifying areas where user support or documentation improvements are required.