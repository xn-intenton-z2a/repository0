# AUTO_SUGGEST Feature Specification

This feature enhances the CLI tool's user experience by providing suggestions when an unknown command is entered. Instead of simply echoing back the input in JSON format, the CLI will display a list of valid commands that the user could have intended to run. The goal is to reduce user error and improve usability in line with the repository's mission to offer handy CLI utilities in Node.js.

## Overview

When a user enters a command that is not recognized, the CLI will:
- Check against a predefined list of valid commands (e.g., `greet`, `help`, `chat`, `export`, `import`, `diagnostics`, `version`, `update`).
- Display an error message indicating that the command is unknown.
- Provide a suggestion message listing the available commands, aiding users to quickly find the correct command.

## Implementation Details

### Source File (src/lib/main.js):
- Update the main function to include a valid commands list. 
- When the command is not recognized (i.e. not `greet` and not any of the known commands), modify the output to include a message such as:
  "Unknown command: <command>. Did you mean one of: greet, help, chat, export, import, diagnostics, version, update?"
- Maintain existing functionality for recognized commands like `greet`.

### Test File (tests/unit/main.test.js):
- Add new test cases to simulate invoking the CLI with an unknown command (e.g., `hepl` or a typo).
- Verify that the output contains the suggestion message with the list of valid commands.
- Ensure that existing tests for recognized commands remain unaffected.

### README File (README.md):
- Update the CLI usage section to document the new behavior for unknown commands.
- Provide examples showing that when an unknown command is entered, the CLI displays a helpful suggestion message.

### Dependencies File (package.json):
- No additional dependencies are required; the implementation should use existing libraries and standard Node.js APIs.

## Benefits

- **Improved User Experience:** Users receive immediate guidance on valid commands, reducing frustration when making typos.
- **Enhanced Usability:** By providing clear suggestions, the CLI becomes more intuitive and user-friendly.
- **Consistency:** This enhancement aligns with the repository's mission to deliver handy CLI utilities in Node.js by ensuring that even error states provide constructive feedback.
