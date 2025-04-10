# RELEASE_MANAGER

## Overview
This feature consolidates the functionality of version bumping and changelog generation into a single, unified release management tool. By merging the VERSION_BUMPER and CHANGELOG features, the RELEASE_MANAGER provides streamlined commands for updating the version number in package.json and for generating an up-to-date changelog from Git commit history. This consolidation enhances usability and simplifies the release process, meeting the repository's mission of supporting efficient CI/CD workflows.

## Implementation Details
- **CLI Integration:**
  - Introduce a new CLI flag (e.g. `--release`) that accepts subcommands or arguments to specify the type of release operation.
  - Support options for version bump types (patch, minor, major) and output formats (markdown or JSON) for the changelog.

- **Version Bumping:**
  - Read the current version from package.json, then increment the patch, minor, or major component based on the provided argument.
  - Update package.json with the new version. Optionally, create a backup of the original file to allow rollback if needed.

- **Changelog Generation:**
  - Leverage Git command outputs (e.g. `git log`) to extract commit details such as commit hashes, authors, dates, and messages.
  - Produce a human-readable markdown changelog and/or a JSON formatted output when requested. The changelog should include a generation timestamp and be optionally saved as `CHANGELOG.md`.

- **Combined Workflow:**
  - Allow users to perform both actions in one command by combining version bumping and changelog generation, ensuring that the updated version is reflected in the generated changelog.
  - Implement appropriate error handling and logging, ensuring that failures in one step do not prevent the other from executing when possible.

## Testing
- **Unit Tests:**
  - Simulate various version bump scenarios to confirm that package.json is updated correctly.
  - Use mocks to simulate Git output and ensure that the changelog includes all required commit information.
  - Validate combined operations to ensure both steps are executed as expected.

## Documentation
- Update the README and CONTRIBUTING files with usage instructions, such as:
  ```bash
  # Bump the patch version and generate a changelog
  node src/lib/main.js --release patch
  
  # Bump the minor version and output a JSON formatted changelog
  node src/lib/main.js --release minor --json
  ```
- Document the semantic versioning rules applied and provide guidelines on commit message structure to maximize changelog clarity.

## Benefits
- **Streamlined Release Process:** Offers a single command to both update the version and generate a changelog, reducing manual steps and potential errors.
- **Consistency:** Merges two related functionalities into one cohesive module that adheres to semantic versioning and provides comprehensive release information.
- **Improved CI/CD Integration:** Automated release management simplifies integration into continuous deployment pipelines and enhances traceability of changes.
