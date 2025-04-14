# CHAT_SESSION Feature Specification

This feature introduces an interactive chat session mode in the CLI tool. It leverages the repository’s support for persistent multi-turn conversation along with optional session titling. When the user invokes the CLI with the "chat" command, the tool will initiate an interactive chat session, where input is read from the terminal and the conversation is stored in the persistent history file (`.chat_history.json`).

## Overview

The CHAT_SESSION feature provides an interactive mode to engage in multi-turn conversations directly via the CLI. It allows a user to start a session with an optional title, follow an interactive prompt, and have all conversation turns be appended to the history file. This enhancement clearly aligns with the repository mission to provide handy CLI utilities while taking advantage of the persistent chat functionality described in package metadata.

## Implementation Details

### Source File (src/lib/main.js):
- Update the main function to detect if the first argument is "chat".
- When the "chat" command is detected, initialize an interactive session using Node.js’ built-in `readline` module.
- Optionally read a session title from CLI arguments (e.g., `--title="My Session"`) and display it at the start of the session.
- As the user inputs messages, the session will echo acknowledgement and simulate storing the input into the `.chat_history.json` file (for actual persistence, further implementation would be required, but this feature provides the CLI backbone for future enhancements).
- Ensure proper exit when the user types a designated exit command (e.g., `exit` or via CTRL+C).

### Test File (tests/unit/main.test.js):
- Add tests to simulate invoking the CLI with the "chat" command.
- Since an interactive session may be difficult to simulate fully in unit tests, include tests to verify that the proper prompt message (e.g., "Entering chat session...") is printed when invoking the chat command.
- Mock the readline interface to simulate session termination and input handling.

### README File (README.md):
- Update the documentation with a new section describing the interactive chat session.
- Provide usage examples such as:
    - `node src/lib/main.js chat`
    - `node src/lib/main.js chat --title="Project Discussion"`
- Explain the purpose of the interactive chat mode and its benefits for persistent conversation logging.

### Dependencies (package.json):
- No additional dependencies are required, as the feature uses Node.js’ built-in `readline` module.
- Ensure that any necessary changes to scripts (if any) are minimal and aligned with the current CLI usage.

## Benefits

- Provides an interactive mode for engaging in multi-turn conversations directly in the terminal.
- Enhances user experience by allowing session titling and simulating persistent chat history functionality.
- Aligns with the mission of the repository to deliver handy CLI utilities in Node.js, building upon the existing export and import chat features.
