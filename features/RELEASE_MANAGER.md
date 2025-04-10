# RELEASE_MANAGER

## Overview
This feature consolidates release management functionalities into a single unified tool. It merges version bumping, changelog generation, dependency scanning, and containerization support into one module. With this update, the feature now also integrates GitHub Releases automation, enabling the creation of draft releases via the GitHub API. This enhancement streamlines the entire release workflow from local version updates to remote release publication, ensuring consistency in packaging, deployment, and versioning.

## Implementation Details
- **CLI Integration:**
  - Introduce a new CLI flag (e.g. `--release`) that accepts subcommands to specify the release operation.
  - Support options for version bump types (patch, minor, major), changelog output formats (markdown or JSON), and containerization actions.
  - Include an additional flag (e.g. `--dockerize`) within the release command to generate a Dockerfile if one is not present.
  - **New:** Add a flag (e.g. `--create-release`) to trigger the GitHub release creation process after local release tasks are completed.

- **Version Bumping & Changelog Generation:**
  - Read and update the current version from `package.json` based on the provided bump type.
  - Generate a changelog from Git logs that includes commit hashes, messages, authors, and timestamps.
  - Output the changelog in either markdown or JSON format as specified by the user.

- **Dependency Scanning:**
  - Use tools like `npm-check-updates` to compare current dependencies against the latest available versions.
  - Generate a report listing outdated dependencies with recommendations for updates.

- **Dockerfile Generation:**
  - Check for an existing Dockerfile in the repository root when the `--dockerize` flag is used.
  - If absent, generate a Dockerfile using information from `package.json` (e.g. Node.js version, project name) following best practices (base image, work directory, dependency installation, port exposure, and command definition).

- **GitHub Releases Integration (New):**
  - If the environment variable `GITHUB_TOKEN` is set, use it to authenticate GitHub API requests.
  - After a successful version bump and changelog generation, automatically create a draft GitHub release.
  - Derive the tag name from the new version and use the generated changelog as the release body.
  - Provide clear logging of release creation success or any encountered errors, with fallback behavior if the API call fails.

- **Combined Workflow & Error Handling:**
  - Allow the version bump, changelog generation, dependency scanning, Dockerfile creation, and GitHub release creation to be executed as a single, combined operation.
  - Implement robust error handling so that failure in one step (e.g. dependency scanning or release creation) does not block other operations. Include rollback options if necessary.

## Testing
- **Unit Tests:**
  - Simulate various version bump scenarios and verify that `package.json` is updated correctly.
  - Use mocked Git outputs to ensure the changelog includes accurate commit information.
  - Test dependency scanning with simulated responses to confirm detection of outdated dependencies.
  - Simulate environments with and without an existing Dockerfile to ensure proper file generation.
  - Add tests for the new GitHub Releases integration, mocking API responses to verify that a release is created when the `--create-release` flag is set and `GITHUB_TOKEN` is provided.

## Documentation
- Update the README and CONTRIBUTING documents with usage examples that show how to invoke the release process with flags for version bumping, Dockerfile generation, and GitHub release creation.
- Provide guidelines on semantic versioning, changelog formatting, and Dockerfile customization.
- Clearly document the prerequisites for GitHub Releases automation, including setting the `GITHUB_TOKEN` environment variable.

## Benefits
- **Streamlined Release Process:** Automates and unifies the release workflow, reducing manual intervention and potential errors.
- **Efficiency:** Combines multiple release activities into a single command, simplifying integration with CI/CD pipelines.
- **Enhanced Packaging & Automation:** Facilitates containerization and remote release publication through automated GitHub Releases, ensuring consistent deployment practices.
