# INTERACTIVE REPL

## Overview
This feature introduces an interactive read-eval-print-loop (REPL) mode for the CLI tool. When enabled, users can launch an interactive session where they can explore and execute all the available commands (such as arithmetic operations, string utilities, and more) in real time. This mode enhances usability, allowing for quicker experimentation, debugging, and learning of the tool's capabilities without having to invoke each command separately through the command line.

## CLI Integration
- **Command Flag:** A new flag `--interactive` (or `--repl`) will trigger the interactive mode. When invoked, the CLI will start an interactive session using Node's built-in readline module.
- **Interactive Session:** In this mode, users can input commands directly. Each command is processed using the existing command mapping. The session will support commands such as `--sum`, `--multiply`, and others along with a dedicated `help` command to list available operations.
- **Session Controls:** Users can exit the REPL by typing a quit command (e.g., `exit` or `quit`). The REPL will also provide inline guidance and display usage instructions if an invalid command is entered.

## Implementation Details
- **Readline Integration:** Utilize Node's `readline` library to capture user input and display output in real-time.
- **Command Parsing:** Input from the interactive session will be tokenized and passed to the existing parsing logic to ensure consistency with standard CLI behavior, including global flags like `--json` if desired.
- **Error Handling:** Errors and warnings will be displayed immediately, adhering to the same standards as non-interactive CLI usage. The interactive mode will also support a summarized help display with usage examples.
- **Documentation & Testing:** Update the README and CLI help documentation to include instructions for launching and using the interactive mode. Unit tests should simulate a REPL session to validate that command parsing and output generation work as expected.

## Alignment with Repository Mission
The INTERACTIVE feature reinforces the repository's mission of promoting healthy collaboration and modular tooling by providing a user-friendly, self-contained environment for real-time command execution. It reduces the barrier to entry for new users and facilitates rapid testing and experimentation, further streamlining the development workflows in a single repository.