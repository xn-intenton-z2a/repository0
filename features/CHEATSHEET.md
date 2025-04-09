# CHEATSHEET

## Overview
This feature introduces a comprehensive cheatsheet module to the CLI tool. It provides users with a summarized guide of all available commands, their aliases, usage examples, and brief descriptions. This serves as a quick reference that enhances user onboarding and reduces the need to sift through extensive documentation.

## CLI Integration
- **Command Flag:** A new global flag `--cheatsheet` will be added.
- **Usage:** When this flag is invoked, the CLI tool will display a neatly formatted table or list containing all available commands (e.g., `--sum`, `--multiply`, `--config`, etc.), their short aliases (if any), and concise descriptions.
- **Output Modes:** The cheatsheet output will support both plain text (for terminal users) and JSON mode (when `--json` or `--json-pretty` is provided), ensuring machine readability if required.

## Implementation Details
- **Module Structure:** The cheatsheet functionality will be implemented in a single source file (e.g., `src/lib/cheatsheet.js`) that is imported by the main CLI parser. This module will aggregate command definitions and descriptions from the existing command mapping.
- **Dynamic Generation:** The cheatsheet will be generated dynamically by iterating over the command mapping structure, ensuring that any updates to available commands are automatically reflected in the cheatsheet output.
- **Formatting:** In plain text mode, the output will be formatted for readability (using columns or bullet lists). In JSON mode, a structured object containing command names, aliases, and descriptions will be returned.

## Testing & Documentation
- **Unit Tests:** Tests will be created to verify that the cheatsheet output includes all commands, is correctly formatted, and is consistent between plain text and JSON output modes.
- **Documentation:** The README and help documentation will be updated to reference the new `--cheatsheet` command, including usage examples.

## Alignment with Repository Mission
The CHEATSHEET feature supports the repository’s mission of promoting healthy collaboration and streamlined automation. By providing a clear reference of available CLI commands in a self-contained module, it enhances usability, reduces learning overhead, and encourages effective use of the repository’s modular utilities.
