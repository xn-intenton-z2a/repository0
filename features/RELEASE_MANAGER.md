# RELEASE_MANAGER

## Overview
This feature consolidates version bumping, changelog generation, and dependency scanning into a single, unified release management tool. By merging the capabilities of VERSION_BUMPER, CHANGELOG, and the proposed dependency scanning functionality, the RELEASE_MANAGER streamlines the process of preparing a new release. This enhancement not only updates the version and generates a changelog from Git history but also scans and reports on outdated dependencies from package.json. This unified approach supports efficient CI/CD workflows and ensures that the repository remains up-to-date and healthy.

## Implementation Details
- **CLI Integration:**
  - Introduce a new CLI flag (e.g. `--release`) that accepts subcommands or arguments to specify the type of release operation.
  - Support options for version bump types (patch, minor, major) and output formats (markdown or JSON) for the changelog.
  - **Dependency Scanning Flag:** Add an additional flag (e.g. `--scan-deps`) that, when used, triggers a scan of package.json to identify outdated dependencies using the npm-check-updates library.

- **Version Bumping:**
  - Read the current version from package.json, then increment the patch, minor, or major component based on the provided argument.
  - Update package.json with the new version and optionally create a backup of the original file to allow rollback if needed.

- **Changelog Generation:**
  - Leverage Git command outputs (e.g. `git log`) to extract commit details such as commit hashes, authors, dates, and messages.
  - Produce a human-readable markdown changelog and/or a JSON formatted output when requested. The changelog should include a generation timestamp and be optionally saved as `CHANGELOG.md`.

- **Dependency Scanning Integration:**
  - When the `--scan-deps` flag is invoked, use the `npm-check-updates` package to compare the current dependency versions in package.json against the latest available versions.
  - Generate a report that lists outdated dependencies along with their current and recommended versions. This report can be displayed in plain text or JSON format.
  - Optionally, support an interactive prompt or an automated flag (e.g. `--auto-update-deps`) to update the dependencies directly if the user chooses to do so.

- **Combined Workflow:**
  - Allow users to perform version bumping, changelog generation, and dependency scanning in a single command, ensuring that the updated version is reflected in the generated changelog and dependency report.
  - Implement appropriate error handling and logging to ensure that a failure in one step does not prevent the execution of the others when possible.

## Testing
- **Unit Tests:**
  - Simulate various version bump scenarios to confirm that package.json is updated correctly.
  - Use mocks to simulate Git output and ensure that the changelog includes all required commit information.
  - Test the dependency scanning functionality by mocking npm-check-updates responses to verify that outdated dependencies are detected and reported accurately.
  - Validate combined operations to ensure that version bumping, changelog generation, and dependency scanning work together as expected.

- **Edge Cases:**
  - Handle scenarios where package.json is missing or malformed, and ensure that appropriate error messages are displayed.
  - Validate behavior when there are no outdated dependencies or when the scanning tool fails to retrieve updates.

## Documentation
- **README and CONTRIBUTING Updates:**
  - Update the documentation to include usage instructions for the new dependency scanning functionality within the RELEASE_MANAGER.
  - Provide examples such as:
    ```bash
    # Bump the patch version, generate a changelog, and scan for outdated dependencies
    node src/lib/main.js --release patch --scan-deps

    # Bump the minor version with JSON formatted output for the changelog and dependency report
    node src/lib/main.js --release minor --scan-deps --json
    ```
  - Document the semantic versioning rules applied and provide guidelines on commit message structure to maximize changelog clarity.

## Benefits
- **Streamlined Release Process:** Offers a single command to update the version, generate a comprehensive changelog, and scan for dependency updates, reducing manual steps and potential errors.
- **Consistency:** Merges related release functionalities into one cohesive module that adheres to semantic versioning and provides comprehensive release information.
- **Improved CI/CD Integration:** Automated release management simplifies integration into continuous deployment pipelines, enhances traceability of changes, and ensures that dependencies remain current.
