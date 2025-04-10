# WORKFLOW_STATUS

## Overview
This feature integrates real-time monitoring of GitHub workflow runs directly into the CLI. By invoking a dedicated flag, users can obtain a clear, aggregated view of the recent statuses of their CI/CD workflows without leaving the terminal. This supports actionable insights to quickly identify and respond to problems in automated processes.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a new flag, for example `--workflow-status`, to trigger workflow status queries.
  - Optionally support a `--json` flag to output the information in structured JSON format.

- **GitHub API Integration:**
  - Retrieve a GitHub token from an environment variable (e.g. `GITHUB_TOKEN`) to authenticate API requests.
  - Use Node.js’s built-in HTTPS or fetch API to query the GitHub Actions API for recent workflow runs.
  - Extract key details including workflow name, status (success, failure, in-progress), timestamp, and run URL.

- **Output Formatting:**
  - In standard mode, display a human-readable summary listing each workflow and its recent run status.
  - In JSON mode, output detailed structured data, facilitating further automation or integration with dashboards.

- **Modularity and Maintainability:**
  - Encapsulate all functionality in a single module (e.g. `src/lib/workflowStatus.js`) to maintain simplicity and ease of testing.
  - Include robust error handling for scenarios such as missing authentication tokens or API failures, with clear error messages.

## Testing
- **Unit Tests:**
  - Simulate various GitHub API responses including successful status retrieval and error conditions (e.g., token missing, network issues).
  - Ensure both plain text and JSON outputs are correctly formatted.

## Documentation
- Documentation updates in the README and CONTRIBUTING files to include usage examples:
  ```bash
  # Display workflow statuses in plain text
  node src/lib/main.js --workflow-status
  
  # Display workflow statuses in JSON format
  node src/lib/main.js --workflow-status --json
  ```
- Provide guidelines on setting the `GITHUB_TOKEN` environment variable for authentication.

## Benefits
- **Enhanced CI/CD Oversight:** Offers real-time insights into workflow run statuses.
- **Rapid Diagnostics:** Helps developers quickly identify and respond to issues within their automated workflows.
- **Seamless Integration:** Complements existing workflow management features to provide a comprehensive CI/CD monitoring tool.
