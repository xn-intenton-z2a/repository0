# REPO_INFO

## Overview
This feature consolidates repository diagnostics and performance metrics into a single, unified module. By merging the functionalities previously provided by the DIAGNOSTICS and METRICS features, REPO_INFO offers a comprehensive view of repository health. It aggregates Git information, repository metadata, system diagnostics, and key performance metrics into a single command, supporting both human-readable and JSON-formatted outputs. This aligns with the repository's mission of promoting healthy collaboration and efficient CI/CD workflows by providing actionable insights in one place.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a unified flag (e.g. `--repo-info`) to replace the separate `--diagnostics` and `--metrics` flags.
  - Support an optional `--json` flag to output all information in structured JSON format.

- **Data Collection:**
  - **Git Information:** Execute Git commands (e.g. `git rev-parse`, `git log`) to retrieve current branch, latest commit hash, and summary data.
  - **Repository Metadata:** Read and parse `package.json` for key fields such as name, version, and description.
  - **System Diagnostics:** Gather runtime details such as Node.js version, operating system info, and memory usage.
  - **Performance Metrics:** Compute commit counts, test coverage summaries, and build performance (if available) from previous workflow logs.

- **Output Formatting:**
  - In standard mode, display a well-structured report segmented into diagnostics and metrics sections.
  - When the `--json` flag is provided, output a single JSON object containing all gathered data.

- **Modularity:**
  - Encapsulate all functionality within a single module (e.g. `src/lib/repoInfo.js`) to maintain simplicity and ease maintenance.
  - Ensure robust error handling in cases of missing or malformed data sources.

## Testing
- **Unit Tests:**
  - Write tests to simulate various repository states and verify that the aggregated output includes all expected sections.
  - Validate both plain text and JSON formatted outputs.
- **Edge Cases:**
  - Ensure graceful handling of missing configuration files or Git repository issues with clear error messages.

## Documentation
- Update the README and CONTRIBUTING files to include detailed usage instructions with examples:
  ```bash
  # Display repository diagnostics and metrics in plain text
  node src/lib/main.js --repo-info

  # Retrieve comprehensive repository info in JSON format
  node src/lib/main.js --repo-info --json
  ```
- Document the data sources and output structure to assist users in interpreting the results.

## Benefits
- **Unified Insights:** Provides a single command that aggregates crucial diagnostic and performance information.
- **Simplified Maintenance:** Reduces redundancy by merging overlapping functionalities from DIAGNOSTICS and METRICS.
- **Enhanced Automation:** Structured JSON output facilitates integration with CI/CD tools, enabling automated monitoring and troubleshooting.