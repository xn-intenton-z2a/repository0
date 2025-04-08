# INTERACTIVE Mode

## Overview
This feature introduces an interactive REPL (Read-Eval-Print Loop) mode for the CLI tool. It enables users to run the CLI in a persistent, interactive session where commands can be entered, executed, and reviewed in real-time. The mode enhances usability, allowing users to experiment with commands, benefit from instant feedback, and leverage the existing command set without having to re-run the process for each command.

## Implementation Details
- **Activation:**
  - The interactive mode will be triggered by the `--interactive` flag. When activated, the application will enter a loop to accept user commands from the standard input.
  - Users can type any supported command (e.g., arithmetic operations, statistical commands, etc.) and see the output immediately.
- **Command Parsing and Execution:**
  - Reuse the existing command parsing logic in `src/lib/main.js` so that commands entered in interactive mode are processed with the same behavior as when invoked via command-line arguments.
  - Maintain a session history stored in memory (in addition to persisting with the COMMAND_HISTORY feature if desired) to allow users to review and re-execute previous commands.
- **User Experience:**
  - Provide a prompt (e.g., `repository0> `) for user inputs.
  - Allow commands like `exit` or `quit` to gracefully terminate the interactive session.
  - Optionally support inline help or command suggestions based on the existing CLI usage info.

## Error Handling & Validation
- Validate user input in real-time and provide immediate feedback using the existing error and warning messaging system.
- Ensure that invalid or unsupported commands are gracefully handled without exiting the interactive session.
- Allow the user to recover from errors and continue using the session without restarting the CLI tool.

## Testing & Documentation
- **Unit Tests:**
  - Add tests to simulate the interactive session by feeding input commands and verifying expected outputs.
  - Ensure that session history gets updated correctly and that command execution in interactive mode matches the behavior in batch mode.
- **Documentation:**
  - Update the README and CLI usage documentation to include information on the interactive mode. Include examples of starting the CLI with `--interactive` and basic operational commands.
  - Document internal changes and inline comments within the updated sections of `src/lib/main.js` to explain the interactive loop implementation.

## Alignment with Repository Mission
This feature reinforces the repository's mission of promoting healthy collaboration and ease of use by providing a dynamic, interactive way to engage with the CLI tool. It lowers the barrier for experimentation and learning, making the tool accessible even for users who prefer a conversational interface.
