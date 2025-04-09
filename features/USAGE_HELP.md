# USAGE_HELP

## Overview
This feature adds a comprehensive help system to the CLI of repository0. By introducing the `--help` flag, users can easily access detailed usage information, command options, and flag descriptions. This aligns with the repository's mission to promote healthy collaboration and enhanced CI/CD workflows, providing immediate and actionable guidance.

## Implementation Details
- **Flag Detection:** Enhance the CLI parser in `src/lib/main.js` to detect the `--help` flag. When this flag is provided, the program should bypass normal command execution and display the help message.
- **Output Content:** The help message should include:
  - An overview of the repository’s purpose and mission.
  - Descriptions and usage examples for each command and flag, including but not limited to `--diagnostics`, `--toggle-allow-nan`, `--allow-nan-inline`, `--diagnose-nan`, and `--ignore-invalid`.
  - Guidance on troubleshooting common issues as aligned with the diagnostics features.
- **Modularity:** Implement the help functionality in a single module, ensuring it remains isolated and easy to maintain. This module should be invoked from the main entry point if `--help` is detected.

## Testing
- **Unit Tests:** Add automated tests (e.g., in `tests/unit/main.test.js`) to verify that passing `--help` produces output containing key phrases from the help guide.
- **Edge Cases:** Ensure the help command works correctly even when combined with other flags, by prioritizing help output.

## Documentation
- Update `README.md` and `CONTRIBUTING.md` to reference the new `--help` flag, including quick start and detailed usage sections.
- Ensure that all help output is consistent with inline documentation and the repository's mission outlined in `MISSION.md`.
