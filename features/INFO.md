# INFO

## Overview
This feature consolidates the functionalities of retrieving Git information, repository metadata, and system diagnostics into one unified command. By replacing the separate GIT_INFO, REPO_INFO, and SYSTEM_METRICS features, the new INFO feature provides a single point of access for all key information about the repository and runtime environment. This unified approach also integrates a JSON output mode with rich metadata to support automated diagnostics and CI/CD workflows.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a new CLI flag (e.g. `--info`) in the main execution flow (in `src/lib/main.js`).
  - Detect an additional `--json` flag that, when provided together with `--info`, outputs all data in a structured JSON format with extra metadata (such as timestamp, command executed, and exit code).

- **Data Retrieval:**
  - **Git Data:** Execute Git commands (using Node.js's `child_process` module) to retrieve the current branch name, commit hash, and latest commit message.
  - **Repository Metadata:** Read and parse `package.json` to extract key fields like name, version, description, author, license, and repository URL.
  - **System Diagnostics:** Gather runtime information such as Node.js version, operating system details, memory usage, and execution time.

- **Output Formatting:**
  - In standard mode, display the aggregated information in clear, human-readable text.
  - When the `--json` flag is present, format the output as JSON that includes both the requested information and metadata (e.g., timestamp and command context) to aid automated tooling and CI/CD systems.

- **Modularity and Reusability:**
  - Implement all the information retrieval and formatting logic in a single, self-contained module (e.g. `src/lib/info.js`).
  - Ensure that the module can be easily maintained and extended in the future without affecting other parts of the CLI.

- **Testing:**
  - Add comprehensive unit tests to simulate different environments (e.g., valid Git repos, missing Git, incomplete `package.json`) and verify that the output is correct in both plain text and JSON modes.
  - Validate error scenarios to ensure robust behavior, including clear error messages if any data source is unavailable.

- **Documentation:**
  - Update the README and CONTRIBUTING files to include instructions for using the new `--info` flag and the JSON output mode.
  - Provide usage examples:
  ```bash
  # Retrieve detailed repository and system information in human-readable format
  node src/lib/main.js --info

  # Retrieve the same information in JSON format
  node src/lib/main.js --info --json
  ```

## Benefits
- **Unified Data Access:** Provides a single command for accessing a wide range of diagnostic and metadata information, reducing redundancy.
- **Improved Automation:** The JSON output mode with metadata facilitates integration with automated tools and CI/CD workflows.
- **Enhanced User Experience:** Consolidating several related features into one makes the CLI simpler and more intuitive to use.
