# VERSION_BUMPER

## Overview
This feature introduces an automated version bumping tool that allows users to update the version number in the repository's package.json in line with semantic versioning practices. By adding a new CLI flag (`--bump-version`), developers can specify the type of version increment (patch, minor, or major) and seamlessly update the version. This feature provides a streamlined process to manage version updates and helps maintain a consistent release process.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a new CLI flag `--bump-version` which accepts an argument (patch, minor, or major).
  - When invoked, the tool reads the current version from `package.json`, computes the new version based on the provided increment type, and updates the file accordingly.

- **Version Parsing and Bumping:**
  - Use a simple semantic version parser to split the version string (for example, `1.4.1` or `1.4.1-13`).
  - Increment the appropriate segment:
    - *Patch:* Increment the last number (e.g. `1.4.1` becomes `1.4.2`).
    - *Minor:* Increment the middle number and reset the patch (e.g. `1.4.1` becomes `1.5.0`).
    - *Major:* Increment the first number and reset minor and patch (e.g. `1.4.1` becomes `2.0.0`).
  - Optionally, preserve or clear pre-release identifiers according to configuration.

- **File Handling and Safety:**
  - Read and write to the `package.json` file using Node.js file system APIs.
  - Optionally, create a backup copy of `package.json` before updating to provide a rollback mechanism in case of failure.
  - Provide clear logging messages for successful version bumps and error handling if any step fails.

- **Testing:**
  - Add unit tests (e.g. in `tests/unit/versionBumper.test.js`) that simulate various version bump scenarios. 
  - Ensure that edge cases (e.g. malformed version strings or missing version fields) are properly handled.

## Documentation
- Update the README and CONTRIBUTING files with usage examples:
  ```bash
  # Bump the patch version
  node src/lib/main.js --bump-version patch

  # Bump the minor version
  node src/lib/main.js --bump-version minor

  # Bump the major version
  node src/lib/main.js --bump-version major
  ```
- Document the semantic versioning rules employed by the feature and provide guidelines for usage in automated release workflows.

## Benefits
- **Simplified Version Management:** Automates a common manual step, reducing human error during releases.
- **Consistency:** Ensures that version increments adhere to semantic versioning principles across all releases.
- **Integration:** Easily integrates with CI/CD pipelines to automatically update and tag new releases.
