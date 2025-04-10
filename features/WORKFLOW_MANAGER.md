# WORKFLOW_MANAGER

## Overview
This feature consolidates the management of GitHub workflows into a single module. It merges the functionality of listing and monitoring workflows by combining aspects of both the WORKFLOW_STATUS and WORKFLOWS features. The unified tool will allow users to view detailed metadata about workflow files, as well as the real-time status of workflow runs via the GitHub API. This aligns with the repository's mission of showcasing robust CI/CD practices and providing actionable diagnostics for healthy collaboration.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a new flag (e.g. `--workflow-manager`) to activate workflow management.
  - Support an optional `--json` flag to output all information in a structured JSON format.

- **Workflow Discovery and Status Monitoring:**
  - **Discovery:** Scan the `.github/workflows` directory to list all workflow files, extract basic metadata such as filename, description (if present in comments), and last modification timestamp.
  - **Status Monitoring:** Leverage GitHub’s API using a token from an environment variable (e.g. `GITHUB_TOKEN`) to fetch and display the latest statuses of workflow runs, including status indicators (success, failure, in-progress), timestamps, and run URLs.
  - Combine both pieces of information into a coherent report, either in a human-readable format or as JSON.

- **Modularity & Error Handling:**
  - Encapsulate the merged functionality in a single module (e.g. `src/lib/workflowManager.js`) to simplify maintenance and extension.
  - Implement robust error handling for scenarios such as missing workflows, API failures (e.g., due to missing or invalid tokens), and unavailable directories.
  - Ensure the command gracefully informs the user if no workflows are found or if API requests fail.

## Testing
- **Unit Tests:**
  - Create tests to simulate different states of the `.github/workflows` directory, ensuring that workflow file discovery returns expected metadata.
  - Test API integration by mocking GitHub responses to verify correct aggregation of workflow statuses.
  - Validate the output format in both plain text and JSON modes.

- **Edge Cases:**
  - Handle missing or inaccessible workflow directories, invalid or missing authentication tokens, and unexpected responses from the GitHub API.
  - Ensure the feature does not interfere with other CLI operations.

## Documentation
- Update the README and CONTRIBUTING files to document the new `--workflow-manager` flag with usage examples:
  ```bash
  # Display combined workflow information in plain text
  node src/lib/main.js --workflow-manager

  # Display combined workflow information in JSON format
  node src/lib/main.js --workflow-manager --json
  ```
- Include a section that describes how workflows are discovered and how their statuses are monitored via the GitHub API.

## Benefits
- **Unified Insights:** Provides a single command to both list workflow configurations and monitor their current run statuses.
- **Streamlined Workflow Management:** Reduces redundancy by merging overlapping functionalities, simplifying both user experience and code maintenance.
- **Actionable Diagnostics:** Combines static workflow metadata with dynamic status updates to enable faster diagnostics and troubleshooting in CI/CD environments.