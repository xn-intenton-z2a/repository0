# VERSION_OUTPUT

## Overview
This feature introduces an enhanced version reporting functionality. When the `--version` flag is used, the application will output the current version as specified in the `package.json` file. The output will be available in multiple formats (plain text and JSON) to support both human readers and automated systems, aligning with the repository’s overall focus on streamlined diagnostics and configurable behaviors.

## Implementation Details
- **Flag Detection:** Extend the CLI parsing in `src/lib/main.js` to check if `--version` is supplied.
- **Version Retrieval:** Read the version number from the `package.json` file. This can be done synchronously for a minimal implementation, ensuring it does not introduce noticeable delay.
- **Output Formatting:** Output the version information in two formats:
  - **Plain Text:** A simple text output of the version number for quick reference (e.g. `v1.4.1-13`).
  - **JSON Format:** A JSON object output for systems integration, for example: `{ "version": "v1.4.1-13" }`.
- **Modularity:** The feature should be implemented in a self-contained manner, updating only `src/lib/main.js` and its associated tests.

## Testing
- **Unit Tests:** Add or update tests in the `tests/unit` folder (e.g. in `main.test.js`) to simulate the `--version` flag and verify the correct version is output in both formats.
- **Edge Cases:** Verify that the version output works when combined with other flags that do not conflict, maintaining precedence for version output.

## Documentation
- **README and CONTRIBUTING:** Update the documentation to include usage examples for the `--version` flag.
- **Usage Examples:** Provide examples in the documentation on how to run the version command:
  ```bash
  node src/lib/main.js --version
  ```
- **Integration Note:** Mention the automated update flow in GitHub workflows to ensure that any version bump in `package.json` reflects across the repository.
