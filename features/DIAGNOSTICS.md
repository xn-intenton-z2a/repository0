# DIAGNOSTICS

## Overview
This feature consolidates and enhances repository diagnostics by merging the functionalities of the previous INFO and DEPENDENCY_REPORT features. It provides a unified command for retrieving comprehensive repository data, including Git information, repository metadata, system diagnostics, and dependency status. This integration simplifies maintenance by offering a single, robust diagnostic module that supports both human-readable output and structured JSON for automated CI/CD workflows.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a new flag `--diagnostics` which replaces the previous `--info` and `--dep-report` flags.
  - Support an optional `--json` flag to output all diagnostic data in a structured JSON format, facilitating automation and integration with CI/CD tools.

- **Data Retrieval:**
  - **Git Information:** Use Node.js's `child_process` module to execute Git commands (e.g., `git log`, `git rev-parse`) to collect details such as the current branch, latest commit hash, and commit message summary.
  - **Repository Metadata:** Read and parse `package.json` to extract essential fields including name, version, description, and repository URL.
  - **System Diagnostics:** Gather runtime data, such as Node.js version, operating system details, and memory usage.
  - **Dependency Status:** Scan `package.json` for current dependency versions and compare against the latest available versions (potentially leveraging libraries like `npm-check-updates`) to generate a dependency report.

- **Output Formatting:**
  - In default mode, display all gathered information in a clear and human-readable format.
  - When the `--json` flag is provided, output the data as a well-structured JSON object that includes all metadata and diagnostic details.

- **Modularity and Maintainability:**
  - Encapsulate all diagnostic functionality within a dedicated module (e.g., `src/lib/diagnostics.js`).
  - Ensure robust error handling and input validation, with fallback messages if data sources (such as Git or package files) are unavailable.

## Testing
- **Unit Tests:**
  - Develop tests to simulate various scenarios (e.g., valid Git repository, missing or malformed `package.json`, all dependencies up-to-date vs outdated).
  - Verify that both human-readable and JSON outputs match expected formats.

## Documentation
- Update the README and CONTRIBUTING files to reflect this new unified diagnostic command. Include examples such as:
  ```bash
  # Retrieve repository diagnostics in human-readable format
  node src/lib/main.js --diagnostics

  # Retrieve diagnostics in JSON format
  node src/lib/main.js --diagnostics --json
  ```

## Benefits
- **Unified Data Access:** Streamlines repository health checks by aggregating multiple diagnostic data points into a single command.
- **Enhanced Automation:** Facilitates integration with CI/CD systems via JSON output that can be parsed programmatically.
- **Ease of Maintenance:** Reduces redundancy by consolidating overlapping functionalities, ensuring all diagnostic information is centralized and consistently formatted.
