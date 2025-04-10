# GIT_INFO

## Overview
This feature adds the ability to retrieve and display Git repository information directly from the CLI. By invoking a new CLI flag (`--git-info`), users can view current Git branch, commit hash, and the latest commit message. This provides immediate insight into the repository's version control status, assisting with debugging, auditing, and integration with CI/CD workflows.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a new CLI flag (`--git-info`) in the main execution flow (e.g. in `src/lib/main.js`).
  - When the flag is detected, invoke the Git information module to gather commit details.

- **Data Retrieval:**
  - Use Node.js's built-in `child_process` module to execute Git commands:
    - `git rev-parse --abbrev-ref HEAD` for the current branch name.
    - `git rev-parse HEAD` for the current commit hash.
    - `git log -1 --pretty=%B` for the latest commit message.
  - Ensure that the commands are executed safely and capture any errors (e.g. if Git is not installed or the directory is not a Git repository).

- **Output Formatting:**
  - Format the gathered information in both plain text and JSON formats. Users can view a concise summary as well as detailed metadata when needed.
  - Optionally, integrate with the existing diagnostics tools (such as those in SYSTEM_METRICS) to include Git info in broader status reports.

- **Modularity and Maintainability:**
  - Implement the Git information logic in a dedicated module (e.g. `src/lib/gitInfo.js`) to keep it self-contained and easily maintainable.
  - Ensure that the module is lightweight and does not impact the performance of other CLI operations if the flag is not active.

## Testing
- **Unit Tests:**
  - Develop tests (e.g. in `tests/unit/gitInfo.test.js`) that simulate environments with valid Git repositories and handle error scenarios gracefully.
  - Verify that the correct branch, commit hash, and commit message are retrieved under different conditions.

- **Edge Cases:**
  - Test the module in environments where Git is not available or the directory is not a Git repository, ensuring that meaningful error messages are provided without crashing the CLI.

## Documentation
- **README Update:**
  - Update the README and CONTRIBUTING files to include instructions on using the `--git-info` flag.
  - Provide usage examples such as:
    ```bash
    # Display Git repository information
    node src/lib/main.js --git-info
    ```

- **User Guidelines:**
  - Document potential error scenarios (e.g., missing Git installation) and how users can resolve them.

## Benefits
- **Enhanced Diagnostics:** Provides immediate insight into the repository’s Git status, supporting debugging and version control audits.
- **CI/CD Integration:** Facilitates automated workflows by making Git metadata easily accessible, complementing existing diagnostic commands.
- **Simplicity and Modularity:** Implemented as a single, maintainable module that seamlessly integrates with the CLI's overall functionality.
