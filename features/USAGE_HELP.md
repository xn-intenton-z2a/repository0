# USAGE_HELP

## Overview
This feature provides a comprehensive help system for the CLI that not only delivers static documentation for flags and commands but also dynamically aggregates and displays available commands, options, and usage examples by inspecting the CLI configuration. By integrating with the argument parser module, it ensures that the help documentation remains up-to-date with any changes across the repository. The updated help feature aligns with the repository's mission of fostering healthy collaboration and supports robust CI/CD workflows by offering clear guidance and troubleshooting tips.

## Implementation Details
- **Dynamic Help Content:**
  - Extend the existing `--help` flag detection in `src/lib/main.js` to dynamically retrieve available CLI flags and command descriptions from the argument parser module (`src/lib/argParser.js`).
  - Automatically generate a consolidated help message that incorporates usage examples and detailed information for each flag (e.g., `--diagnostics`, `--version`, `--serve`, and others).

- **CLI Integration:**
  - Ensure that the help system is triggered exclusively when the `--help` flag is passed, bypassing other CLI operations.
  - Maintain backward compatibility by preserving existing static help content while enhancing it with dynamic detection of new or updated commands.

- **Testing:**
  - Implement unit tests in `tests/unit/main.test.js` and new tests in a dedicated file (e.g., `tests/unit/usageHelp.test.js`) to ensure that the dynamic help output includes all expected flags and commands.
  - Simulate edge cases where certain flags might be deprecated or missing, verifying that the help output falls back gracefully with clear messaging and usage instructions.

- **Documentation:**
  - Update `README.md` and `CONTRIBUTING.md` with references to the enhanced help functionality.
  - Provide examples in the documentation on how to invoke the help message, and include sample outputs that demonstrate both static and dynamic content.

## Benefits
- **Enhanced User Guidance:** Provides an up-to-date, comprehensive help system that reduces the learning curve for new users.
- **Dynamic Updates:** Automatically adjusts to changes in CLI features without requiring manual updates to the help documentation.
- **Improved CI/CD Insights:** Facilitates easier troubleshooting and guidance, which is especially beneficial in automated environments and during CI/CD runs.
