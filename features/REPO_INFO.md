# REPO_INFO

## Overview
This feature consolidates repository metadata and version reporting into a single, unified command. It extends the existing version functionality by also reporting key project information from the package.json file, such as the repository name, description, version, author, license, and repository URL. This integration supports the mission of providing clear, actionable diagnostics and project transparency for both humans and automated systems.

## Implementation Details
- **CLI Flag:**
  - Introduce a new CLI flag (e.g. `--repo-info`) that, when invoked, aggregates repository metadata and version details.
  - When the flag is present, the CLI retrieves information from the `package.json` file and presents it in both plain text and JSON formats.

- **Data Retrieval:**
  - Read and parse `package.json` to extract fields such as `name`, `version`, `description`, `author`, `license`, and optionally the repository URL.
  - Format the output to include both human-readable text and machine-consumable JSON. Similar to the existing version output, provide plain text for quick reference and JSON for automated integrations.

- **Integration with HTTP API:**
  - If the HTTP API server (enabled via `--serve`) is active, add an endpoint (e.g. `/repo-info`) that returns the same consolidated metadata in JSON format.
  - Ensure that the CLI and HTTP implementations share the same underlying logic to prevent inconsistencies.

- **Error Handling:**
  - Implement robust error handling for scenarios where the `package.json` file is missing or contains invalid data. In such cases, output clear error messages and exit with a standardized error code.
  - Maintain backward compatibility by gracefully handling any missing fields.

## Testing
- **Unit Tests:**
  - Create tests to simulate the `--repo-info` CLI flag ensuring that correct metadata is retrieved and formatted as expected in both text and JSON outputs.
  - Verify that the HTTP endpoint `/repo-info` returns the same accurate metadata and proper HTTP status codes.

- **Edge Cases:**
  - Test scenarios where the repository data is incomplete or malformed. The feature should still output useful information or error messages without crashing.

## Documentation
- Update the README and CONTRIBUTING documentation to include instructions on how to use the new `--repo-info` flag and endpoint.
- Provide usage examples such as:
  ```bash
  # CLI invocation
  node src/lib/main.js --repo-info

  # HTTP endpoint access
  curl http://localhost:3000/repo-info
  ```

## Benefits
- **Unified Information Display:** Merges version reporting with comprehensive repository metadata, reducing redundancy.
- **Ease of Integration:** Provides both CLI and HTTP-based access to repository info, facilitating integration with external tools and CI/CD systems.
- **Enhanced Transparency:** Improves project visibility for users and developers, aligning with the repository's mission of promoting healthy collaboration.
