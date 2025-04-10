# RELEASE_MANAGER

## Overview
This feature consolidates release management functionalities into a single unified tool. It merges version bumping, changelog generation, dependency scanning, and containerization support into one module. By combining the previously separate RELEASE_MANAGER and DOCKERIZER features, this update streamlines the release process and ensures that project packaging, deployment, and versioning follow a consistent, automated workflow.

## Implementation Details
- **CLI Integration:**
  - Introduce a new CLI flag (e.g. `--release`) that accepts subcommands to specify the release operation.
  - Support options for version bump types (patch, minor, major), changelog output formats (markdown or JSON), and containerization actions.
  - Include an additional flag (e.g. `--dockerize`) within the release command to generate a Dockerfile if one is not present.

- **Version Bumping & Changelog Generation:**
  - Read the current version from `package.json` and increment the version based on the provided bump type.
  - Update `package.json` with the new version, optionally backing up the previous version.
  - Leverage Git logs to generate a comprehensive changelog that includes commit hashes, messages, authors, and timestamps. Output the changelog in either markdown or JSON formats as specified by the user.

- **Dependency Scanning:**
  - Integrate dependency scanning (using tools like `npm-check-updates`) to compare current dependencies against the latest available versions.
  - Generate a report that lists outdated dependencies along with current and recommended versions.
  - Optionally allow the user to automatically update dependencies via an interactive prompt or an automation flag (e.g. `--auto-update-deps`).

- **Dockerfile Generation (Merged from DOCKERIZER):**
  - Check if a Dockerfile exists in the repository root when the `--dockerize` flag is used with the release command.
  - If absent, generate a Dockerfile using information from `package.json` (e.g. Node.js version, project name, main script) and standard best practices:
    - Set a base image (e.g. `FROM node:20`)
    - Define a working directory (e.g. `WORKDIR /app`)
    - Copy necessary files and install dependencies
    - Expose a default port if applicable
    - Define the default command to run the application

- **Combined Workflow & Error Handling:**
  - Ensure that the version bump, changelog generation, dependency scanning, and Dockerfile creation can be executed as a single combined operation.
  - Implement robust error handling so that failure in one step (e.g. dependency scanning) does not block other release operations. Log appropriate messages and provide rollback options if necessary.

## Testing
- **Unit Tests:**
  - Simulate various version bump scenarios and verify that `package.json` is updated correctly.
  - Mock Git command outputs to ensure the changelog includes all required commit information.
  - Test dependency scanning with mocked responses to verify accurate detection of outdated dependencies.
  - Simulate environments with and without an existing Dockerfile to ensure proper file generation only when necessary.

- **Edge Cases:**
  - Handle missing or malformed `package.json` files gracefully, with clear error messages.
  - Validate behavior when no outdated dependencies are present, ensuring the tool communicates a clean dependency state.

## Documentation
- Update README and CONTRIBUTING documents with usage examples. Example commands include:
  ```bash
  # Bump patch version, generate changelog, scan for outdated dependencies, and generate a Dockerfile if missing
  node src/lib/main.js --release patch --scan-deps --dockerize

  # Bump minor version with JSON formatted output
  node src/lib/main.js --release minor --scan-deps --dockerize --json
  ```
- Provide guidelines on semantic versioning rules, changelog formatting, and Dockerfile customization.

## Benefits
- **Streamlined Release Process:** Automates and unifies the release workflow, reducing manual steps and potential errors.
- **Efficiency:** Combines related release activities into a single command, saving time and simplifying CI/CD pipeline integration.
- **Enhanced Packaging:** Facilitates containerization by providing an automated Dockerfile generation process alongside traditional release tasks.