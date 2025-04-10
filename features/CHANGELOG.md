# CHANGELOG

## Overview
This feature introduces an automated changelog generator that extracts and formats commit history from the Git repository. The module will parse commit messages and generate a CHANGELOG.md file or output the result in the terminal. This helps maintain an up-to-date record of changes to the repository, facilitating better release management and documentation for CI/CD workflows.

## Implementation Details
- **CLI Flag Integration:**
  - Introduce a new flag `--changelog` in the main CLI (in `src/lib/main.js`). When invoked, the application will run the changelog generator.
  - Optionally support a `--json` flag to output the changelog in a structured JSON format for further automation.
  
- **Git Commit Parsing:**
  - Use Node.js’s `child_process` module to execute Git commands (e.g. `git log`) to retrieve commit history.
  - Parse commit messages to extract key details like commit hash, author, date, and message summary.
  
- **Output Options:**
  - By default, generate a human-readable markdown output that can be saved as `CHANGELOG.md`.
  - When the `--json` flag is provided, output the changelog data in JSON format including metadata such as generation timestamp.
  
- **Modularity:**
  - Implement the changelog generation in a single, dedicated module (e.g. `src/lib/changelog.js`) to keep the functionality self-contained and maintainable.
  
## Testing
- **Unit Tests:**
  - Simulate Git commit outputs using mocks to verify that the parser accurately extracts commit details.
  - Test different output formats (markdown and JSON) and scenarios such as an empty commit history.

## Documentation
- Update the README and CONTRIBUTING files with usage examples:
  ```bash
  # Generate a markdown changelog and save to file
  node src/lib/main.js --changelog

  # Generate changelog in JSON format
  node src/lib/main.js --changelog --json
  ```
- Provide guidelines for structuring commit messages to maximize the usefulness of the generated changelog.

## Benefits
- **Improved Release Documentation:** Automatically update a changelog to record project changes without manual intervention.
- **Enhanced Transparency:** Helps contributors and users track project evolution, supporting better versioning and change management in CI/CD workflows.
- **Actionable Insights:** Facilitates quick audits of changes and easy identification of significant updates across versions.