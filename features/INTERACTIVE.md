# INTERACTIVE Mode Enhancement

## Overview
This update expands the existing INTERACTIVE mode by introducing a new batch processing capability. In addition to its current REPL functionality with dynamic auto-completion, in-memory command history, and inline suggestions, the CLI now supports execution of a list of commands from a file in batch mode. This enhancement allows users to automate a series of CLI instructions without waiting for interactive input, further streamlining automation and diagnostics.

## CLI Integration
- **Activation:** In addition to the `--interactive` flag, a new flag `--batch <filepath>` is introduced. When the `--batch` flag is provided with a valid file path, the CLI reads the file line-by-line and executes each command sequentially in non-interactive mode.
- **Mode Selection:** If both `--interactive` and `--batch` are provided, batch mode takes precedence. The output of each command from the file is displayed in the same format as interactive results, supporting both plain text and JSON output modes.
- **Auto-completion & Suggestions:** The REPL auto-completion remains available during interactive sessions, while in batch mode commands are executed without prompting, and errors are reported using the existing error handling functions.

## Implementation Details
- **Batch Processing Logic:**
  - Read the specified file and split its content into individual commands.
  - For each non-empty line, parse global flags and execute the corresponding command using the same logic as the interactive mode.
  - Support inline comments in the batch file (lines starting with `#`) that are ignored during processing.
- **Error Handling:**
  - If the file cannot be located or read, the CLI outputs an appropriate error message.
  - Each command's execution in batch mode inherits the standard error and warning reporting (including positional warnings and JSON metadata when enabled).
- **User Feedback:**
  - After processing, a summary message is provided highlighting the number of commands executed and any errors encountered during batch processing.

## Testing & Documentation
- **Unit Tests:** New tests should simulate batch file processing, ensuring that valid command sequences in a file produce the expected output and that error scenarios (such as missing file or invalid commands) are handled gracefully.
- **Documentation:** Update the README and CLI usage documentation to include examples:
  - Interactive Mode: `node src/lib/main.js --interactive`
  - Batch Mode: `node src/lib/main.js --batch commands.txt`
  - Inline comments in batch files using `#` for better readability.

## Alignment with Repository Mission
Enhancing the INTERACTIVE feature with batch processing capabilities further promotes healthy collaboration and streamlined automation. Users can now automate repetitive tasks by preloading command sequences, aligning with the repository’s mission of providing modular, self-contained CLI utilities for practical automation.